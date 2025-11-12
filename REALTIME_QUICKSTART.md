# Quick Start: Real-Time Resource Updates

## What's New?

✨ Resources uploaded by admins now appear **instantly** for students **without page refresh**!

## How It Works

1. Admin uploads a resource
2. ✅ Resource saved to database
3. 📡 WebSocket event sent to all connected users
4. 👥 Students see instant notification and resource appears in their list

## How to Test

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Open Two Browsers
- **Browser 1:** Admin Dashboard (http://localhost:3000/admin)
- **Browser 2:** Student Resources (http://localhost:3000/student/resources)

### Step 3: Upload a Resource (Browser 1)
1. Go to Admin Dashboard → Resources
2. Click "Upload Resource"
3. Fill in the form:
   - **Title:** "Test Real-Time Resource"
   - **Subject:** "Data Structures"
   - **Semester:** 5
   - **Type:** PDF
   - **File:** Select any PDF file
4. Click "Upload"

### Step 4: Watch Browser 2
✨ You should see:
1. **Green badge:** "Connected to real-time updates"
2. **Blue notification:** "✨ New resource uploaded: Test Real-Time Resource"
3. **Resource appears** in the list instantly

## Features

### Connection Status
```
✅ Connected to real-time updates
```
Shows when WebSocket is connected and ready

### New Resource Notification
```
✨ New resource uploaded: [Resource Title]
```
Appears for 5 seconds when new resource is added

### Automatic Deletion
When admin deletes a resource, it disappears from student's list instantly

### Fallback Mechanism
If WebSocket disconnects:
- List updates every 15 seconds via polling
- Connection badge disappears
- Still works, just with slight delay

## Browser Console Logs

Open Dev Tools (F12) → Console to see:
```
✓ Connected to real-time server
📥 New resource received: [title]
🗑️ Resource deleted: [id]
📡 Resource upload event emitted for: [title]
```

## What Changed

### New Files
- `src/hooks/useRealtimeResources.ts` - WebSocket hook
- `REALTIME_RESOURCES.md` - Full documentation
- `REALTIME_IMPLEMENTATION.md` - Implementation details

### Modified Files
- `server.ts` - Added Socket.IO instance
- `src/lib/socket.ts` - Enhanced socket handling
- `src/app/api/admin/resources/route.ts` - Added socket emissions
- `src/app/student/resources/page.tsx` - Integrated real-time updates

## Configuration

### Change Polling Interval
In `src/app/student/resources/page.tsx`:
```typescript
const { data: resources } = useRealtimeUpdates({
  endpoint: '/api/student/resources',
  interval: 15000  // Change this (milliseconds)
})
```

### Change Notification Duration
In `src/app/student/resources/page.tsx`:
```typescript
setTimeout(() => setShowNewResourceNotification(false), 5000) // Change 5000 (milliseconds)
```

## Troubleshooting

### Green badge not showing?
1. Check browser console (F12)
2. Look for connection errors
3. Make sure server is running on port 3000
4. Check firewall/proxy settings

### Resources not appearing instantly?
1. Check if green badge is showing
2. If not, WebSocket might be failing
3. Resources will still update every 15 seconds (polling fallback)
4. Try refreshing the page

### Server showing errors?
1. Check server terminal for error messages
2. Make sure Socket.IO is installed:
   ```bash
   npm install socket.io socket.io-client
   ```
3. Restart the server

## API Endpoints

### Upload Resource
```bash
POST /api/admin/resources
Header: Authorization: Bearer {token}
Body: FormData {
  title, description, type, subject, semester, unit, file
}
Response: { success: true, resource: {...} }
```

### Get Resources
```bash
GET /api/student/resources
Header: Authorization: Bearer {token}
Response: { success: true, resources: [...] }
```

### Delete Resource
```bash
DELETE /api/admin/resources?id={resourceId}
Header: Authorization: Bearer {token}
Response: { success: true, message: "..." }
```

## Socket Events

### Client sends:
```typescript
socket.emit('join-resources')  // Join resources room
socket.emit('join-user', userId)  // Join user room
```

### Server sends:
```typescript
socket.on('resource-uploaded', { type, resource, timestamp })
socket.on('resource-deleted', { type, resourceId, timestamp })
```

## Performance

- ⚡ WebSocket latency: < 100ms
- 📊 Polling fallback: 15 seconds
- 💾 Memory: Minimal (lightweight connection)
- 🔄 Auto-reconnect: Yes (up to 5 attempts)

## Security Notes

- Events broadcasted to all users
- No authentication required for socket (consider adding if sensitive)
- CORS configured for all origins (customize for production)

## Next Steps

1. ✅ Test the real-time updates
2. ✅ Check server and browser console logs
3. ✅ Try uploading and deleting resources
4. ✅ Test with multiple browser windows
5. ✅ Customize as needed for your use case

## Support

For issues:
1. Check `REALTIME_RESOURCES.md` for detailed documentation
2. Check `REALTIME_IMPLEMENTATION.md` for technical details
3. Look at server console logs
4. Check browser console (F12)
5. Verify network connectivity

---

**Happy Testing!** 🚀
