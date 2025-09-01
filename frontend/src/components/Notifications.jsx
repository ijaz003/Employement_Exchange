import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../utils/socket";
import { useSelector } from "react-redux";

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
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => {
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/notifications", { withCredentials: true });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const isNotificationRead = (notification) => {
    if (notification.receiver) {
      return notification.isRead;
    } else {
      // global notification
      return notification.readBy && user && notification.readBy.includes(user._id);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!isNotificationRead(notification)) {
      try {
        await axios.patch(`http://localhost:4000/notifications/unread/${notification._id}`, {}, { withCredentials: true });
        setNotifications((prev) =>
          prev.map((n) => {
            if (n._id === notification._id) {
              if (n.receiver) {
                return { ...n, isRead: true };
              } else {
                // global notification
                return { ...n, readBy: [...(n.readBy || []), user._id] };
              }
            }
            return n;
          })
        );
      } catch (err) {
        setError("Failed to mark notification as read");
      }
    }
  };

  return (
    <section className="max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">Notifications</h2>
      {loading ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length === 0 ? (
            <li className="py-6 text-center text-gray-500 dark:text-gray-400">No notifications yet.</li>
          ) : (
            notifications.map((notification) => {
              const read = isNotificationRead(notification);
              return (
                <li
                  key={notification._id}
                  className={`py-4 px-3 flex items-center gap-3 cursor-pointer transition-all duration-200 rounded-lg ${read ? "bg-gray-50 dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-1">
                    <span className={`block text-base font-medium ${read ? "text-gray-800 dark:text-gray-200" : "text-blue-800 dark:text-blue-200"}`}>
                      {notification.content}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${read ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {read ? "Read" : "Unread"}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </section>
  );
};

export default Notifications;