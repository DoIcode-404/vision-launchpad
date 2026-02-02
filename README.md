# The New Vision Tuition Center

A full-stack web application for managing a tuition center with a public-facing website and secure admin dashboard. Built with modern technologies for performance and scalability.

## Features

### Public Website

- **Home**: Hero section, course previews, statistics, and testimonials
- **Courses**: Browse courses with filters (category & grades)
- **Faculty**: Meet instructors with photos, qualifications, and experience
- **Results**: Student achievements and year-wise performance
- **Contact**: Contact form with Firebase integration
- **Responsive**: Fully optimized for mobile, tablet, and desktop

### Admin Dashboard

- **Authentication**: Secure Firebase email/password login
- **Course Management**: Add, edit, delete courses with icons and features
- **Faculty Management**: Manage faculty profiles with image uploads
- **Results Management**: Track student achievements with search and sorting
- **Achievements**: Manage year-wise performance statistics
- **Analytics**: Real-time dashboard with key metrics
- **Contact Messages**: View and manage inquiries from contact form

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router
- **Icons**: Lucide React

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase project

### Setup

```sh
# Clone repository
git clone https://github.com/DoIcode-404/vision-launchpad.git
cd vision-launchpad

# Install dependencies
npm install

# Create .env.local with Firebase credentials (see below)

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Create **Firestore Database**
4. Enable **Cloud Storage**
5. Add admin user in Authentication → Users
6. Copy credentials to `.env.local`

## Project Structure

```
src/
├── pages/              # Route pages (Index, Courses, Faculty, etc.)
│   └── admin/          # Admin dashboard pages
├── components/
│   ├── home/           # Home page sections
│   ├── layout/         # Navbar, Footer, Layout
│   └── ui/             # Shadcn UI components
├── lib/
│   ├── firebase.ts     # Firebase configuration
│   └── icons.ts        # Icon mappings
├── contexts/
│   └── AdminContext.tsx # Authentication context
└── hooks/              # Custom React hooks
```

## Firestore Collections

### courses

```json
{
  "title": "Mathematics",
  "description": "Course description",
  "category": "Core",
  "grades": ["6", "7", "8", "9", "10"],
  "duration": "12 months",
  "instructor": "Teacher name",
  "batchSize": "20-25",
  "features": ["Feature 1", "Feature 2"],
  "iconName": "calculator"
}
```

### faculty

```json
{
  "name": "Mr. John Doe",
  "email": "john@example.com",
  "phone": "+977-98XXXXXXXX",
  "qualification": "M.Sc. Mathematics",
  "subjects": ["Mathematics", "Physics"],
  "experience": "5 years",
  "imageUrl": "firebase-storage-url",
  "quote": "Teaching is my passion"
}
```

### results

```json
{
  "name": "Student Name",
  "exam": "IOE Entrance 2024",
  "rank": "Rank 45",
  "score": "98.5%",
  "initials": "SN",
  "color": "bg-amber-500"
}
```

### achievements

```json
{
  "year": "2024",
  "ioe": "12",
  "iom": "8",
  "board90": "35+",
  "boardToppers": "5"
}
```

### contacts

```json
{
  "name": "Student Name",
  "email": "student@email.com",
  "phone": "+977-98XXXXXXXX",
  "message": "Inquiry message",
  "timestamp": "2024-01-19T10:30:00Z"
}
```

## Admin Access

**URL**: `/admin/login`

Create admin users in Firebase Console → Authentication → Users

## Deployment

### Vercel (Recommended)

```sh
npm i -g vercel
vercel
```

### Netlify

```sh
npm run build
# Deploy dist/ folder
```

**Important**: Set environment variables in your hosting provider dashboard.

## Available Scripts

```sh
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Key Features

- **Dynamic Content**: All pages fetch live data from Firestore
- **Real-time Updates**: Changes in admin panel reflect immediately
- **Responsive Design**: Mobile-first approach
- **Secure**: Protected admin routes with Firebase Authentication
- **Performance**: Optimized image loading, skeleton loaders, lazy loading
