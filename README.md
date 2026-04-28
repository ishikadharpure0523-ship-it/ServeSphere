# ServeSphere - Social Impact Platform

ServeSphere is a comprehensive platform connecting NGOs, volunteers, and donors in India. Built with transparency, trust, and measurable impact at its core.

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

Create `.env` in root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_BASE_URL=http://localhost:5000
```

Create `backend/.env`:
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

4. **Setup Firebase**
- Follow the detailed [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Create a Firebase project
- Enable Authentication (Email/Password)
- Create Firestore database
- Enable Firebase Storage
- Download service account key and place in `backend/` folder as `serviceAccountKey.json`

5. **Run the application**

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




