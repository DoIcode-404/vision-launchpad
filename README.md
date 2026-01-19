# The New Vision Tuition Center - Admin Dashboard & Website

A comprehensive full-stack web application for managing a tuition center with a public website and secure admin panel. Built with React, TypeScript, Firebase, and Tailwind CSS.

**Live Demo**: https://vision-launchpad.vercel.app  
**Repository**: https://github.com/DoIcode-404/vision-launchpad

---

## 📋 Features

### 🌐 Public Website

- **Home Page** - Hero section with course preview, stats, and testimonials
- **Courses Page** - Browse all courses with filters (category & grades)
- **Faculty Page** - Meet your instructors with images, quotes, and experience
- **Results Page** - View student achievements with year-wise performance
- **Contact Page** - Get in touch with the tuition center
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop

### 🔐 Admin Dashboard

- **Authentication** - Secure Firebase-based login with email/password
- **Course Management** - Add, edit, delete courses with icons and features
- **Faculty Management** - Manage faculty with image uploads and quotes
- **Results Management** - Track student achievements with search & sorting
- **Achievements Management** - Manage year-wise performance data
- **Analytics Dashboard** - View real-time statistics and metrics
- **Contact Messages** - View inquiries from the contact form

### 💾 Data Management

- **Firestore Database** - Cloud-based data storage with real-time sync
- **Firebase Storage** - Secure image hosting for faculty photos
- **Dynamic Content** - All public pages fetch live data from Firestore

---

## 🛠 Tech Stack

| Technology       | Purpose                            |
| ---------------- | ---------------------------------- |
| **React 18**     | Frontend framework                 |
| **TypeScript**   | Type-safe JavaScript               |
| **Vite**         | Build tool & dev server            |
| **Tailwind CSS** | Utility-first styling              |
| **Shadcn UI**    | Pre-built UI components            |
| **Firebase**     | Authentication, Firestore, Storage |
| **React Router** | Client-side routing                |
| **Lucide React** | Icon library                       |

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+ (install with [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager
- Firebase project (for backend)

### Local Development

```sh
# Clone the repository
git clone https://github.com/DoIcode-404/vision-launchpad.git

# Navigate to project
cd vision-launchpad

# Install dependencies
npm install

# Create .env.local file with Firebase credentials
# (Ask the developer for the credentials)

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Production Build

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Cloud Storage
5. Copy credentials to `.env.local`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📂 Project Structure

```
src/
├── pages/
│   ├── Index.tsx                 # Home page
│   ├── Courses.tsx               # Courses listing
│   ├── Faculty.tsx               # Faculty page
│   ├── Results.tsx               # Results/achievements
│   ├── Contact.tsx               # Contact form
│   ├── About.tsx                 # About page
│   └── admin/
│       ├── AdminLogin.tsx        # Admin login
│       ├── AdminDashboard.tsx    # Admin home
│       ├── AdminCourses.tsx      # Course management
│       ├── AdminFaculty.tsx      # Faculty management
│       ├── AdminResults.tsx      # Results management
│       ├── AdminAchievements.tsx # Achievements management
│       ├── AdminContacts.tsx     # Contact messages
│       └── AdminAnalytics.tsx    # Analytics dashboard
├── components/
│   ├── home/                     # Home page components
│   ├── layout/                   # Layout components
│   └── ui/                       # Shadcn UI components
├── lib/
│   ├── firebase.ts               # Firebase config
│   └── icons.ts                  # Icon mapping
├── contexts/
│   └── AdminContext.tsx          # Auth & admin context
└── hooks/
    └── use-toast.ts             # Toast notifications
```

---

## 🗄 Firestore Collections

### `courses`

```json
{
  "id": "auto-generated",
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

### `faculty`

```json
{
  "id": "auto-generated",
  "name": "Mr. John Doe",
  "email": "john@example.com",
  "phone": "+977-98XXXXXXXX",
  "qualification": "M.Sc. Mathematics",
  "subjects": ["Mathematics", "Physics"],
  "experience": "5 years",
  "imageUrl": "firebase-storage-url",
  "imagePath": "faculty/timestamp_filename",
  "quote": "Teaching is my passion"
}
```

### `results`

```json
{
  "id": "auto-generated",
  "name": "Bikash Thapa",
  "exam": "IOE Entrance 2024",
  "rank": "Rank 45",
  "score": "98.5%",
  "initials": "BT",
  "color": "bg-amber-500"
}
```

### `achievements`

```json
{
  "id": "auto-generated",
  "year": "2024",
  "ioe": "12",
  "iom": "8",
  "board90": "35+",
  "boardToppers": "5"
}
```

### `contacts`

```json
{
  "id": "auto-generated",
  "name": "Student Name",
  "email": "student@email.com",
  "message": "Inquiry message",
  "phone": "+977-98XXXXXXXX",
  "timestamp": "2024-01-19T10:30:00Z"
}
```

---

## 🔐 Admin Login

**URL**: `https://yourdomain.com/admin/login`

### Creating Admin Users

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **Add user**
5. Enter email and password

**Default Credentials** (provided by developer)

- Email: `admin@newvision.edu`
- Password: [Secure password]

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```sh
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify

```sh
# Build locally
npm run build

# Deploy dist folder to Netlify
```

### Environment Variables for Production

Set these in your hosting provider:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## 📊 Key Features in Detail

### Dynamic Content Loading

- All public pages fetch live data from Firestore
- Fallback to default data if collection is empty
- Real-time updates when admin makes changes

### Responsive Design

- Mobile-first approach
- Fully responsive on all screen sizes
- Touch-friendly interface

### Security

- Firebase Authentication for admin access
- Email/password login system
- Protected admin routes
- Secure image storage in Firebase Storage

### Performance

- Optimized image loading
- Skeleton loaders for better UX
- Efficient database queries
- Lazy loading of components

---

## 🐛 Troubleshooting

### Login Issues

- Check Firebase credentials in `.env.local`
- Ensure admin user exists in Firebase Authentication
- Clear browser cache and try again

### Images Not Loading

- Verify Firebase Storage bucket permissions
- Check image upload path in admin panel
- Ensure CORS is configured in Firebase

### Firestore Errors

- Check collection names match exactly
- Verify Firestore security rules allow read/write
- Check network tab in browser DevTools

---

## 📝 Available Scripts

```sh
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # Run TypeScript check
```

---

## 📄 License

This project is proprietary and belongs to The New Vision Tuition Center.

---

## 👥 Support

For technical support or questions:

- Contact the development team
- Review the inline code comments
- Check Firestore console for data issues

---

## 🎯 Future Enhancements

- [ ] Email notifications for contact form submissions
- [ ] SMS integration for student alerts
- [ ] Payment gateway integration
- [ ] Student performance tracking
- [ ] Online class scheduling
- [ ] Mobile app version

---

**Last Updated**: January 19, 2026  
**Version**: 1.0.0

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
