# Global Notification System - Usage Guide

The application now has a global notification system that works across all sites (admin, doctor dashboard, and patient pages). This system includes:

1. **Toast Notifications** - Temporary notifications that appear in the top-right corner
2. **Notification Bell** - A global notification bell with a dropdown panel that shows all user notifications from the database

## Setup

The notification system is already integrated into `src/App.jsx`:

- `NotificationProvider` wraps the entire application
- `ToastNotification` component displays temporary toasts

## Using Notifications

### 1. Toast Notifications (Temporary Alerts)

Use toast notifications for immediate feedback on user actions (success, error, warning, info).

```jsx
import { useNotification } from "../context/useNotification";

function MyComponent() {
  const { addToast } = useNotification();

  const handleAction = async () => {
    try {
      // Do something
      addToast("Success! Action completed", "success", 3000);
    } catch (error) {
      addToast("Error: Something went wrong", "error", 3000);
    }
  };

  return <button onClick={handleAction}>Click Me</button>;
}
```

**Toast Types:**

- `'success'` - Green background, check icon
- `'error'` - Red background, alert icon
- `'warning'` - Yellow background, alert icon
- `'info'` - Blue background, info icon

**Duration:** In milliseconds (0 = persistent)

### 2. Notification Bell with Persistent Notifications

The `<NotificationBell />` component automatically:

- Fetches notifications from the database for the logged-in user
- Shows a badge with the count of unread notifications
- Allows users to mark notifications as read
- Displays notification details with timestamps

**Already integrated in:**

- Admin Dashboard
- Admin Users page
- Doctor Dashboard
- Patient Navbar

### 3. Manual Notification Management

```jsx
import { useNotification } from "../context/useNotification";

function MyComponent() {
  const {
    notifications, // Array of notification objects
    fetchNotifications, // Fetch notifications from API
    markAsRead, // Mark specific notification as read
    clearAll, // Clear all notifications
    removeNotification, // Remove a single notification
  } = useNotification();

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (userId) {
      fetchNotifications(userId);
    }
  }, []);

  return (
    <>
      <p>Total notifications: {notifications.length}</p>
      <p>Unread: {notifications.filter((n) => !n.is_read).length}</p>
    </>
  );
}
```

## Adding Notifications from Backend

Backend code already creates notifications in:

- `db.js` - `createNotification()` function

Example backend usage:

```javascript
await createNotification(
  userId,
  "Payment Successful",
  "Your payment has been processed",
  "payment",
  { payment_id: 123, amount: 500 },
);
```

## Notification Types

Common notification types in the system:

- `'appointment'` - Appointment-related notifications (green indicator)
- `'payment'` - Payment-related notifications (blue indicator)
- `'general'` - General notifications (gray indicator)
- Add more types as needed

## API Endpoints

The system uses these backend endpoints:

- `GET /api/users/:userId/notifications?page=1&limit=20` - Fetch user notifications
- `PATCH /api/notifications/:notificationId/read` - Mark notification as read

## Database Schema

Notifications are stored in the `notifications` table:

```sql
id: BIGSERIAL PRIMARY KEY
user_id: BIGINT (references users)
title: VARCHAR(160)
message: TEXT
type: VARCHAR(40)
metadata: JSONB
is_read: BOOLEAN
read_at: TIMESTAMPTZ
created_at: TIMESTAMPTZ
```

## Best Practices

1. **Always use useNotification hook** within a component that's under `NotificationProvider`
2. **For immediate feedback**, use toast notifications with 3-5 second duration
3. **For persistent items**, rely on the Notification Bell which fetches from database
4. **Clear old toasts** by setting duration to 0 for important alerts that shouldn't auto-dismiss
5. **Include metadata** in database notifications for future features like action links

## Components

### ToastNotification

- Location: `src/components/ToastNotification.jsx`
- Displays temporary toast notifications
- Automatically added to App.jsx

### NotificationBell

- Location: `src/components/NotificationBell.jsx`
- Displays bell icon with unread count
- Shows notification dropdown panel
- Fetches real notifications from database

### Context

- Location: `src/context/NotificationContext.jsx`
- Provides global notification state
- Location: `src/context/useNotification.js`
- Custom hook to access notification context

## Testing

To test the notification system:

1. **Toast Test:**

   ```jsx
   import { useNotification } from "../context/useNotification";

   function TestComponent() {
     const { addToast } = useNotification();
     return (
       <button onClick={() => addToast("Test toast", "success")}>
         Show Toast
       </button>
     );
   }
   ```

2. **Bell Test:**
   - Add `<NotificationBell />` to any page
   - Create a notification in database for the logged-in user
   - Notification should appear in the bell dropdown

## Troubleshooting

**Notifications not showing:**

- Ensure `NotificationProvider` wraps the entire app (check App.jsx)
- Verify user ID is stored in localStorage
- Check browser console for errors

**Bell not fetching:**

- Check network tab for API calls
- Verify user has notifications in database
- Ensure userID is available in localStorage

**Toasts not appearing:**

- Check if `ToastNotification` component is rendered (check App.jsx)
- Verify `useNotification` is called within a component wrapped by provider
