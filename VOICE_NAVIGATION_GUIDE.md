# Voice-Based Navigation Guide

## Overview
Your LearnWave application now includes **voice-based navigation** that allows users to navigate through pages using voice commands. This feature supports multiple user roles (Student, Mentor, Admin) with role-specific commands.

## Features

✅ **Speech Recognition** - Uses Web Speech API for voice input
✅ **Real-time Transcript** - Shows what the system is hearing
✅ **Visual Feedback** - Displays commands and navigation status
✅ **Audio Confirmation** - Speaks back when commands are recognized
✅ **Command Help** - Built-in list of available commands
✅ **Error Handling** - Graceful handling of speech errors
✅ **Multi-language Support** - Configurable language support

## How to Use

### 1. **Start Voice Navigation**
   - Click the **"🎤 Voice Navigation"** button in the sidebar
   - The button will turn red and show "Stop Listening"
   - Your microphone will be activated

### 2. **Speak a Command**
   - Speak clearly in English (default language)
   - Available commands vary by user role
   - The system will show what it's hearing in real-time

### 3. **Confirmation**
   - When a command is recognized, you'll hear audio confirmation
   - The page will automatically navigate to the target
   - A visual notification shows the navigation action

### 4. **View Available Commands**
   - Click the **"📋 Available Commands"** dropdown in the sidebar
   - See all commands available for your role

## Available Commands by Role

### **STUDENT Role**
- `home` → Dashboard
- `dashboard` → Dashboard
- `announcements` → Announcements
- `resources` → Resources
- `timetable` → Timetable
- `results` → Results
- `mentors` → Find Mentors
- `sessions` → Booked Sessions
- `study` → Study
- `ai assistant` → AI Assistant
- `quiz` → Quiz
- `placement` → Placement
- `forum` → Forum

### **MENTOR Role**
- `home` → Dashboard
- `dashboard` → Dashboard
- `students` → My Students
- `messages` → Messages
- `resources` → Resources
- `sessions` → Sessions
- `profile` → Profile
- `earnings` → Earnings

### **ADMIN Role**
- `home` → Dashboard
- `dashboard` → Dashboard
- `users` → Users Management
- `resources` → Resources
- `announcements` → Announcements
- `mentors` → Mentors
- `analytics` → Analytics
- `settings` → Settings

## Technical Details

### Files Created

1. **`/src/hooks/useSpeechRecognition.ts`**
   - Custom React hook for Web Speech API integration
   - Handles speech recognition lifecycle
   - Returns listening state, transcript, and control functions

2. **`/src/components/ui/voice-navigation.tsx`**
   - Voice command processing component
   - Maps voice commands to routes
   - Provides UI feedback and audio responses
   - Shows real-time transcript and available commands

3. **`Modified /src/components/ui/sidebar-nav.tsx`**
   - Integrated VoiceNavigation component
   - Displayed in sidebar when not collapsed

### Hook API: `useSpeechRecognition`

```typescript
const {
  isListening,      // Boolean: Is microphone active?
  transcript,       // String: Current spoken text
  isSpeechSupported, // Boolean: Is browser supported?
  startListening,   // Function: Start recording
  stopListening,    // Function: Stop recording
  toggleListening   // Function: Toggle recording
} = useSpeechRecognition({
  enabled: true,
  onResult: (transcript) => { /* Handle command */ },
  onError: (error) => { /* Handle error */ },
  language: 'en-US'
})
```

## Browser Support

Voice navigation requires browsers that support the Web Speech API:
- ✅ Chrome/Chromium
- ✅ Edge
- ✅ Safari 14.1+
- ✅ Opera
- ⚠️ Firefox (limited support)
- ❌ Not supported on older browsers

**Note:** If your browser doesn't support speech recognition, the voice navigation button won't appear.

## Customization

### Add New Commands

Edit the `navigationMap` in `/src/components/ui/voice-navigation.tsx`:

```typescript
const navigationMap: Record<string, Record<string, string>> = {
  STUDENT: {
    'existing command': '/existing/path',
    'your new command': '/your/new/path', // Add here
  },
  // ... other roles
}
```

### Change Language

Modify the `useSpeechRecognition` call in `voice-navigation.tsx`:

```typescript
const { ... } = useSpeechRecognition({
  enabled: true,
  language: 'es-ES' // Change to Spanish
})
```

Supported language codes:
- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Spanish
- `fr-FR` - French
- `de-DE` - German
- `it-IT` - Italian
- `ja-JP` - Japanese
- And many more...

### Customize Audio Feedback

Modify the `speak()` function in `voice-navigation.tsx`:

```typescript
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.5  // Speed (0.1 to 10)
    utterance.pitch = 1.5 // Pitch (0 to 2)
    utterance.volume = 0.8 // Volume (0 to 1)
    speechSynthesis.speak(utterance)
  }
}
```

## Accessibility Features

- 🎤 Voice control for hands-free navigation
- 📢 Audio feedback for confirmations
- 📝 Real-time transcript display
- 🎨 Visual indicators for listening state
- 📋 Help text showing available commands
- ♿ Keyboard fallback (traditional UI still available)

## Best Practices

1. **Speak Clearly** - Use clear pronunciation for best results
2. **Pause Between Commands** - Wait for confirmation before next command
3. **Check Microphone Permissions** - Allow microphone access when prompted
4. **Use Exact Commands** - Say commands exactly as listed
5. **In Quiet Environments** - Works best with minimal background noise

## Troubleshooting

### "Browser doesn't support speech recognition"
- Your browser may not support Web Speech API
- Try using Chrome, Edge, or Safari 14.1+

### Commands not being recognized
- Speak more clearly
- Try in a quieter environment
- Check microphone is working in other applications
- Verify the exact command name from the help list

### Can't hear audio feedback
- Check volume is turned up
- Verify browser hasn't muted audio
- Check system audio settings
- Try a different command to test audio

### Microphone permission denied
- Click the browser permission prompt and select "Allow"
- Check browser settings to reset microphone permissions
- Try in an Incognito/Private window

## Future Enhancements

Potential additions to voice navigation:
- Multi-language support with automatic detection
- Voice command history and analytics
- Custom voice commands per user
- Natural language understanding (not just exact matches)
- Voice-based form filling
- Offline voice recognition support
- Voice shortcuts for complex operations

---

**Enjoy hands-free navigation! 🎤✨**
