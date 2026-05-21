# Fix: Slots Not Being Cleared When Switching Between Days

## Problem

When setting up schedules:

1. User selects Monday and adds slots (09:00-17:00, 10 patients)
2. User clicks Tuesday to set up different times
3. **Monday's slots were still showing up** or being added to Tuesday's configuration
4. User couldn't have separate configurations for different days

## Root Cause

The calendar click handler was using `toggleDay()` which **adds** or **removes** days from the selection instead of **switching** to that day.

**What was happening:**

- Click Monday → selectedDays = [1]
- Click Tuesday → selectedDays = [1, 2] (added Tuesday instead of switching)
- UI showed multi-day editor with both days' slots together
- When adding new slots, they were being added to ALL selected days

## Solution Implemented

Changed the calendar click behavior to **switch** to a single day instead of toggling:

**File: src/pages/doctor/AppointmentDetails.jsx**

Added new `switchDay()` function:

```javascript
const switchDay = (dow) => {
  // When clicking calendar in day mode: REPLACE selection instead of toggle
  setSelectedDays([dow]);
  setSelectedDate(null);
};
```

Updated `handleDateClick()`:

```javascript
const handleDateClick = (cellDate) => {
  if (mode === "day")
    switchDay(cellDate.getDay()); // Changed from toggleDay
  else {
    setSelectedDate(cellDate);
    setSelectedDays([]);
  }
};
```

## Behavior After Fix

### Single Day Selection (Calendar Clicks)

- Click Monday → view/edit only Monday's slots
- Click Tuesday → switch to Tuesday (Monday is deselected)
- Clear slots from previous day no longer show up

### Multiple Day Selection (Quick Select Buttons)

- Click M button → select Monday
- Click T button → **add** Tuesday to selection (still toggling)
- UI shows multi-day editor for both Monday and Tuesday
- Users can configure same schedule for multiple days at once

## User Workflow Now

1. **To set different schedules for different days:**
   - Click Monday in calendar → configure Monday
   - Click Tuesday in calendar → configure Tuesday
   - No slot overlap

2. **To set the same schedule for multiple days:**
   - Click M button, T button, W button (Quick Select)
   - Add slots once → applied to all selected days
   - Click day in calendar to edit one day individually

## Testing

The fix is live in the code. Try:

1. Click Monday → Add slots (09:00-17:00, 10 patients)
2. Click Tuesday in the calendar → Should see empty slots
3. Add new slots to Tuesday with different times
4. Each day should keep its own separate configuration
