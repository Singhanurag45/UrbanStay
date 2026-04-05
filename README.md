# UrbanStay - Hotel Booking System

A full-stack hotel booking application built with React, TypeScript, Express, and MongoDB. Users can search for hotels, make bookings, pay online, verify signup with OTP, and administrators can manage hotels and view analytics.

## 🚀 Features

### User Features

- 🔐 User authentication (OTP signup/Register/Login)
- 🔍 Search hotels by destination, dates, and guests
- 📅 Book hotels with date selection
- 💳 Online payment flow with Cashfree
- 👤 User profile management
- 📋 View booking history
- ❤️ Wishlist support
- 🏨 Browse hotel details with images and amenities

### Admin Features

- 📊 Analytics dashboard with charts and statistics
- 🏨 Manage hotels (CRUD operations)
- 👥 User management
- 📋 View all bookings
- 📈 Revenue and booking analytics

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Toastify** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Brevo** - OTP email delivery
- **Cashfree** - Payment gateway
- **Cloudinary** - Image storage
- **Multer** - File uploads

## 🔁 Key Flows

- Signup uses OTP verification through Brevo before an account becomes active.
- A welcome email is sent after successful OTP verification.
- Booking confirmation emails are sent after both direct booking creation and payment confirmation.
- Hotel booking availability is protected with a dedicated availability collection to prevent double booking.
- Payments are created with Cashfree and finalized before a booking is written.

## 📁 Project Structure

```
HotelBooking/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── api/         # API service files
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── Pages/       # Page components
│   │   │   └── Admin/   # Admin dashboard pages
│   │   └── validation/   # Frontend Zod schemas
│   └── public/      # Static assets
│
├── backend/          # Express backend API
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── validation/  # Backend Zod schemas
│   └── dist/        # Compiled JavaScript
│
└── README.md        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Brevo account for OTP and transactional emails
- Cashfree account for payment checkout

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd HotelBooking
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=7000

# Database
MONGODB_CONNECTION_STRING=your_mongodb_connection_string

# JWT Secret
JWT_SECRET_KEY=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Brevo OTP emails
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=verified-sender@example.com
BREVO_SENDER_NAME=UrbanStay

# Cashfree payments
CASHFREE_ENV=SANDBOX
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:7000/api
```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   Backend will run on `http://localhost:7000`

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

3. **Build for production**

   ```bash
   # Backend
   cd backend
   npm run build
   npm start

   # Frontend
   cd frontend
   npm run build
   ```

## 🌐 Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Connect your repository to Render
3. Create a new Web Service
4. Set configuration:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables in Render dashboard
6. Deploy!

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set configuration:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
4. Add environment variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
5. Deploy!

Make sure the backend environment variables are configured in your hosting provider before deploying.

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Alias for signup OTP request
- `POST /api/auth/register/request-otp` - Request a signup OTP
- `POST /api/auth/register/verify-otp` - Verify OTP and create the session
- `GET /api/auth/validate-token` - Validate the current session cookie
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Hotels

- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `GET /api/hotels/:hotelId/booked-dates` - Get booked dates for a hotel

### My Hotels

- `POST /api/my-hotels` - Create a hotel listing
- `GET /api/my-hotels` - Get hotels created by the current admin
- `GET /api/my-hotels/:id` - Get one admin-managed hotel
- `PUT /api/my-hotels/:id` - Update an admin-managed hotel
- `DELETE /api/my-hotels/:id` - Delete an admin-managed hotel

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get current user bookings
- `GET /api/bookings/all` - Get all bookings for admin
- `PATCH /api/bookings/:id/cancel` - Cancel a booking

### Payments

- `POST /api/payments/create-order` - Create a Cashfree payment order
- `POST /api/payments/confirm` - Confirm payment and create booking

### User

- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users for admin
- `DELETE /api/users/:userId` - Delete a user for admin

### Admin

- `GET /api/admin/analytics` - Get analytics data

## 🔒 Security Features

- JWT-based authentication
- Email OTP verification for signup
- Welcome email after signup verification
- Booking confirmation email after successful booking or payment confirmation
- Cookie-based authentication
- Transactional booking writes with availability locking
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Protected routes
- Secure cookie handling

## 📝 Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Anurag Singh**

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- All open-source contributors

---

**Note**: Make sure to never commit `.env` files to version control. Use `.env.example` files as templates.
