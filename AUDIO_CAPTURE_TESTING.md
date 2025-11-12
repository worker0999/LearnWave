# Audio Capture Testing Guide

## Quick Start

1. **Navigate to sidebar** - Find "Voice Navigation" button in the sidebar
2. **Click button** - First time will request microphone permission
3. **Allow permission** - Browser will show permission prompt, click "Allow"
4. **Speak command** - Say any command like "resources", "home", "profile"
5. **See results** - Page navigates and audio feedback plays

## What Was Fixed

### Problem: Audio capture wasn't working
### Solution: Added proper microphone permission handling + device detection

## Testing Scenarios

### ✅ Scenario 1: First Time User (Happy Path)
**Steps:**
1. Open app in browser
2. Navigate to any page with sidebar (Student, Mentor, or Admin)
3. Click "Voice Navigation" button
4. **Browser shows permission prompt**
5. Click "Allow" button
6. Button changes to red "Stop Listening" state
7. Say "resources" clearly
8. **Transcript appears** showing what was heard
9. **Page navigates** to resources page
10. **Audio says** "Going to resources"

**Expected Result:** ✅ PASS - All steps work smoothly

---

### ⚠️ Scenario 2: User Denies Permission
**Steps:**
1. Click "Voice Navigation" button
2. **Browser shows permission prompt**
3. Click "Block" button
4. Wait 2 seconds

**Expected Result:** 
- ❌ Shows error: "🔴 Microphone access denied. Please enable microphone in browser settings."
- Button returns to blue state
- Can still try again later

**Fix:** User needs to:
1. Open browser settings
2. Find "Site settings" → "Microphone"
3. Change setting to "Allow"
4. Reload page and try again

---

### 🔌 Scenario 3: No Microphone Connected
**Steps:**
1. Disconnect all microphones from computer
2. Click "Voice Navigation" button
3. Wait for response

**Expected Result:**
- ❌ Shows error: "🔴 No microphone found. Please connect a microphone device."
- Button returns to blue state

**Fix:** User needs to:
1. Connect a microphone (USB, 3.5mm jack, or enable built-in)
2. Reload page
3. Try again

---

### 🌐 Scenario 4: HTTPS Requirement (Production Only)
**Environment:** Accessing from http:// (not https://)

**Expected Result:**
- ✅ **Development (localhost):** Works fine, HTTPS not required
- ❌ **Production:** Shows error: "🔴 HTTPS required for microphone access. Ensure you are on a secure connection."

**Fix for Production:**
- Website must be served over HTTPS
- Check SSL certificate is valid
- Ensure URL starts with `https://`

---

### 🎤 Scenario 5: Microphone Busy
**Setup:** Another app is using microphone (Zoom, Teams, etc.)

**Steps:**
1. Open Zoom/Teams/Google Meet in another window
2. Start video call (which uses microphone)
3. Click "Voice Navigation" button
4. Try to speak

**Expected Result:**
- ❌ Shows error: "🔴 Microphone is in use by another application. Please close it and try again."

**Fix:** User needs to:
1. Close or stop the other application using mic
2. Try voice navigation again

---

### 📣 Scenario 6: Speaking a Command
**Setup:** All permissions granted, microphone ready

**Steps:**
1. Click "Voice Navigation" button (should turn red)
2. Clearly say one of these commands:
   - **Student:** "home", "resources", "mentors", "sessions", "quiz", "forum"
   - **Mentor:** "home", "students", "messages", "sessions", "earnings"
   - **Admin:** "home", "users", "resources", "analytics"
3. Watch for transcript
4. Wait for navigation

**Expected Result:**
- 🔴 Button is red with "Stop Listening"
- 📝 Transcript shows what was heard in blue box
- 🎯 Feedback shows "🎯 Navigating to [command]..."
- 🔊 Audio says the command name
- ✅ Page navigates to correct route

---

### ❌ Scenario 7: Invalid Command
**Setup:** Microphone working, permissions granted

**Steps:**
1. Click "Voice Navigation" button
2. Say something that isn't a valid command (e.g., "blahblah")
3. Wait 2 seconds

**Expected Result:**
- 📝 Transcript shows what was heard
- ❌ Feedback shows "❌ Command not recognized. Try: ..."
- 🔊 Audio says "Command not recognized"
- 📋 Can click "📋 Available Commands" to see all valid options

---

### 🔇 Scenario 8: No Speech Detected
**Setup:** User clicks button but doesn't speak

**Steps:**
1. Click "Voice Navigation" button (red state)
2. Don't speak for 10 seconds
3. Speech recognition times out

**Expected Result:**
- ⏱️ After ~5-10 seconds, listening stops automatically
- 🔴 Shows error: "🔴 No speech detected. Please try again."
- Button returns to blue state

---

## Browser Compatibility Testing

### Chrome
- ✅ Full Support
- Works on: `http://localhost`, `https://`
- Test: Click button → Allow → Speak

### Firefox  
- ✅ Full Support
- Works on: `http://localhost`, `https://`
- Test: Click button → Allow → Speak

### Safari
- ✅ Full Support
- ⚠️ Requires HTTPS in production
- Test: Click button → Allow → Speak

### Edge
- ✅ Full Support
- Works on: `http://localhost`, `https://`
- Test: Click button → Allow → Speak

---

## Common Issues & Solutions

| Issue | Error Message | Solution |
|-------|---------------|----------|
| Denied permission | "Microphone access denied" | Browser Settings → Microphone → Allow |
| No microphone | "No microphone found" | Connect microphone or enable built-in mic |
| Mic in use | "Microphone is in use by another application" | Close Zoom/Teams/Discord using mic |
| HTTPS needed | "HTTPS required for microphone access" | Deploy with HTTPS certificate |
| No speech | "No speech detected" | Speak louder or closer to microphone |
| Bad connection | "Network error" | Check internet connection |
| Region blocked | "Speech recognition service is not available in your region" | Check if service supports your region |

---

## Performance Expectations

| Action | Time | Experience |
|--------|------|-------------|
| Click button | Instant | Button changes color immediately |
| Permission check | <100ms | Nearly instant |
| Audio ready | ~200ms | Ready to speak |
| Listening | Ongoing | Real-time transcript updates |
| Command recognized | ~500ms | Feedback appears, navigation happens |
| Page load | ~1s | New page fully loaded |

---

## Audio Quality Tips

For best speech recognition results:

1. **Speak clearly** - Articulate each word
2. **Adequate volume** - Not too soft, not too loud
3. **Minimal background noise** - Quiet environment preferred
4. **Microphone distance** - 6-12 inches from mouth
5. **One command at a time** - Don't speak multiple words
6. **English language** - Currently only English is supported

---

## Checking Implementation Details

### Check Microphone Permission Status
Open browser DevTools (F12) → Console:
```javascript
// Check current permission status
navigator.permissions.query({ name: 'microphone' }).then(result => {
  console.log('Microphone permission:', result.state)
  // Output: granted, denied, or prompt
})
```

### Check Available Audio Devices
```javascript
// List all audio input devices
navigator.mediaDevices.enumerateDevices().then(devices => {
  const audioInputs = devices.filter(d => d.kind === 'audioinput')
  console.log('Audio input devices:', audioInputs)
  audioInputs.forEach((device, i) => {
    console.log(`${i}: ${device.label} (${device.deviceId})`)
  })
})
```

### Test Speech Recognition API
```javascript
// Check if Speech Recognition is supported
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
if (SpeechRecognition) {
  console.log('✅ Speech Recognition is supported')
} else {
  console.log('❌ Speech Recognition is NOT supported')
}
```

---

## Success Criteria Checklist

After audio capture fixes:

- [ ] Permission is requested on first click
- [ ] Permission dialog appears from browser
- [ ] "Allow" and "Block" buttons work
- [ ] Microphone activates when allowed
- [ ] Transcript displays while speaking
- [ ] Commands navigate to correct pages
- [ ] Audio feedback plays confirmation
- [ ] Error messages are clear and helpful
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Works on localhost (HTTP)
- [ ] Error handling is graceful
- [ ] No console errors or warnings
- [ ] Button state changes clearly (blue → red)

---

## Report Issues

If audio capture still has issues:

1. **Check browser console** (F12 → Console)
2. **Note the exact error message**
3. **Include browser and OS** (Chrome on Windows 10)
4. **List tested scenarios** above that failed
5. **Provide steps to reproduce**

Example issue report:
```
Browser: Chrome 120 on Windows 11
Error: "Microphone access denied"
Steps: Clicked button → Clicked "Allow" → Still shows denied error
Expected: Microphone should activate after clicking Allow
```
