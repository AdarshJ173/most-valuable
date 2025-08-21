# 🎯 Raffle Countdown Timer Setup Guide

## Overview
A beautiful, minimalistic countdown timer integrated with your raffle system that displays in the shop page header. The timer connects to your Convex database and shows real-time updates.

## ✨ Features

- **Real-time Countdown**: Updates every second
- **Database Integration**: Pulls dates from raffle configuration  
- **Mobile Responsive**: Beautiful on all devices
- **State Awareness**: Shows different states (active, ended, inactive, winner selected)
- **Entry Counter**: Displays total raffle entries
- **Minimalistic Design**: Clean, aesthetic appearance

## 🎨 Design

The timer displays in a glassmorphic card in the shop header with:
- Animated clock emoji (⏰)
- Professional countdown format (DD:HH:MM:SS)
- Entry count badge
- Status indicators for different states

## 🚀 Quick Setup

### 1. Initialize Raffle Configuration

```bash
# Set up a new raffle with 7-day timer
node scripts/init-raffle-timer.js
```

This creates a raffle that:
- Starts immediately
- Runs for 7 days  
- $25 per entry, $100 for 5 entries
- "Most Valuable Holiday Collection" theme

### 2. Update Raffle Dates (Optional)

```bash
# Extend raffle by 30 days from now
node scripts/update-raffle-dates.js 30

# Extend raffle by 14 days from now  
node scripts/update-raffle-dates.js 14
```

### 3. View the Timer

Visit `/shop` to see the countdown timer in action!

## 🛠️ Manual Configuration

### Via Admin API

You can also configure the raffle via the admin API:

```bash
curl -X POST https://your-domain.com/api/admin/raffle \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "setup_raffle",
    "name": "Custom Raffle Name",
    "startDate": "2025-08-25T00:00:00Z",
    "endDate": "2025-09-25T23:59:59Z", 
    "pricePerEntry": 25,
    "bundlePrice": 100,
    "bundleSize": 5,
    "productName": "Your Product Name",
    "productDescription": "Your product description"
  }'
```

### Extending Raffle

```bash
curl -X POST https://your-domain.com/api/admin/raffle \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "extend_raffle",
    "newEndDate": "2025-10-25T23:59:59Z"
  }'
```

## 📱 Timer States

### 1. **Active State** 
Shows countdown when raffle is running:
```
🎯 Raffle  ⏰ Ends in  07:12:45:32  🎫 15 entries
```

### 2. **Ended State**
Shows when raffle has finished:
```
🎯 Raffle  🏁 Raffle Ended  [Winner Selected]
```

### 3. **Inactive State**
Shows when raffle is not active:
```
🎯 Raffle  ⏸️ Raffle Inactive
```

### 4. **Loading State**
Shows skeleton animation while loading:
```
🎯 Raffle  [loading animation]
```

## 🎯 Component Usage

The `RaffleCountdownTimer` component is automatically included in the shop page, but you can use it elsewhere:

```tsx
import { RaffleCountdownTimer } from "@/components/RaffleCountdownTimer";

<RaffleCountdownTimer className="custom-styles" />
```

## 📊 Database Schema

The timer reads from the `raffleConfig` table:

```typescript
{
  name: string,                     // Raffle display name
  startDate: number,               // Start timestamp
  endDate: number,                 // End timestamp  
  isActive: boolean,               // Is raffle active
  totalEntries: number,            // Current entry count
  hasWinner: boolean,              // Winner selected flag
  productName: string,             // Product being raffled
  // ... other fields
}
```

## 🔧 Customization

### Styling

The timer uses Tailwind classes and can be customized:

```tsx
// Different sizes
<RaffleCountdownTimer className="text-xs" />      // Small
<RaffleCountdownTimer className="text-lg" />      // Large

// Custom colors  
<RaffleCountdownTimer className="text-blue-400" />

// Custom spacing
<RaffleCountdownTimer className="gap-4 px-8" />
```

### Timer Format

Edit `RaffleCountdownTimer.tsx` to customize the display format:

```tsx
// Show only hours and minutes
{timeRemaining.hours > 0 && (
  <div className="timer-unit">
    {formatNumber(timeRemaining.hours)}
    <span>H</span>
  </div>
)}
```

## ⚡ Performance

- **Real-time Updates**: Timer updates every second using `setInterval`
- **Database Optimization**: Uses Convex reactive queries for efficient updates  
- **Memory Management**: Properly cleans up intervals on unmount
- **Mobile Optimized**: Responsive design with smaller text on mobile

## 🐛 Troubleshooting

### Timer Not Showing

1. **Check Database**: Ensure raffle config exists
   ```bash
   curl -X GET "https://your-domain.com/api/admin/raffle?action=current_raffle" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

2. **Check Convex Connection**: Verify `NEXT_PUBLIC_CONVEX_URL` is set

3. **Check Component Import**: Ensure proper import in shop page

### Timer Shows Wrong Time

1. **Check Server Time**: Ensure server timezone is correct
2. **Check Database Dates**: Verify `startDate` and `endDate` are valid timestamps
3. **Clear Browser Cache**: Hard refresh the page

### Timer Not Updating

1. **Check JavaScript**: Ensure no console errors
2. **Check Network**: Verify Convex connection
3. **Check Component Mount**: Ensure component is properly mounted

## 📝 Example Configurations

### Short Raffle (24 hours)
```bash
node scripts/update-raffle-dates.js 1
```

### Long Raffle (30 days) 
```bash
node scripts/update-raffle-dates.js 30
```

### Holiday Raffle (Until New Year)
```javascript
// In init-raffle-timer.js, modify dates:
const endDate = new Date('2025-01-01T00:00:00Z');
```

## 🚀 Going Live

Before deploying to production:

1. **Set Final Dates**: Configure actual start/end dates
2. **Test Timer**: Verify countdown accuracy  
3. **Test States**: Test all timer states (active, ended, etc.)
4. **Mobile Test**: Verify mobile responsiveness
5. **Performance Test**: Check with multiple concurrent users

## 🎉 Success!

Your raffle countdown timer is now live! Users will see the beautiful countdown in your shop header, creating urgency and excitement around your raffle.

The timer will automatically:
- ✅ Update in real-time
- ✅ Show entry counts  
- ✅ Handle different states
- ✅ Work perfectly on mobile
- ✅ Connect to your payment system

Perfect for building anticipation and driving raffle sales! 🎯
