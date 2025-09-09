import { Toaster, toast } from "react-hot-toast";
import React from "react";

// Modern close button (pure SVG, Tailwind only)
const CustomCloseButton = ({ closeToast }) => (
  <button
    onClick={closeToast}
    className="ml-3 flex items-center justify-center w-7 h-7 rounded-full 
               bg-white/20 hover:bg-white/30 transition-colors shrink-0"
    aria-label="Close toast"
  >
    <svg
      className="w-4 h-4 text-white"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6L14 14M6 14L14 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </button>
);

const CustomToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 1500,
      // Base style (applies to all toasts)
      className:
        "rounded-2xl px-4 py-3 shadow-lg font-medium text-white flex items-center justify-between gap-3 w-full max-w-sm",
      // Success style
      success: {
        className:
          "bg-gradient-to-r from-green-500 to-emerald-400 rounded-2xl px-4 py-3 shadow-lg font-medium text-white flex items-center justify-between gap-3 w-full max-w-sm",
      },
      // Error style
      error: {
        className:
          "bg-gradient-to-r from-red-500 to-rose-400 rounded-2xl px-4 py-3 shadow-lg font-medium text-white flex items-center justify-between gap-3 w-full max-w-sm",
      },
      render: (t) => (
        <div className="flex items-center w-full">
          {/* Toast icon */}
          <span className="mr-2">{t.icon}</span>
          {/* Toast message */}
          <span className="flex-1">{t.message}</span>
          {/* Close button */}
          <CustomCloseButton closeToast={() => toast.dismiss(t.id)} />
        </div>
      ),
    }}
  />
);

export default CustomToaster;
