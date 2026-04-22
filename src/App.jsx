import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ForNGOs from './pages/ForNGOs';
import ForVolunteers from './pages/ForVolunteers';
import ForDonors from './pages/ForDonors';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';

// Auth Pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import VolunteerStep1 from './pages/auth/VolunteerStep1';
import VolunteerStep2 from './pages/auth/VolunteerStep2';
import DonorStep1 from './pages/auth/DonorStep1';
import DonorStep2 from './pages/auth/DonorStep2';
import NGOStep1 from './pages/auth/NGOStep1';
import NGOStep2 from './pages/auth/NGOStep2';

// Dashboards
import VolunteerDashboard from './pages/dashboard/VolunteerDashboard';
import DonorDashboard from './pages/dashboard/DonorDashboard';
import NGODashboard from './pages/dashboard/NGODashboard';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AuthLayout = () => (
  <div className="min-h-screen flex flex-col bg-sand py-12 px-4 sm:px-6 lg:px-8 justify-center">
    <div className="flex justify-center mb-8">
      <a href="/" className="flex items-center gap-2 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal group-hover:rotate-12 transition-transform"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
        <span className="font-serif text-3xl text-teal">ServeSphere</span>
      </a>
    </div>
    <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/for-ngos" element={<ForNGOs />} />
            <Route path="/for-volunteers" element={<ForVolunteers />} />
            <Route path="/for-donors" element={<ForDonors />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/signup/volunteer/step1" element={<VolunteerStep1 />} />
            <Route path="/signup/volunteer/step2" element={<VolunteerStep2 />} />
            <Route path="/signup/donor/step1" element={<DonorStep1 />} />
            <Route path="/signup/donor/step2" element={<DonorStep2 />} />
            <Route path="/signup/ngo/step1" element={<NGOStep1 />} />
            <Route path="/signup/ngo/step2" element={<NGOStep2 />} />
          </Route>

          {/* Sign In & Sign Up — standalone full-page layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard/volunteer" 
            element={
              <ProtectedRoute requiredRole="volunteer">
                <VolunteerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/donor" 
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/ngo" 
            element={
              <ProtectedRoute requiredRole="ngo">
                <NGODashboard />
              </ProtectedRoute>
            } 
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
