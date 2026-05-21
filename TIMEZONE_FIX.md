# Timezone Offset Bug Fix - Complete Solution

## Problem Summary

When doctors set appointment availability by specific date (e.g., May 27th), the system was:

- Recording schedules on the **wrong date** (26th, 25th, 24th, etc.)
- Creating **duplicate schedules** due to failed date matching on deactivation
- **Not highlighting** correctly set dates in the calendar

### Root Cause

PostgreSQL's DATE type, when serialized to JSON, includes a timestamp with UTC timezone:

- Database stores: `DATE '2025-05-27'` (date only, no timezone)
- API returns: `"2025-05-27T00:00:00.000Z"` (UTC time equivalent)
- In Nepal timezone (+5:45): `"2025-05-27T00:00:00.000Z"` = `2025-05-26 18:15:00` (one day earlier!)
- Frontend does `.slice(0, 10)` → Gets `"2025-05-26"` instead of `"2025-05-27"`

## Solution Implemented

### Backend Changes (server/db.js)

Cast `specific_date` from DATE to TEXT in all SELECT queries to prevent timezone conversion:

**All 5 affected queries updated:**

1. **getAvailableSchedules() - No date query** (Line 452)

   ```sql
   SELECT ... specific_date::text, ...
   ```

2. **getAvailableSchedules() - Date override query** (Line 473)

   ```sql
   SELECT ... specific_date::text, ...
   ```

3. **getAvailableSchedules() - Day fallback query** (Line 490)

   ```sql
   SELECT ... specific_date::text, ...
   ```

4. **getDoctorSchedules() - Main fetch** (Line 534)

   ```sql
   SELECT ... specific_date::text, ...
   ```

5. **setAvailability() - Insert return** (Line 724)
   ```sql
   RETURNING ... specific_date::text, ...
   ```

### Frontend Changes (src/pages/doctor/AppointmentDetails.jsx)

- Updated comment (Line 131) to clarify date format
- No functional code changes needed - existing `.slice(0, 10)` works correctly with plain date strings

## Verification

After the fix, dates are returned in this format:

- **Before**: `"2025-05-27T00:00:00.000Z"` (with timezone)
- **After**: `"2025-05-27"` (plain date string)

Pattern: `/^\d{4}-\d{2}-\d{2}$/` (YYYY-MM-DD format)

## Testing the Fix

1. Doctor sets availability for a specific date (e.g., May 27th)
2. Server now returns the date as plain `"2025-05-27"`
3. Frontend correctly stores and highlights the date
4. Calendar shows the correct date with "Date override" highlighting
5. Attempting to set the same date again overwrites properly (no duplicates)

## Impact

- ✅ Dates no longer shift to previous day
- ✅ No more duplicate schedules
- ✅ Calendar highlighting works correctly
- ✅ Date-specific overrides properly deactivate old entries before inserting new ones

## Notes

- The INSERT statements don't need `::text` cast - they use the parameter as-is
- The `::date` cast in WHERE clauses ensures proper date comparison
- This fix is timezone-agnostic - works in any timezone (Nepal +5:45, UTC, etc.)
