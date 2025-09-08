import React, { useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";
import socket from "../utils/socket";
import { useSelector, useDispatch } from "react-redux";
import { addNotification, removeNotification, storeNotifications } from "../store/NotificationReducer";

function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Notifications = () => {
  const axios = useAxios();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("notification", (notification) => {
      setNotifications((prev) => {
        const updated = [notification, ...prev];
        return updated.sort((a, b) => {
          const aRead = isNotificationRead(a);
          const bRead = isNotificationRead(b);
          return aRead === bRead ? 0 : aRead ? 1 : -1;
        });
      });
    });
    return () => {
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/notifications");
        const sortedNotifications = (res.data.notifications || []).sort((a, b) => {
          const aRead = isNotificationRead(a);
          const bRead = isNotificationRead(b);
          return aRead === bRead ? 0 : aRead ? 1 : -1;
        });
        setNotifications(sortedNotifications);
      } catch (err) {
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [dispatch]);

  const isNotificationRead = (notification) => {
    if (notification.receiver) {
      return notification.isRead;
    } else {
      return notification.readBy && user && notification.readBy.includes(user._id);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!isNotificationRead(notification)) {
      try {
        await axios.patch(`/notifications/unread/${notification._id}`);
        dispatch(removeNotification());
        setNotifications((prev) =>
          prev.map((n) => {
            if (n._id === notification._id) {
              if (n.receiver) {
                return { ...n, isRead: true };
              } else {
                return { ...n, readBy: [...(n.readBy || []), user._id] };
              }
            }
            return n;
          }).sort((a, b) => {
            const aRead = isNotificationRead(a);
            const bRead = isNotificationRead(b);
            return aRead === bRead ? 0 : aRead ? 1 : -1;
          })
        );
      } catch (err) {
        setError("Failed to mark notification as read");
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/notifications");
      const sortedNotifications = (res.data.notifications || []).sort((a, b) => {
        const aRead = isNotificationRead(a);
        const bRead = isNotificationRead(b);
        return aRead === bRead ? 0 : aRead ? 1 : -1;
      });
      setNotifications(sortedNotifications);
      setError("");
    } catch (err) {
      setError("Failed to refresh notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-12 px-4 transition-all duration-500">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notifications</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
              aria-label="Refresh notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 11v-5h-5m-9 4l7-7m0 0l7 7m-7-7v14" />
              </svg>
            </button>
            <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
              {unreadCount} Unread
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600 dark:text-red-400 font-medium text-lg animate-fadeIn">{error}</div>
        ) : (
          <ul className="space-y-4">
            {notifications.length === 0 ? (
              <li className="text-center py-16 text-gray-500 dark:text-gray-400 font-medium text-lg animate-fadeIn">
                No notifications yet
              </li>
            ) : (
              notifications.map((notification, index) => {
                const read = isNotificationRead(notification);
                return (
                  <li
                    key={notification._id}
                    className={`w-full p-6 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 shadow-sm border hover:shadow-md animate-slideIn ${index > 0 ? 'animation-delay-100' : ''} ${
                      read
                        ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        : "bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-600"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0">
                      {read ? (
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-base font-medium ${
                          read ? "text-gray-700 dark:text-gray-300" : "text-blue-800 dark:text-blue-200"
                        } transition-colors duration-300`}
                      >
                        {notification.content}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors duration-300 ${
                        read ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {read ? "Read" : "Unread"}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Notifications;