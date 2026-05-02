import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useNotification } from "../context/useNotification";

export const NotificationBell = ({ userId: userIdProp } = {}) => {
  const {
    notifications,
    markAsRead,
    removeNotification,
    clearAll,
    fetchNotifications,
  } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const userId =
    userIdProp ||
    localStorage.getItem("userID") ||
    sessionStorage.getItem("userID");
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    // Fetch notifications when component mounts
    if (userId) {
      fetchNotifications(userId);
    }
  }, [userId, fetchNotifications]);

  const handleMarkAsRead = (notificationId) => {
    if (userId) {
      markAsRead(notificationId, userId);
    }
  };

  const handleRemove = (e, notificationId) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  const getNotificationIcon = (type) => {
    const baseClass = "w-4 h-4";
    switch (type) {
      case "appointment":
        return (
          <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
          </svg>
        );
      case "payment":
        return (
          <svg className={baseClass} fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        );
      default:
        return <Bell className={baseClass} />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 z-50 top-full max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition group ${
                    !notif.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                          notif.type === "appointment"
                            ? "bg-emerald-100 text-emerald-600"
                            : notif.type === "payment"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {notif.title}
                          </h4>
                          {!notif.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleRemove(e, notif.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
