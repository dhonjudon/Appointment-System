import React from "react";
import { X, AlertCircle, Check, Info } from "lucide-react";
import { useNotification } from "../context/useNotification";

export const ToastNotification = () => {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slideIn ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : toast.type === "warning"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          {toast.type === "success" && (
            <Check className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "warning" && (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}

          <span className="text-sm font-medium flex-1">{toast.message}</span>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
