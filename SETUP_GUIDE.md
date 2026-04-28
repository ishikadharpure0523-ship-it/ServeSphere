# ServeSphere Setup Guide

This guide will help you set up the complete ServeSphere platform with all features including Firebase authentication, real-time database, file uploads, payment integration, and notifications.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Razorpay account (for payments)

## 1. Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable other providers like Google, Facebook, etc.

### Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Start in **production mode** (we'll set rules later)
3. Choose a location closest to your users

### Set Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // Opportunities collection
    match /opportunities/{opportunityId} {
      allow read: if true; // Public read
      allow create: if hasRole('ngo');
      allow update, delete: if hasRole('ngo') && resource.data.ngoId == request.auth.uid;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if isSignedIn() && (
        resource.data.volunteerId == request.auth.uid ||
        resource.data.ngoId == request.auth.uid
      );
      allow create: if hasRole('volunteer');
      allow update: if hasRole('ngo') && resource.data.ngoId == request.auth.uid;
    }
    
    // Certificates collection
    match /certificates/{certificateId} {
      allow read: if true; // Public for verification
      allow create, update: if hasRole('ngo');
    }
    
    // Fund requests collection
    match /fundRequests/{requestId} {
      allow read: if true; // Public read
      allow create: if hasRole('ngo');
      allow update, delete: if hasRole('ngo') && resource.data.ngoId == request.auth.uid;
    }
    
    // Donations collection
    match /donations/{donationId} {
      allow read: if isSignedIn() && (
        resource.data.donorId == request.auth.uid ||
        resource.data.ngoId == request.auth.uid
      );
      allow create: if hasRole('donor');
      allow update: if hasRole('ngo') && resource.data.ngoId == request.auth.uid;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, update, delete: if isOwner(resource.data.userId);
      allow create: if isSignedIn();
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isSignedIn() && (
        resource.data.senderId == request.auth.uid ||
        resource.data.receiverId == request.auth.uid
      );
      allow create: if isSignedIn();
    }
  }
}
```

### Enable Firebase Storage

1. Go to **Storage** > **Get started**
2. Start in **production mode**
3. Set Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isValidImage() {
      return request.resource.contentType.matches('image/.*') &&
             request.resource.size < 5 * 1024 * 1024; // 5MB
    }
    
    function isValidDocument() {
      return request.resource.contentType.matches('application/pdf') &&
             request.resource.size < 10 * 1024 * 1024; // 10MB
    }
    
    // User profile images
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if isOwner(userId) && (isValidImage() || isValidDocument());
    }
    
    // NGO files
    match /ngos/{ngoId}/{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn() && (isValidImage() || isValidDocument());
    }
    
    // Certificates
    match /certificates/{certificateId}/{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn();
    }
    
    // Donations proof
    match /donations/{donationId}/{allPaths=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
    }
  }
}
```

### Get Firebase Config

1. Go to **Project Settings** > **General**
2. Scroll to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register app with nickname "ServeSphere"
5. Copy the Firebase configuration object

### Setup Firebase Admin SDK (Backend)

1. Go to **Project Settings** > **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file as `serviceAccountKey.json` in the `backend` folder
4. **IMPORTANT**: Add `serviceAccountKey.json` to `.gitignore`

## 2. Environment Variables Setup

### Frontend (.env)

Create `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (backend/.env)

Create `.env` file in the `backend` directory:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

# Firebase Admin - Option 1 (Recommended)
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

## 3. Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
cd backend
npm install
```

### Additional Dependencies

If not already installed, add these:

```bash
# Frontend
npm install firebase
```

## 4. Database Indexes

Create these indexes in Firestore for better performance:

1. Go to **Firestore Database** > **Indexes**
2. Create composite indexes:

**opportunities**
- Collection: `opportunities`
- Fields: `status` (Ascending), `createdAt` (Descending)
- Fields: `city` (Ascending), `status` (Ascending)
- Fields: `cause` (Ascending), `status` (Ascending)

**applications**
- Collection: `applications`
- Fields: `volunteerId` (Ascending), `appliedAt` (Descending)
- Fields: `ngoId` (Ascending), `appliedAt` (Descending)

**notifications**
- Collection: `notifications`
- Fields: `userId` (Ascending), `createdAt` (Descending)
- Fields: `userId` (Ascending), `read` (Ascending)

**donations**
- Collection: `donations`
- Fields: `donorId` (Ascending), `donatedAt` (Descending)
- Fields: `ngoId` (Ascending), `donatedAt` (Descending)

## 5. Run the Application

### Development Mode

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Build

```bash
# Frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

## 6. Testing the Features

### Test Authentication
1. Go to http://localhost:5173/signup
2. Create accounts for each role (Volunteer, Donor, NGO)
3. Verify email/password login works

### Test File Upload
1. Login as NGO
2. Try uploading verification documents
3. Check Firebase Storage console

### Test Donations
1. Login as Donor
2. Browse NGOs and pledge a donation
3. Donation will be marked as "pending" for manual verification

### Test Notifications
1. Create an opportunity as NGO
2. Apply as Volunteer
3. Check if notifications appear in real-time

## 7. Common Issues & Solutions

### Firebase Connection Issues
- Verify API keys in `.env` are correct
- Check Firebase project is active
- Ensure billing is enabled (required for some features)

### File Upload Issues
- Check Storage rules are set correctly
- Verify file size limits
- Ensure proper CORS configuration

### Real-time Updates Not Working
- Check Firestore rules allow read access
- Verify WebSocket connection is not blocked
- Check browser console for errors

## 8. Deployment

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables in dashboard
4. Deploy

### Backend (Railway/Render/Heroku)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables
4. Add `serviceAccountKey.json` as secret file
5. Deploy

### Update Firebase Config

After deployment, update:
- Authorized domains in Firebase Authentication
- CORS origins in Firebase Storage
- `CLIENT_ORIGIN` in backend `.env`

## 10. Security Checklist

- [ ] All API keys are in environment variables
- [ ] `serviceAccountKey.json` is in `.gitignore`
- [ ] Firestore security rules are properly configured
- [ ] Storage security rules are set
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled on backend
- [ ] Input validation is implemented
- [ ] XSS protection is in place
- [ ] HTTPS is enabled in production

## 10. Monitoring & Analytics

### Firebase Analytics
- Enable in Firebase Console
- Track user engagement
- Monitor crash reports

### Error Tracking
- Integrate Sentry or similar service
- Monitor backend logs
- Set up alerts for critical errors

## Support

For issues or questions:
- Check the [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data structure
- Review Firebase documentation
- Contact support@servesphere.org

## Next Steps

1. Customize branding and colors
2. Add email templates
3. Implement SMS notifications
4. Integrate payment gateway (when ready)
5. Create admin dashboard
6. Implement analytics dashboard
7. Add multi-language support
8. Create mobile app (React Native)

Happy coding! 🚀
