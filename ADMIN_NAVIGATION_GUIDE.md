# Admin Portal Navigation Guide

## 🎨 Design Update
The admin portal now uses the **beige aesthetic** matching the student dashboard design.

## 📍 Admin Portal Structure

### Main Dashboard (`/admin`)
The main admin dashboard has **4 tabs** at the top:

1. **Mentor Approvals Tab** (Default)
   - Shows pending mentor applications
   - Approve or reject mentors
   - View mentor details

2. **All Users Tab**
   - View all registered users (students, mentors, admins)
   - Search and filter users
   - Delete users
   - Pagination support

3. **Announcements Tab**
   - Create new announcements
   - View all announcements
   - Delete announcements
   - Announcements are shown to all users

4. **Analytics Tab**
   - Platform statistics (coming soon)
   - Charts and insights

### Separate Pages

1. **Mentor Approvals Page** (`/admin/mentors`)
   - Dedicated page for mentor management
   - More detailed view than the tab
   - Filter by status, branch, etc.
   - View mentor profiles

2. **Resources Page** (`/admin/resources`)
   - Upload study materials
   - Manage PDFs, videos, images
   - Filter by subject, semester, type
   - Download and preview resources

## 🚀 How to Navigate

### To Access Tabs (on `/admin` page):
1. Go to `http://localhost:3000/admin`
2. Click on the tabs at the top:
   - **Mentor Approvals** - Review pending mentors
   - **All Users** - Manage all users
   - **Announcements** - Create/manage announcements
   - **Analytics** - View statistics

### To Access Separate Pages:
- **Mentor Approvals**: Click "Mentor Approvals" in the sidebar OR go to `/admin/mentors`
- **Resources**: Click "Resources" in the sidebar OR go to `/admin/resources`
- **Dashboard**: Click "Dashboard" in the sidebar OR go to `/admin`

## 🎯 Quick Actions

### Approve a Mentor:
1. Go to `/admin` or `/admin/mentors`
2. Find the pending mentor in the table
3. Click the green **"Approve"** button ✓

### Create an Announcement:
1. Go to `/admin`
2. Click the **"Announcements"** tab
3. Click **"Create Announcement"** button
4. Fill in title, content, and type
5. Click **"Create"**

### Upload a Resource:
1. Go to `/admin/resources`
2. Click **"Upload Resource"** button
3. Fill in details and select file
4. Click **"Upload Resource"**

## 🎨 Color Scheme
- **Background**: `#FDFBF9` (warm off-white)
- **Sidebar**: `#F8F3EE` (beige)
- **Cards**: White with `#E8DFD3` borders
- **Text**: `#4A3F33` (dark brown), `#9B8B7E` (medium brown), `#6B5844` (brown)
- **Buttons**: `#6B5844` (brown) with hover effects

## ✅ All Features Working
- ✓ Mentor approvals (tab and dedicated page)
- ✓ User management
- ✓ Announcements
- ✓ Resource management
- ✓ Analytics overview
- ✓ Beige aesthetic design
