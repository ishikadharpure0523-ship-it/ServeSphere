# ServeSphere - Social Impact Platform

ServeSphere is a comprehensive platform connecting NGOs, volunteers, and donors in India. Built with transparency, trust, and measurable impact at its core.

## IMPORTANT: Demo Credentials Notice

This repository includes **public demo credentials** in `.env.example` to allow easy testing and evaluation. 

**What's Included:**
- Firebase client credentials (API key, project ID, etc.)
- Google Gemini AI API key for AI features
- All credentials are functional and ready to use

**What's NOT Included:**
- Firebase service account key (`serviceAccountKey.json`) - contact repository owner or create your own

**Security Considerations:**
- Demo credentials are shared and publicly accessible
- Suitable for testing, demos, and hackathon evaluation
- NOT recommended for production use
- Create your own Firebase project and API keys for production deployment
- Monitor usage to prevent abuse

## Features

### For Volunteers
- **Discover Opportunities**: Browse verified NGOs and volunteer opportunities
- **Apply & Track**: Submit applications and track status in real-time
- **Earn Certificates**: Auto-generated verified certificates for completed tasks
- **Build Profile**: Showcase your impact with portfolio and trust score
- **Gamification**: Earn badges and milestones for your contributions
- **SDG Tracking**: See which UN Sustainable Development Goals you're contributing to

### For Donors
- **Browse Fund Requests**: Find verified NGO fundraising campaigns by cause and urgency
- **Make Donations**: Pledge donations to support NGO projects
- **Impact Tracking**: See exactly how your donation was utilized
- **Donation History**: Track all your contributions with detailed records
- **Mock Data**: Demo fund requests available for testing

### For NGOs
- **Verification System**: Complete organization verification to build trust
- **Post Opportunities**: Find volunteers for your projects
- **Manage Applications**: Review and accept volunteer applications
- **Fundraising**: Create fund requests and track donations received
- **AI Description Generator**: Generate compelling fund request descriptions using Google Gemini AI
- **Transparency Tools**: Upload bills, photos, and impact reports
- **Build Trust**: Increase trust score through verified activities
- **Real-time Notifications**: Get instant updates on applications and donations
- **Quick Actions**: Fast access to create opportunities and fund requests

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Firebase SDK** - Authentication and real-time updates
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin SDK** - Server-side Firebase integration
- **Firestore** - NoSQL cloud database
- **Firebase Authentication** - User authentication service
- **Firebase Storage** - File storage service
- **Google Gemini AI** - AI-powered description generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/ishikadharpure0523-ship-it/ServeSphere
cd ServeSphere
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

3. **Setup environment variables**

**EASY SETUP - Use Demo Credentials:**

The repository includes demo Firebase credentials in `.env.example`. Simply copy it:

```bash
# Copy frontend environment file
cp .env.example .env

# Copy backend environment file  
cp .env.example backend/.env
```

**IMPORTANT NOTES:**
- Demo credentials are shared and public - anyone can use them
- Demo Gemini API key is included for testing AI features
- You still need `serviceAccountKey.json` (see step 4)
- For production, create your own Firebase project and API keys

**OR Create Your Own Firebase Project:**

If you prefer your own credentials, create `.env` files manually with your Firebase config (see `.env.example` for format).

4. **Setup Firebase Service Account Key**

**CRITICAL:** The `serviceAccountKey.json` file is NOT included in the repository for security.

**Option A - Use Demo Project:**
- Contact repository owner for the demo `serviceAccountKey.json`
- Place it in `backend/` folder

**Option B - Create Your Own:**
- Go to [Firebase Console](https://console.firebase.google.com)
- Select your project > Project Settings > Service Accounts
- Click "Generate New Private Key"
- Save as `serviceAccountKey.json` in `backend/` folder
- Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions

5. **Setup Google Gemini AI (Optional)**
- Demo API key is already included in `.env.example`
- AI features will work out of the box
- For your own key: Visit https://makersuite.google.com/app/apikey
- Enables AI-powered fund request descriptions

6. **Run the application**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
npm start
```

Visit http://localhost:5173

**Note**: The application includes mock data for demonstration purposes. You can create real opportunities, fund requests, and donations alongside the demo data.


## Security Features

- **Firebase Authentication**: Secure email/password authentication with token-based API access
- **Role-based Access Control**: Separate permissions for volunteers, donors, and NGOs
- **Firestore Security Rules**: Database-level security (to be configured)
- **Storage Security Rules**: File upload restrictions (to be configured)
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Sanitized user inputs
- **Environment Variables**: Sensitive credentials stored securely
- **CORS Configuration**: Restricted cross-origin requests

## Key Features Implementation

### Firebase Authentication
- Email/password signup and login
- Token-based API authentication
- Password reset functionality (ready to implement)
- Persistent sessions with automatic token refresh
- Role-based user profiles (Volunteer, Donor, NGO)

### NGO Verification System
- Multi-step verification form
- Registration number validation
- Contact information verification
- Instant verification for demo (configurable for manual review)
- Verified badge display
- Trust score system

### AI-Powered Features
- **Fund Request Description Generator**: Uses Google Gemini AI to create compelling, professional descriptions
- Analyzes title, cause, and target amount to generate contextual content
- Creates emotional, impactful narratives that resonate with donors
- Saves NGOs time and improves fundraising success
- Graceful fallback if AI service is unavailable

### File Upload System (Ready for Implementation)
- Profile images
- Verification documents
- Project photos
- Bills and receipts
- Image compression
- File validation

### Notifications System
- Backend notification creation
- Firestore-based notification storage
- API endpoints for fetching and marking as read
- Real-time updates (frontend integration ready)

### Database & Storage
- Firestore for structured data
- Collections: users, opportunities, applications, fundRequests, donations, notifications, certificates
- Firebase Storage for files (configured)
- Real-time synchronization capability
- Scalable NoSQL architecture

## Deployment

### Prerequisites
- Google Cloud Platform account
- Firebase project configured
- Domain name (optional)

### Frontend Deployment (Google Cloud / Firebase Hosting)
```bash
# Build the frontend
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Backend Deployment (Google Cloud Run / App Engine)
```bash
cd backend

# Deploy to Google Cloud Run
gcloud run deploy servesphere-backend \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated

# Or deploy to App Engine
gcloud app deploy
```

### Environment Variables for Production
Update `.env` files with production URLs and credentials before deployment.

## Testing

### Creating Test Accounts
The application requires you to create accounts for testing:

1. **Volunteer Account**: Sign up with role "Volunteer"
2. **Donor Account**: Sign up with role "Donor"  
3. **NGO Account**: Sign up with role "NGO"

Use any valid email format and a password with at least 6 characters.

### Demo Data
The application includes mock data for demonstration:
- Mock volunteer opportunities (3 items)
- Mock fund requests (4 items)
- Mock data is clearly labeled and functional
- Real data can be created alongside mock data

## API Documentation

All API endpoints require authentication via Bearer token in the Authorization header.

### Authentication & Profile
- `GET /api/health` - Health check endpoint
- `GET /api/me` - Get current user profile
- `POST /api/profile` - Create/update user profile
- `PUT /api/profile` - Update user profile

### Opportunities (Volunteer)
- `GET /api/opportunities` - List all opportunities (supports filters)
- `GET /api/opportunities/:id` - Get single opportunity
- `POST /api/opportunities` - Create opportunity (NGO only)
- `PUT /api/opportunities/:id` - Update opportunity (NGO only)

### Applications
- `GET /api/applications` - List applications (filtered by role)
- `POST /api/applications` - Apply to opportunity (Volunteer only)
- `PUT /api/applications/:id` - Update application status (NGO only)

### Fund Requests
- `GET /api/fund-requests` - List fund requests (supports status filter)
- `POST /api/fund-requests` - Create fund request (NGO only)

### Donations
- `GET /api/donations` - List donations (filtered by role: donor or NGO)
- `POST /api/donations` - Create donation pledge (Donor only)

### Certificates
- `GET /api/certificates` - List user certificates
- `GET /api/certificates/:code/verify` - Verify certificate by code

### Notifications
- `GET /api/notifications` - List user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read

### Statistics
- `GET /api/stats/volunteer` - Get volunteer statistics
- `GET /api/stats/ngo` - Get NGO statistics
- `GET /api/stats/donor` - Get donor statistics

### AI Features
- `POST /api/ai/generate-description` - Generate fund request description using AI (requires title, cause, targetAmount)

## Project Structure

```
ServeSphere/
├── backend/
│   ├── index.js              # Express server and API routes
│   ├── firebaseAdmin.js      # Firebase Admin SDK configuration
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Backend environment variables
│   └── serviceAccountKey.json # Firebase service account (not in git)
├── src/
│   ├── components/           # Reusable React components
│   ├── context/              # React context (AuthContext)
│   ├── lib/                  # Utility functions (api, firebase, storage)
│   ├── pages/                # Page components
│   │   ├── auth/            # Authentication pages
│   │   └── dashboard/       # Dashboard pages
│   ├── App.jsx              # Main app component
│   └── main.jsx             # App entry point
├── public/                   # Static assets
├── .env                      # Frontend environment variables
├── package.json              # Frontend dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```




