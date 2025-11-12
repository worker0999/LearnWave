# Real-Time Resource Updates Documentation

## Overview

The LearnWave platform now supports **real-time resource updates** using WebSocket technology. When an admin uploads a new resource or deletes an existing one, all connected student and mentor users will receive instant notifications without needing to refresh the page.

## Features

✅ **Instant Notifications** - Users see new resources immediately when uploaded
✅ **WebSocket Connection** - Low-latency bidirectional communication
✅ **Fallback Polling** - Automatic HTTP polling if WebSocket is unavailable
✅ **Visual Feedback** - Connection status indicator and new resource notifications
✅ **Automatic Reconnection** - Handles network interruptions gracefully

## Architecture

### Components

1. **Socket.IO Server** (`server.ts`)
   - Manages WebSocket connections
   - Broadcasts resource events to all connected clients
   - Runs on the same port as the Next.js app (port 3000)
   - Path: `/api/socketio`

2. **Socket Configuration** (`src/lib/socket.ts`)
   - Sets up connection handlers
   - Manages room subscriptions (e.g., 'resources' room)
   - Emits resource update events

3. **Real-Time Hook** (`src/hooks/useRealtimeResources.ts`)
   - React hook for WebSocket integration
   - Callbacks for resource additions and deletions
   - Connection state management

4. **Admin Resource API** (`src/app/api/admin/resources/route.ts`)
   - Enhanced to emit socket events on POST (upload)
   - Enhanced to emit socket events on DELETE

5. **Student Resources Page** (`src/app/student/resources/page.tsx`)
   - Integrated with real-time hook
   - Visual connection status indicator
   - New resource notifications
   - Fallback polling for resilience

## How It Works

### Upload Flow

```
Admin uploads resource
    ↓
API validates and saves file
    ↓
Creates database record
    ↓
Emits 'resource-uploaded' event via Socket.IO
    ↓
All connected clients in 'resources' room receive event
    ↓
Students see instant notification
    ↓
New resource appears in their resource list
```

### Delete Flow

```
Admin deletes resource
    ↓
API removes database record
    ↓
Emits 'resource-deleted' event via Socket.IO
    ↓
All connected clients receive event
    ↓
Resource removed from student's resource list
```

## Implementation Details

### Server-Side Socket Setup

```typescript
// In server.ts
const io = new Server(server, {
  path: '/api/socketio',
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Make globally available for API routes
global.io = io;
setupSocket(io);
```

### Broadcasting Resource Events

```typescript
// In src/app/api/admin/resources/route.ts (POST endpoint)
if (global.io) {
  global.io.to('resources').emit('resource-uploaded', {
    type: 'upload',
    resource: resourceWithUploader,
    timestamp: new Date().toISOString()
  })
}

// In DELETE endpoint
if (global.io) {
  global.io.to('resources').emit('resource-deleted', {
    type: 'delete',
    resourceId,
    timestamp: new Date().toISOString()
  })
}
```

### Client-Side Hook Usage

```typescript
const { isConnected } = useRealtimeResources({
  enabled: true,
  onResourceAdded: (resource) => {
    console.log('New resource:', resource.title)
    // Update UI
  },
  onResourceDeleted: (resourceId) => {
    console.log('Resource deleted:', resourceId)
    // Update UI
  }
})
```

### Integration in React Components

```typescript
// In student resources page
const { isConnected } = useRealtimeResources({
  onResourceAdded: (resource) => {
    setNewResourceTitle(resource.title)
    setShowNewResourceNotification(true)
    setAllResources(prev => [newResource, ...prev])
    setTimeout(() => setShowNewResourceNotification(false), 5000)
  },
  onResourceDeleted: (resourceId) => {
    setAllResources(prev => prev.filter(r => r.id !== resourceId))
  }
})

// Display connection status
{isConnected && (
  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
    <span className="text-green-300 text-sm">Connected to real-time updates</span>
  </div>
)}
```

## Configuration

### Socket.IO Server Options

Edit `server.ts` to customize:

```typescript
const io = new Server(server, {
  path: '/api/socketio',           // WebSocket endpoint path
  cors: {
    origin: "*",                   // Allow all origins (customize for production)
    methods: ["GET", "POST"]
  },
  reconnection: true,              // Auto-reconnect on disconnect
  reconnectionDelay: 1000,         // Initial reconnection delay (ms)
  reconnectionDelayMax: 5000,      // Max reconnection delay (ms)
  reconnectionAttempts: 5          // Max reconnection attempts
})
```

### Hook Options

In `useRealtimeResources`:

```typescript
{
  enabled: true,                   // Enable/disable real-time updates
  onResourceAdded: callback,       // Called when resource uploaded
  onResourceDeleted: callback      // Called when resource deleted
}
```

## Testing

### Test Real-Time Updates

1. **Open two browsers/tabs:**
   - Tab 1: Admin dashboard (resource upload)
   - Tab 2: Student resources page

2. **Upload a resource in Tab 1:**
   - Go to Admin → Resources
   - Click "Upload Resource"
   - Fill form and submit

3. **Watch Tab 2:**
   - Should see green "Connected to real-time updates" indicator
   - Should see blue notification: "✨ New resource uploaded: [title]"
   - Resource should appear in the list instantly

4. **Delete the resource in Tab 1:**
   - Go back to Admin Resources
   - Click delete on the resource
   - Tab 2 should show resource removed instantly

### Console Logs

Watch browser console for debugging:

```
✓ Connected to real-time server
📥 New resource received: Binary Search Trees - Complete Notes
🗑️ Resource deleted: [resource-id]
📡 Resource upload event emitted for: [title]
```

## Fallback Mechanism

If WebSocket fails:

1. **Real-time hook** attempts to connect with retry logic
2. **Polling hook** (`useRealtimeUpdates`) fetches every 15 seconds
3. Users still see updates, but with slight delay
4. Connection status shows disconnected state

```typescript
// Polling as fallback
const { data: resources } = useRealtimeUpdates({
  endpoint: '/api/student/resources',
  interval: 15000  // 15 second poll interval
})
```

## Production Considerations

### Security

```typescript
// In production, restrict CORS origin
cors: {
  origin: ["https://yourdomain.com"],
  methods: ["GET", "POST"]
}
```

### Performance

- Consider implementing room-based subscriptions by semester/subject
- Implement message batching for bulk uploads
- Add rate limiting to prevent socket spam

### Monitoring

```typescript
// Add logging in socket.ts
io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] Client connected: ${socket.id}`)
  
  socket.on('disconnect', () => {
    console.log(`[${new Date().toISOString()}] Client disconnected: ${socket.id}`)
  })
})
```

## Troubleshooting

### Connection Issues

**Problem:** WebSocket shows disconnected
- Check browser console for errors
- Verify Socket.IO path matches: `/api/socketio`
- Check firewall/proxy blocking WebSocket

**Solution:**
```bash
# Check if server is running
curl http://localhost:3000/api/socketio
```

### Events Not Received

**Problem:** Upload event emitted but not received by clients
- Verify `global.io` is set in server.ts
- Check that clients have joined 'resources' room
- Look for errors in server console

**Solution:**
```typescript
// Verify room membership
io.on('connection', (socket) => {
  socket.on('join-resources', () => {
    console.log(`Socket ${socket.id} joined resources room`)
    console.log(`Room members: ${io.sockets.adapter.rooms.get('resources')?.size}`)
  })
})
```

### High Latency

**Problem:** Updates appear delayed
- Check network latency
- Consider implementing message compression
- Reduce polling interval if using fallback

## Future Enhancements

- [ ] Per-semester/subject rooms for targeted updates
- [ ] Message compression for large payloads
- [ ] Database activity logs for all resource events
- [ ] User-level notification preferences
- [ ] Real-time download count updates
- [ ] Mentor-specific resource notifications

## Files Modified

1. `server.ts` - Added global socket instance
2. `src/lib/socket.ts` - Enhanced with resource events
3. `src/app/api/admin/resources/route.ts` - Added socket emissions
4. `src/app/student/resources/page.tsx` - Integrated real-time hook
5. `src/hooks/useRealtimeResources.ts` - **NEW** - WebSocket hook

## Support

For issues or questions:
1. Check browser console for error messages
2. Check server logs for socket events
3. Verify network connectivity
4. Test with simple resource upload first
