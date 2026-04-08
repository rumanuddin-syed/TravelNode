# Language Mediator Dashboard Feature

## Overview
This feature adds a complete language mediator management system to the TravelNode application. It allows admins to assign language mediators to customer bookings, manage mediator costs per hour, and enables mediators to view their assigned trips.

## Features

### 1. **User Roles**
- Added `mediator` role to the User model alongside existing `user` and `admin` roles
- Mediators can be created by registering with the role assigned by admins

### 2. **Backend Changes**

#### Models Updated:
- **User.js**: Added `mediator` role option to the role enum
- **Booking.js**: Added three new fields:
  - `mediatorId`: References the assigned mediator
  - `costPerHour`: Mediator's hourly rate for the trip
  - `hours`: Number of hours the mediator will work

#### New Controller: `mediatorController.js`
- `getMediatorBookings(id)`: Get all bookings assigned to a mediator
- `updateBookingCost(id)`: Update cost per hour and hours for a booking
- `assignMediator(id)`: Assign a mediator to a booking
- `getAllMediators()`: Get all users with mediator role

#### New Routes: `mediatorRoutes.js`
- `GET /mediators`: Get all available mediators
- `GET /mediator-bookings/:id`: Get bookings for a specific mediator
- `PUT /booking-cost/:id`: Update mediator cost details
- `PUT /assign-mediator/:id`: Assign mediator to booking

#### Updated: `index.js`
- Imported and registered mediator routes

### 3. **Frontend Changes**

#### Components Created:

1. **MediatorDashboard.jsx** (`/pages`)
   - View for mediators to see all their assigned bookings
   - Displays:
     - Tour name
     - Customer name
     - Booking date
     - Cost per hour
     - Hours assigned
     - Total cost calculation

2. **MediatorManagement.jsx** (`/Dashboard/AdminPanel`)
   - Admin interface to assign mediators to bookings
   - Features:
     - View all bookings
     - See current mediator assignment
     - Modal to select and assign a mediator
     - Fetch all available mediators

3. **MediatorCostManager.jsx** (`/Dashboard/AdminPanel`)
   - Admin interface to manage mediator costs
   - Features:
     - View all bookings with assigned mediators
     - Edit cost per hour and hours for each booking
     - Calculate total mediator cost automatically
     - Save changes to database

#### Routes Updated: `Router.jsx`
- `/mediator-dashboard`: Mediator dashboard view
- `/mediator-management`: Admin mediator assignment interface
- `/mediator-cost`: Admin cost management interface

#### Header Updated: `Header.jsx`
- Dynamic routing for user profile link:
  - Regular users → `/my-account`
  - Mediators → `/mediator-dashboard`
  - Admins → `#`

## API Endpoints

### Mediator Endpoints
```
GET    /api/mediator/mediators                  - Get all mediators (Admin)
GET    /api/mediator/mediator-bookings/:id     - Get mediator's bookings
PUT    /api/mediator/booking-cost/:id          - Update booking cost details
PUT    /api/mediator/assign-mediator/:id       - Assign mediator to booking (Admin)
```

## Database Schema Updates

### Booking Model
```javascript
{
  userId: String,
  fullName: String,
  tourName: String,
  totalPrice: Number,
  maxGroupSize: Number,
  phone: String,
  date: String,
  mediatorId: String,              // NEW: Reference to mediator
  costPerHour: Number,              // NEW: Mediator's hourly rate
  hours: Number,                    // NEW: Duration in hours
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  username: String,
  email: String,
  password: String,
  photo: String,
  role: String                       // UPDATED: Now includes "mediator"
}
```

## Usage Flow

### Admin Workflow:
1. Admin navigates to `/mediator-management`
2. Clicks "Assign Mediator" for a booking
3. Selects a mediator from the modal
4. Mediator is assigned to the booking
5. Admin goes to `/mediator-cost`
6. Clicks "Edit" on the booking
7. Enters cost per hour and hours
8. Clicks "Save" to update

### Mediator Workflow:
1. Mediator logs in with their account (role: mediator)
2. Clicks on profile icon → navigates to `/mediator-dashboard`
3. Views all assigned bookings
4. Sees tour details, customer info, and compensation details
5. Total compensation = costPerHour × hours

## Security
- All mediator endpoints protected with authentication middleware
- Admin endpoints require admin role verification
- Mediators can only view their own assigned bookings

## Installation

No additional installation required. The feature is fully integrated with the existing backend and frontend.

## Future Enhancements
- Add mediator ratings and reviews
- Implement automatic cost calculation based on tour duration
- Add mediator availability scheduling
- Create payment tracking for mediators
- Add analytics and reporting for mediator performance
