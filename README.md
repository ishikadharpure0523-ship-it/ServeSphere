# ServeSphere - Social Impact Platform

ServeSphere is a comprehensive platform connecting NGOs, volunteers, and donors in India. Built with transparency, trust, and measurable impact at its core.

## 🌟 Features

### For Volunteers
- **Discover Opportunities**: Browse verified NGOs and volunteer opportunities
- **Apply & Track**: Submit applications and track status in real-time
- **Earn Certificates**: Auto-generated verified certificates for completed tasks
- **Build Profile**: Showcase your impact with portfolio and trust score
- **Gamification**: Earn badges and milestones for your contributions
- **SDG Tracking**: See which UN Sustainable Development Goals you're contributing to

### For Donors
- **Browse NGOs**: Find verified organizations by cause, location, and trust score
- **Pledge Donations**: Commit to supporting NGO projects
- **Impact Tracking**: See exactly how your donation was utilized
- **Resource Donations**: Donate books, clothes, food, and more
- **Donation History**: Track all your contributions

### For NGOs
- **Post Opportunities**: Find volunteers for your projects
- **Manage Applications**: Review and accept volunteer applications
- **Fundraising**: Create fund requests and track donations
- **Transparency Tools**: Upload bills, photos, and impact reports
- **Build Trust**: Increase trust score through verified activities
- **Real-time Notifications**: Get instant updates on applications and donations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Firebase SDK** - Authentication & Real-time updates
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Backend

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/servesphere.git
cd servesphere
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
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
- Download service account key and place in `backend/` folder

5. **Run the application**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
npm run dev
```

Visit http://localhost:5173

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Database Schema](./DATABASE_SCHEMA.md) - Data structure and relationships
- [API Documentation](#api-documentation) - Backend API endpoints

## 🔐 Security Features

- **Firebase Authentication**: Secure email/password authentication
- **Role-based Access Control**: Separate permissions for volunteers, donors, and NGOs
- **Firestore Security Rules**: Database-level security
- **Storage Security Rules**: File upload restrictions
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Sanitized user inputs

## 🎨 Design System

### Colors
- **Teal** (#1D9E75) - Primary brand color
- **Amber** (#F59E0B) - Volunteer actions
- **Coral** (#F97316) - Donor actions
- **Ink** (#1A1A14) - Text
- **Sand** (#FAFAF8) - Background

### Typography
- **Headings**: DM Serif Display
- **Body**: DM Sans

## 📱 Key Features Implementation

### Real Firebase Authentication
- Email/password signup and login
- Token-based API authentication
- Password reset functionality
- Persistent sessions

### File Upload System
- Profile images
- Verification documents
- Project photos
- Bills and receipts
- Image compression
- File validation

### Real-time Notifications
- Firestore real-time listeners
- Browser notifications
- In-app notification center
- Email notifications (configurable)
- Notification preferences
- Sound alerts

### Database & Storage
- Firestore for structured data
- Firebase Storage for files
- Real-time synchronization
- Offline support
- Automatic backups

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
cd backend
# Push to GitHub and connect to hosting platform
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## 🧪 Testing

### Test Accounts
Create test accounts for each role:
- Volunteer: volunteer@test.com
- Donor: donor@test.com
- NGO: ngo@test.com

## 📊 API Documentation

### Authentication
- `POST /api/profile` - Create/update user profile
- `GET /api/me` - Get current user profile

### Opportunities
- `GET /api/opportunities` - List opportunities
- `POST /api/opportunities` - Create opportunity (NGO only)
- `PUT /api/opportunities/:id` - Update opportunity

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Apply to opportunity
- `PUT /api/applications/:id` - Update application status

### Donations
- `GET /api/donations` - List donations
- `POST /api/donations` - Create donation pledge

### Notifications
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Stats
- `GET /api/stats/volunteer` - Volunteer statistics
- `GET /api/stats/ngo` - NGO statistics
- `GET /api/stats/donor` - Donor statistics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Tailwind CSS for styling system
- Framer Motion for animations
- Lucide for icons

## 📧 Contact

- Website: https://servesphere.org
- Email: support@servesphere.org
- Twitter: @servesphere

## 🗺️ Roadmap

- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] Volunteer matching algorithm
- [ ] Impact reports generator
- [ ] Social media integration
- [ ] Volunteer time tracking
- [ ] NGO verification system

---

Built with ❤️ for social impact in India
