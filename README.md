# 🎓 LearnWave - Modern Learning Management Platform

A comprehensive, production-ready learning management system built with cutting-edge technologies, featuring AI-powered assistance, voice navigation, and real-time collaboration.

## ✨ Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🤖 AI Integration
- **🧠 Google Gemini AI** - Integrated AI assistant for academic help
- **🎤 Web Speech API** - Voice-based navigation and commands

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Windows-Specific Commands

**PowerShell:**
```powershell
cd C:\Users\lohit\Downloads\learnwave099
npm install --legacy-peer-deps
npm run dev
```

**Command Prompt:**
```cmd
cd /d C:\Users\lohit\Downloads\learnwave099
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

---

## 🔐 Default Login Credentials

### Admin Account
- **Email**: `admin@learnwave.com`
- **Password**: `admin123`
- **Role**: ADMIN

### Test Student Account
- **Email**: `student@test.com`
- **Password**: `student123`
- **Role**: STUDENT

### Test Mentor Account
- **Email**: `mentor@test.com`
- **Password**: `mentor123`
- **Role**: MENTOR

---

## 📁 Project Structure

```
learnwave099/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages (login/register)
│   │   ├── student/           # Student dashboard & features
│   │   ├── mentor/            # Mentor dashboard & features
│   │   ├── admin/             # Admin dashboard & management
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   │   └── useSpeechRecognition.ts  # Voice navigation hook
│   └── lib/                   # Utility functions and configurations
│       └── ai-config.ts       # Gemini AI configuration
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

---

## 🎨 Key Features

### 🎓 For Students
- **📚 Dashboard** - Personalized learning dashboard
- **📢 Announcements** - Real-time college and VTU updates
- **📖 Resources** - Study materials and learning resources
- **📅 Timetable** - Class schedule management
- **📊 Results** - Academic performance tracking
- **👨‍🏫 Find Mentors** - Browse and book mentor sessions
- **💬 AI Assistant** - Gemini-powered academic help
- **📝 Quiz System** - Interactive assessments
- **💼 Placement** - Career opportunities and preparation
- **🗣️ Forum** - Student discussion platform

### 👨‍🏫 For Mentors
- **📊 Dashboard** - Mentor performance overview
- **👥 My Students** - Manage student relationships
- **💬 Messages** - Communication hub
- **📚 Resources** - Share learning materials
- **📅 Sessions** - Session scheduling and management
- **👤 Profile** - Professional profile management
- **💰 Earnings** - Revenue tracking and analytics

### 👑 For Admins
- **📊 Analytics Dashboard** - Real-time platform statistics
- **👥 User Management** - Complete user directory and control
- **✅ Mentor Approvals** - Review and approve mentor applications
- **📢 Announcements** - Platform-wide communication
- **📈 Advanced Analytics** - Performance metrics and insights
- **💰 Revenue Tracking** - Financial analytics

---

## 🎤 Voice Navigation

LearnWave includes advanced voice-based navigation powered by Web Speech API.

### How to Use
1. Click the **"🎤 Voice Navigation"** button in the sidebar
2. Speak clearly in English
3. System will recognize commands and navigate automatically
4. Audio confirmation provided for each action

### Sample Voice Commands

**Student Commands:**
- "home" or "dashboard" → Navigate to dashboard
- "announcements" → View announcements
- "resources" → Access study materials
- "mentors" → Find mentors
- "ai assistant" → Open AI chat
- "quiz" → Start quiz

**Mentor Commands:**
- "students" → View my students
- "sessions" → Manage sessions
- "earnings" → View earnings
- "profile" → Edit profile

**Admin Commands:**
- "users" → User management
- "analytics" → View analytics
- "announcements" → Manage announcements
- "settings" → Platform settings

### Browser Support
- ✅ Chrome/Chromium
- ✅ Edge
- ✅ Safari 14.1+
- ✅ Opera
- ⚠️ Firefox (limited support)

---

## 🤖 AI Integration (Gemini)

LearnWave integrates Google's Gemini AI for intelligent academic assistance.

### Setup

1. **Get API Key**: Create a Google Cloud project and enable Generative AI API
2. **Configure Environment**: Add to `.env.local` (do NOT commit):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.0-flash
   ```
3. **Start Server**: Run `npm run dev`

### Testing AI Integration

**Quick Test Script:**
```bash
npx tsx scripts/test-gemini.ts
```

**API Endpoint Test:**
```bash
curl -X POST "http://localhost:3000/api/ai/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"message":"Hello, can you help me with calculus?","context":"academic_help"}'
```

### AI Features
- **Academic Help** - Subject-specific assistance
- **Study Planning** - Personalized study schedules
- **Concept Explanation** - Complex topics simplified
- **Practice Problems** - Generated exercises
- **Real-time Chat** - Interactive learning assistant

---

## 🎨 Design System

### Modern UI Features
- **Glassmorphism** - Frosted glass aesthetic throughout
- **Split-Screen Layouts** - Professional authentication pages
- **Gradient Mesh Backgrounds** - Dynamic, colorful backgrounds
- **Micro-animations** - Delightful interactions
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Theme switching support

### Color Scheme
- **Primary**: Cyan (#06b6d4) to Blue (#3b82f6)
- **Background**: White (#ffffff) / Dark mode variants
- **Accents**: Green for success, Red for errors
- **Glassmorphic Elements**: Transparent with backdrop blur

### Authentication Pages
Both login and register pages feature:
- Beautiful split-screen design
- Custom illustrations with animations
- Social login integration (Google, Facebook, Twitter)
- Role-based registration (Student, Mentor, Admin)
- Real-time form validation
- Floating particles and interactive backgrounds
- Responsive mobile layouts

---

## 📊 Admin Dashboard Features

### Real-time Analytics
- User statistics (total, students, mentors, admins)
- Session analytics (completed, pending, confirmed)
- Revenue tracking from sessions
- Top performing mentors
- Recent activity feed

### User Management
- View all users with pagination
- Advanced search (name, email, USN)
- Role-based filtering
- User deletion with confirmation
- Session count tracking

### Mentor Approval System
- Review pending applications
- View mentor expertise and rates
- One-click approve/reject
- Real-time status updates

### Announcement Management
- Create platform-wide announcements
- Multiple types (General, Exam, VTU Circular, Event)
- Rich content support
- Type-based color coding
- Delete outdated announcements

---

## 🛠️ API Endpoints

### Authentication
```
POST   /api/auth/login          - User login
POST   /api/auth/register       - User registration
GET    /api/auth/session        - Get current session
```

### Student APIs
```
GET    /api/student/dashboard   - Student dashboard data
GET    /api/student/resources   - Learning resources
GET    /api/student/mentors     - Available mentors
POST   /api/student/book        - Book mentor session
```

### Mentor APIs
```
GET    /api/mentor/dashboard    - Mentor dashboard data
GET    /api/mentor/students     - My students
GET    /api/mentor/sessions     - Session management
GET    /api/mentor/earnings     - Revenue analytics
```

### Admin APIs
```
GET    /api/admin/analytics     - Platform analytics
GET    /api/admin/users         - User management
DELETE /api/admin/users         - Delete user
POST   /api/admin/mentors/approve - Approve/reject mentor
GET    /api/admin/announcements - Get announcements
POST   /api/admin/announcements - Create announcement
DELETE /api/admin/announcements - Delete announcement
```

### AI APIs
```
POST   /api/ai/chat             - Gemini AI chat
POST   /api/ai/study-plan       - Generate study plan
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_database_url"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_MODEL="gemini-2.0-flash"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
FACEBOOK_CLIENT_ID="your_facebook_client_id"
FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Other Platforms
- Ensure all environment variables are configured
- Run database migrations: `npx prisma migrate deploy`
- Build the application: `npm run build`
- Start the server: `npm start`

---

## 🎯 Development Workflow

### Running Development Server
```bash
npm run dev
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

---

## 🧪 Testing

### Test Gemini Integration
```bash
npx tsx scripts/test-gemini.ts
```

### Manual Testing Checklist
- [ ] Login/Register flows for all roles
- [ ] Voice navigation commands
- [ ] AI assistant responses
- [ ] Admin dashboard analytics
- [ ] Mentor approval workflow
- [ ] Student resource access
- [ ] Session booking system
- [ ] Announcement creation

---

## 📚 Additional Documentation

### Voice Navigation
- Supports multiple user roles with role-specific commands
- Real-time transcript display
- Audio confirmation feedback
- Built-in command help system
- See voice commands section above for details

### Audio Capture Features
- Real-time audio recording
- Voice-to-text conversion
- Audio playback functionality
- Waveform visualization
- Export audio files

### Sidebar Features
- Collapsible navigation
- Role-based menu items
- Voice navigation integration
- Quick access shortcuts
- User profile display

---

## 🎉 What Makes LearnWave Special

### 🏎️ Fast Development
- Pre-configured tooling and best practices
- Complete component library
- Ready-to-use authentication

### 🎨 Beautiful UI
- Modern glassmorphism design
- Smooth animations and transitions
- Professional color schemes
- Responsive layouts

### 🔒 Type Safety
- Full TypeScript configuration
- Zod validation schemas
- Type-safe API routes

### 🤖 AI-Powered
- Integrated Gemini AI assistant
- Voice-based navigation
- Intelligent study recommendations

### 📱 Responsive
- Mobile-first design
- Touch-friendly interfaces
- Adaptive layouts

### 🗄️ Database Ready
- Prisma ORM configured
- Optimized queries
- Real-time data sync

### 🔐 Secure
- JWT authentication
- Role-based authorization
- Input validation
- Protected API routes

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support & Troubleshooting

### Common Issues

**Voice Navigation Not Working:**
- Check browser compatibility (Chrome/Edge recommended)
- Allow microphone permissions
- Speak clearly in English
- Check available commands list

**AI Assistant Not Responding:**
- Verify `GEMINI_API_KEY` in `.env.local`
- Check API quota limits
- Ensure Generative AI API is enabled in Google Cloud

**Database Connection Issues:**
- Verify `DATABASE_URL` in `.env.local`
- Run `npx prisma generate`
- Check database server is running

**Build Errors:**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install --legacy-peer-deps`
- Rebuild: `npm run build`

---

## 🔮 Future Enhancements

- [ ] Multi-language support for voice commands
- [ ] Advanced analytics dashboards
- [ ] Email notification system
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Gamification features
- [ ] Advanced AI tutoring
- [ ] Blockchain certificates
- [ ] Social learning features
- [ ] Parent portal

---

## 👥 Team & Credits

Built with ❤️ for the education community.

**Technologies Used:**
- Next.js, TypeScript, Tailwind CSS
- Prisma, NextAuth.js
- Google Gemini AI
- Web Speech API
- shadcn/ui components

---

## 📞 Contact

For questions, issues, or suggestions:
- Create an issue on GitHub
- Email: support@learnwave.com
- Documentation: [docs.learnwave.com](https://docs.learnwave.com)

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready

🚀 **Happy Learning with LearnWave!** 🎓
