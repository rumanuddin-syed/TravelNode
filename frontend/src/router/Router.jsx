import React, { useContext } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Tours from '../pages/Tours'
import TourDetails from '../pages/TourDetails'
import SearchResultList from '../pages/SearchResultList'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Booked from '../pages/Booked'
import PaymentInstructions from '../pages/PaymentInstructions'
import MyAccount from '../Dashboard/UserAccount/MyAccount'
import Bookings from '../Dashboard/AdminPanel/Bookings'
import AdminTours from '../Dashboard/AdminPanel/AdminTours'
import CreateTours from '../Dashboard/AdminPanel/CreateTours'
import UpdateTours from '../Dashboard/AdminPanel/UpdateTour'
import MyTrips from '../pages/MyTrips'
import MediatorDashboard from '../pages/MediatorDashboard'
import MediatorProfile from '../pages/MediatorProfile'
import MediatorsList from '../pages/MediatorsList'
import MediatorManagement from '../Dashboard/AdminPanel/MediatorManagement'
import MediatorCostManager from '../Dashboard/AdminPanel/MediatorCostManager'
import AdminDashboard from '../Dashboard/AdminPanel/AdminDashboard'
import AdminReviews from '../Dashboard/AdminPanel/AdminReviews'
import AdminPayments from '../Dashboard/AdminPanel/AdminPayments'
import AdminAnalytics from '../Dashboard/AdminPanel/AdminAnalytics'
import AdminSupport from '../Dashboard/AdminPanel/AdminSupport'
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound'  

import ProtectedRoute from './ProtectedRoute'

const RootRedirect = () => {
  const { user, role } = useContext(AuthContext);

  if (user && role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (user && role === 'mediator') {
    return <Navigate to="/mediator-dashboard" replace />;
  }
  return <Navigate to="/home" replace />;
};

const RoleBasedHome = () => {
  const { user, role } = useContext(AuthContext);

  if (user && role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (user && role === 'mediator') {
    return <Navigate to="/mediator-dashboard" replace />;
  }
  return <Home />;
};

const Router = () => {
  return (
    <Routes>
        <Route path='/' element={<RootRedirect />} />
        <Route path='/home' element={<RoleBasedHome />} />
        
        {/* User Account Routes */}
        <Route path='/my-account' element={
          <ProtectedRoute allowedRoles={['user']}>
            <MyAccount />
          </ProtectedRoute>
        } />
        <Route path='/booked' element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Booked />
          </ProtectedRoute>
        } />
        <Route path='/payment-instructions/:bookingId' element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <PaymentInstructions />
          </ProtectedRoute>
        } />
        <Route path='/my-trips' element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <MyTrips />
          </ProtectedRoute>
        } />

        {/* Admin Specific Routes */}
        <Route path='/admin-dashboard' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/admin-reviews' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReviews />
          </ProtectedRoute>
        } />
        <Route path='/admin-payments' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPayments />
          </ProtectedRoute>
        } />
        <Route path='/admin-analytics' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />
        <Route path='/admin-support' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSupport />
          </ProtectedRoute>
        } />
        <Route path='/all-booking' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Bookings />
          </ProtectedRoute>
        } />
        <Route path='/all-tours' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTours />
          </ProtectedRoute>
        } />
        <Route path='/update-tour/:id' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UpdateTours />
          </ProtectedRoute>
        } />
        <Route path='/create' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateTours />
          </ProtectedRoute>
        } />
        <Route path='/mediator-management' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MediatorManagement />
          </ProtectedRoute>
        } />
        <Route path='/mediator-cost' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MediatorCostManager />
          </ProtectedRoute>
        } />

        {/* Mediator Specific Routes */}
        <Route path='/mediator-dashboard' element={
          <ProtectedRoute allowedRoles={['mediator']}>
            <MediatorDashboard />
          </ProtectedRoute>
        } />
        <Route path='/mediator-profile' element={
          <ProtectedRoute allowedRoles={['mediator']}>
            <MediatorProfile />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path='/mediators' element={<MediatorsList />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/tours' element={<Tours />} />
        <Route path='/tours/:id' element={<TourDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/tours/search' element={<SearchResultList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default Router
