# 🎤 Voice Navigation - Architecture & Flow Diagram

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     LearnWave Application                     │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐  ┌──────────────────────────────────┐  │
│  │   Sidebar Nav    │  │    Main Content Area             │  │
│  │  ┌────────────┐  │  │  ┌─────────────────────────────┐ │  │
│  │  │Navigation  │  │  │  │  Student/Mentor/Admin Pages│ │  │
│  │  │Items       │  │  │  │  - Resources               │ │  │
│  │  │            │  │  │  │  - Timetable               │ │  │
│  │  │ (Links)    │  │  │  │  - Announcements           │ │  │
│  │  └────────────┘  │  │  │  - etc.                    │ │  │
│  │                  │  │  └─────────────────────────────┘ │  │
│  │  ┌────────────┐  │  │                                   │  │
│  │  │  VOICE     │  │  │                                   │  │
│  │  │NAVIGATION  │  │  │                                   │  │
│  │  │ Component  │  │  │                                   │  │
│  │  └────────────┘  │  │                                   │  │
│  │       ▲          │  │                                   │  │
│  └───────┼──────────┘  └──────────────────────────────────┘  │
│          │                                                    │
└──────────┼────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  VoiceNavigation Component           │
│  ┌────────────────────────────────┐  │
│  │ useSpeechRecognition Hook      │  │
│  │ - Manages microphone input     │  │
│  │ - Real-time transcription      │  │
│  │ - Error handling               │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ Command Processing             │  │
│  │ - Map voice to commands        │  │
│  │ - Route to pages               │  │
│  │ - Audio feedback               │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
           │
           ├─────────────────┬──────────────────┐
           ▼                 ▼                  ▼
   ┌──────────────┐   ┌─────────────┐   ┌─────────────┐
   │   Web Speech │   │  Router API │   │  Text-to-  │
   │  Recognition│   │  (Next.js)  │   │   Speech   │
   │     API      │   │             │   │    API     │
   └──────────────┘   └─────────────┘   └─────────────┘
```

## Voice Command Processing Flow

```
┌──────────────────────┐
│  User Clicks Voice   │
│  Navigation Button   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ Microphone Activated         │
│ Button turns RED             │
│ "Ready to listen" state      │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  User Speaks Command         │
│  e.g., "resources"           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Web Speech API Captures      │
│ Audio Stream                 │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Real-time Transcription      │
│ Display: "resour..."         │
│ "resource"                   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Command Matching             │
│ Find: navigationMap['resource']
└──────────┬───────────────────┘
           │
           ├─────────────────┬─────────────────┐
           ▼                 ▼                 ▼
      ✅ FOUND         ❌ NOT FOUND       🔊 SPEAK
       COMMAND          COMMAND          FEEDBACK
           │                 │                 │
           ▼                 ▼                 ▼
    Get Route Path    Show Error Msg    "Going to
    /student/         "Command not      resources"
    resources         recognized"       Audio
           │                 │           Confirmation
           ▼                 ▼           │
    Navigate to       Clear Error       ▼
    Route            After 3 sec    Page Transitions
           │                           │
           ▼                           ▼
    Push to Router             User Arrives at
    page.push()                New Page
           │                      │
           └──────────┬───────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  Complete! ✅   │
             │ Voice Ready for │
             │ Next Command    │
             └─────────────────┘
```

## Component Hierarchy

```
SidebarNav
├── Header
├── User Profile
├── Navigation Items
│   ├── Dashboard
│   ├── Resources
│   ├── Timetable
│   └── ... (more items)
├── [NEW] Voice Navigation Component ⭐
│   ├── Voice Button
│   │   ├── Start State (Blue) 🎤
│   │   └── Listening State (Red) 🔴
│   ├── Real-time Transcript Display
│   │   ├── "Listen..." text
│   │   └── Current spoken text
│   ├── Feedback Messages
│   │   ├── Success: "🎯 Going to X"
│   │   └── Error: "❌ Command not recognized"
│   └── Help Dropdown
│       ├── Available Commands List
│       ├── Role-specific commands
│       └── Clickable command suggestions
└── Bottom Actions
    ├── Help & Support
    └── Logout
```

## Data Flow

```
User Input (Voice)
       │
       ▼
┌─────────────────────────┐
│ useSpeechRecognition    │ ◄─── Browser Web Speech API
│                         │
│ - Captures audio        │
│ - Transcribes text      │
│ - Returns transcript    │
└────────────┬────────────┘
             │
             │ transcript: "resources"
             ▼
┌─────────────────────────┐
│ VoiceNavigation Handler │
│                         │
│ - Receives transcript   │
│ - Cleans & normalizes   │
│ - Looks up in map       │
└────────────┬────────────┘
             │
             │ matched route: "/student/resources"
             ▼
┌─────────────────────────┐
│ Router Navigation       │
│                         │
│ - Push route to router  │
│ - Next.js handles nav   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Speech Synthesis        │ ◄─── Browser Text-to-Speech API
│                         │
│ - Speaks confirmation   │
│ - "Going to resources"  │
└─────────────────────────┘
             │
             ▼
        User hears
        confirmation ✨
```

## State Management

```
VoiceNavigation Component State:

┌─────────────────────────┐
│ isListening: boolean    │  ◄── From hook
│ TRUE = Microphone ON    │
│ FALSE = Microphone OFF  │
└─────────────────────────┘

┌─────────────────────────┐
│ transcript: string      │  ◄── From hook
│ Real-time spoken text   │
└─────────────────────────┘

┌─────────────────────────┐
│ feedback: string        │  ◄── Local state
│ Success/error messages  │
└─────────────────────────┘

┌─────────────────────────┐
│ showFeedback: boolean   │  ◄── Local state
│ Controls feedback vis.  │
└─────────────────────────┘
```

## Event Lifecycle

```
Timeline of a Voice Navigation Action:

0ms    ───┐ User clicks button
           │
100ms      ├─ Microphone activated
           │  isListening = true
           │  Button turns RED
           │
500ms      ├─ User starts speaking
           │
1000ms     ├─ Real-time transcript appears
           │  "resour..." shown in real-time
           │
1500ms     ├─ Speech ends
           │  System recognizes final transcript
           │  "resources" (complete)
           │
1600ms     ├─ Command matched
           │  navigationMap found "/student/resources"
           │
1700ms     ├─ Audio feedback
           │  speak("Going to resources")
           │
1800ms     ├─ Navigation triggered
           │  router.push("/student/resources")
           │
2000ms     ├─ Feedback shown
           │  "🎯 Navigating to resources..."
           │  showFeedback = true
           │
5000ms     └─ Feedback cleared
              showFeedback = false
              isListening = false
              Ready for next command!
```

## Role-Based Navigation Map

```
navigationMap = {
  STUDENT: {
    'home' → '/student',
    'resources' → '/student/resources',
    'timetable' → '/student/timetable',
    'mentors' → '/student/mentors',
    ...18 commands total
  },
  
  MENTOR: {
    'home' → '/mentor',
    'students' → '/mentor/students',
    'sessions' → '/mentor/sessions',
    ...8 commands total
  },
  
  ADMIN: {
    'home' → '/admin',
    'users' → '/admin/users',
    'analytics' → '/admin/analytics',
    ...8 commands total
  }
}

User Role
    │
    ▼
Get Navigation Map
    │
    ▼
User Says Command
    │
    ▼
Lookup in Map
    │
    ├─ Found? → Get Route → Navigate
    └─ Not Found? → Show Error
```

## Browser API Dependencies

```
┌─────────────────────────────┐
│  Web Speech API             │
│  (Speech Recognition)       │
├─────────────────────────────┤
│ • Captures user voice       │
│ • Real-time transcription   │
│ • Returns spoken text       │
│ ✓ Chrome, Edge, Safari 14+  │
└──────────┬──────────────────┘
           │
           ▼
     useSpeechRecognition
           │
           ▼
┌─────────────────────────────┐
│  Next.js Router API         │
├─────────────────────────────┤
│ • Page navigation           │
│ • Route pushing             │
│ • History management        │
└────────────┬────────────────┘
             │
             ▼
      VoiceNavigation
             │
             ▼
┌─────────────────────────────┐
│  Web Speech Synthesis API   │
│  (Text-to-Speech)           │
├─────────────────────────────┤
│ • Audio feedback            │
│ • Spoken confirmation       │
│ • User feedback             │
│ ✓ All modern browsers       │
└─────────────────────────────┘
```

---

**Diagram Summary:** The voice navigation system is a well-integrated feature that leverages modern browser APIs to provide hands-free page navigation through voice commands.

---

Generated: November 12, 2025
