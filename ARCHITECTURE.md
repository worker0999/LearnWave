# 🏗️ LearnWave Architecture Guide

## Overview

LearnWave is built using **Next.js 15** with the **App Router**, which means it's a **full-stack application** where both frontend and backend code live in the same project. This is a modern approach that simplifies development and deployment.

---

## 🎯 Frontend vs Backend: Where's What?

### **Frontend Code** 🎨
Frontend code handles what users see and interact with (UI/UX).

**Location**: `src/app/` (page components) + `src/components/` (reusable UI components)

**Key Directories**:
```
src/
├── app/
│   ├── student/          # Student dashboard pages
│   ├── mentor/           # Mentor dashboard pages
│   ├── admin/            # Admin dashboard pages
│   └── auth/             # Login/Register pages
├── components/
│   ├── ui/               # Reusable UI components (buttons, cards, etc.)
│   └── layout/           # Layout components (sidebar, navbar)
└── hooks/                # Custom React hooks
```

**Technologies Used**:
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Pre-built components
- **Framer Motion** - Animations
- **Lucide React** - Icons

---

### **Backend Code** ⚙️
Backend code handles data processing, database operations, and business logic.

**Location**: `src/app/api/` (API routes) + `src/lib/` (utilities) + `prisma/` (database)

**Key Directories**:
```
src/
├── app/
│   └── api/              # Backend API routes
│       ├── auth/         # Authentication endpoints
│       ├── admin/        # Admin operations
│       ├── student/      # Student operations
│       ├── ai/           # AI integration endpoints
│       └── mentors/      # Mentor operations
├── lib/
│   ├── db.ts            # Database connection
│   ├── auth.ts          # Authentication utilities
│   └── ai-config.ts     # AI configuration
└── prisma/
    └── schema.prisma     # Database schema
```

**Technologies Used**:
- **Next.js API Routes** - Backend endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication
- **Google Gemini AI** - AI integration

---

## 📂 Detailed Code Structure

### 1. **Frontend Pages** (`src/app/`)

Each folder in `src/app/` represents a route in your application:

```
src/app/
├── page.tsx                    # Homepage (/)
├── auth/
│   ├── login/page.tsx         # Login page (/auth/login)
│   └── register/page.tsx      # Register page (/auth/register)
├── student/
│   ├── page.tsx               # Student dashboard (/student)
│   ├── resources/page.tsx     # Resources page (/student/resources)
│   ├── mentors/page.tsx       # Find mentors (/student/mentors)
│   ├── ai-assistant/page.tsx  # AI chat (/student/ai-assistant)
│   └── ...
├── mentor/
│   ├── page.tsx               # Mentor dashboard (/mentor)
│   ├── students/page.tsx      # My students (/mentor/students)
│   └── ...
└── admin/
    ├── page.tsx               # Admin dashboard (/admin)
    ├── users/page.tsx         # User management (/admin/users)
    └── ...
```

**Example Frontend Code** (`src/app/student/page.tsx`):
```typescript
'use client'  // This makes it a client component (runs in browser)

import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null)
  
  // Fetch data from backend API
  useEffect(() => {
    fetch('/api/student/dashboard')
      .then(res => res.json())
      .then(data => setStudentData(data))
  }, [])
  
  return (
    <div>
      <h1>Welcome, {studentData?.name}!</h1>
      <Card>
        {/* UI components */}
      </Card>
    </div>
  )
}
```

---

### 2. **Backend API Routes** (`src/app/api/`)

API routes handle server-side logic and database operations:

```
src/app/api/
├── auth/
│   ├── login/route.ts         # POST /api/auth/login
│   └── register/route.ts      # POST /api/auth/register
├── admin/
│   ├── analytics/route.ts     # GET /api/admin/analytics
│   ├── users/route.ts         # GET, DELETE /api/admin/users
│   └── announcements/route.ts # GET, POST, DELETE /api/admin/announcements
├── student/
│   ├── resources/route.ts     # GET /api/student/resources
│   └── announcements/route.ts # GET /api/student/announcements
├── ai/
│   ├── chat/route.ts          # POST /api/ai/chat
│   └── generate-quiz/route.ts # POST /api/ai/generate-quiz
└── mentors/
    ├── route.ts               # GET /api/mentors (list all)
    └── book/route.ts          # POST /api/mentors/book
```

**Example Backend Code** (`src/app/api/auth/login/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'  // Database connection
import { verifyPassword, generateToken } from '@/lib/auth'

// POST endpoint for login
export async function POST(request: NextRequest) {
  try {
    // 1. Get data from request
    const { email, password } = await request.json()
    
    // 2. Query database
    const user = await db.users.findUnique({
      where: { email }
    })
    
    // 3. Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // 4. Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })
    
    // 5. Return response
    return NextResponse.json({
      message: 'Login successful',
      user,
      token
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

### 3. **Reusable Components** (`src/components/`)

Shared UI components used across multiple pages:

```
src/components/
├── ui/                        # shadcn/ui components
│   ├── button.tsx            # Button component
│   ├── card.tsx              # Card component
│   ├── input.tsx             # Input field
│   ├── dialog.tsx            # Modal dialog
│   ├── sidebar-nav.tsx       # Sidebar navigation
│   └── voice-navigation.tsx  # Voice commands
└── layout/
    └── dashboard-layout.tsx   # Dashboard wrapper
```

**Example Component** (`src/components/ui/button.tsx`):
```typescript
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

export function Button({ variant = 'default', children, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg ${
        variant === 'default' ? 'bg-blue-500 text-white' :
        variant === 'outline' ? 'border border-blue-500' :
        'bg-transparent'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}
```

---

### 4. **Custom Hooks** (`src/hooks/`)

Reusable React logic:

```
src/hooks/
├── useSpeechRecognition.ts   # Voice recognition hook
├── useAuth.ts                # Authentication hook
├── useSocket.ts              # WebSocket connection
└── useLocalStorage.ts        # Local storage management
```

**Example Hook** (`src/hooks/useSpeechRecognition.ts`):
```typescript
import { useState, useEffect } from 'react'

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  
  const startListening = () => {
    // Web Speech API logic
    const recognition = new webkitSpeechRecognition()
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript)
    }
    recognition.start()
    setIsListening(true)
  }
  
  return { isListening, transcript, startListening }
}
```

---

### 5. **Utility Functions** (`src/lib/`)

Helper functions and configurations:

```
src/lib/
├── db.ts           # Database connection (Prisma client)
├── auth.ts         # Authentication utilities
├── ai-config.ts    # Gemini AI setup
├── socket.ts       # Socket.IO configuration
└── utils.ts        # General utilities
```

**Example Utility** (`src/lib/db.ts`):
```typescript
import { PrismaClient } from '@prisma/client'

// Singleton pattern for database connection
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
```

---

### 6. **Database Schema** (`prisma/schema.prisma`)

Defines your database structure:

```prisma
// Database models
model Users {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String
  role          Role     @default(STUDENT)
  created_at    DateTime @default(now())
  
  // Relations
  user_profiles UserProfiles?
  mentors       Mentors?
  sessions      Sessions[]
}

model UserProfiles {
  id         String @id @default(uuid())
  user_id    String @unique
  name       String
  usn        String?
  branch     String?
  semester   Int?
  
  // Relation
  user       Users  @relation(fields: [user_id], references: [id])
}

enum Role {
  STUDENT
  MENTOR
  ADMIN
}
```

---

## 🔄 How Frontend and Backend Communicate

### Request Flow:

```
1. User Action (Frontend)
   ↓
2. API Call (fetch/axios)
   ↓
3. API Route (Backend)
   ↓
4. Database Query (Prisma)
   ↓
5. Response (JSON)
   ↓
6. Update UI (React State)
```

### Example Flow:

**Frontend** (`src/app/student/resources/page.tsx`):
```typescript
'use client'

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  
  useEffect(() => {
    // 1. Make API call to backend
    fetch('/api/student/resources', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      // 6. Update UI with response
      setResources(data.resources)
    })
  }, [])
  
  return (
    <div>
      {resources.map(resource => (
        <ResourceCard key={resource.id} {...resource} />
      ))}
    </div>
  )
}
```

**Backend** (`src/app/api/student/resources/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // 2. Receive request
  const token = request.headers.get('authorization')?.split(' ')[1]
  
  // 3. Verify authentication
  const payload = verifyToken(token)
  
  // 4. Query database
  const resources = await db.resources.findMany({
    where: {
      branch: payload.branch,
      semester: payload.semester
    }
  })
  
  // 5. Send response
  return NextResponse.json({ resources })
}
```

---

## 🗂️ File Naming Conventions

### Frontend Files:
- **Pages**: `page.tsx` (e.g., `student/page.tsx`)
- **Layouts**: `layout.tsx`
- **Components**: `kebab-case.tsx` (e.g., `sidebar-nav.tsx`)
- **Client Components**: Start with `'use client'`
- **Server Components**: No directive (default)

### Backend Files:
- **API Routes**: `route.ts` (e.g., `api/auth/login/route.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `ai-config.ts`)
- **Database**: `schema.prisma`

---

## 🚀 Key Technologies Explained

### **Next.js App Router**
- **What**: Modern routing system for Next.js
- **Frontend**: Files in `src/app/` become pages
- **Backend**: Files in `src/app/api/` become API endpoints
- **Benefit**: Full-stack in one project

### **Prisma ORM**
- **What**: Database toolkit for TypeScript
- **Location**: `prisma/schema.prisma`
- **Usage**: Type-safe database queries
- **Example**: `db.users.findUnique({ where: { email } })`

### **TypeScript**
- **What**: JavaScript with types
- **Benefit**: Catch errors before runtime
- **Example**: `interface User { id: string; email: string }`

### **Tailwind CSS**
- **What**: Utility-first CSS framework
- **Usage**: Classes in JSX
- **Example**: `<div className="bg-blue-500 text-white p-4">`

### **Socket.IO**
- **What**: Real-time bidirectional communication
- **Location**: `server.ts` + `src/lib/socket.ts`
- **Usage**: Live updates, chat, notifications

### **JWT (JSON Web Tokens)**
- **What**: Secure authentication tokens
- **Location**: `src/lib/auth.ts`
- **Flow**: Login → Generate Token → Store → Send with requests

---

## 📊 Data Flow Examples

### 1. **User Login**
```
Frontend (login/page.tsx)
  → POST /api/auth/login
    → Verify credentials (db.users.findUnique)
      → Generate JWT token
        → Return { user, token }
          → Store token in localStorage
            → Redirect to dashboard
```

### 2. **Fetch Student Dashboard**
```
Frontend (student/page.tsx)
  → GET /api/student/dashboard (with token)
    → Verify token
      → Query user data (db.users.findUnique)
        → Query announcements (db.announcements.findMany)
          → Return { user, announcements, stats }
            → Update React state
              → Render UI
```

### 3. **AI Chat**
```
Frontend (ai-assistant/page.tsx)
  → POST /api/ai/chat { message: "Help with calculus" }
    → Verify authentication
      → Call Gemini AI API
        → Process response
          → Return { reply: "Here's help..." }
            → Display in chat UI
```

---

## 🎯 Summary

| Aspect | Frontend | Backend |
|--------|----------|---------|
| **Location** | `src/app/*/page.tsx` | `src/app/api/*/route.ts` |
| **Purpose** | User interface | Data processing |
| **Runs On** | Browser | Server |
| **Technologies** | React, Tailwind, Components | Prisma, Database, APIs |
| **Example** | Dashboard page | Login endpoint |
| **Files** | `.tsx` components | `.ts` API routes |

---

## 🔍 Quick Reference

### To Add a New Page:
1. Create `src/app/your-page/page.tsx`
2. Export default function component
3. Access at `/your-page`

### To Add a New API Endpoint:
1. Create `src/app/api/your-endpoint/route.ts`
2. Export `GET`, `POST`, `PUT`, or `DELETE` function
3. Access at `/api/your-endpoint`

### To Add a New Component:
1. Create `src/components/ui/your-component.tsx`
2. Export component function
3. Import and use in pages

### To Add a Database Table:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Use in code: `db.yourTable.findMany()`

---

**Your LearnWave project is a modern full-stack application where frontend and backend work together seamlessly!** 🚀
