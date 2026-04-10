import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Tours from '../pages/Tours'
import TourDetails from '../pages/TourDetails'
import SearchResultList from '../pages/SearchResultList'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Booked from '../pages/Booked'
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
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound'  

const Router = () => {
  return (
    <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/my-account' element={<MyAccount />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/admin-reviews' element={<AdminReviews />} />
        <Route path='/all-booking' element={<Bookings />} />
        <Route path='/all-tours' element={<AdminTours />} />
        <Route path='/update-tour/:id' element={<UpdateTours />} />
        <Route path='/create' element={<CreateTours />} />
        <Route path='/mediator-dashboard' element={<MediatorDashboard />} />
        <Route path='/mediator-profile' element={<MediatorProfile />} />
        <Route path='/mediators' element={<MediatorsList />} />
        <Route path='/mediator-management' element={<MediatorManagement />} />
        <Route path='/mediator-cost' element={<MediatorCostManager />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/tours' element={<Tours />} />
        <Route path='/tours/:id' element={<TourDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/booked' element={<Booked />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/tours/search' element={<SearchResultList />} />
        <Route path='/my-trips' element={<MyTrips />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default Router
