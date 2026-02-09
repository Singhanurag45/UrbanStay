# UrbanStay - Hotel Booking System

A full-stack hotel booking application built with React, TypeScript, Express, and MongoDB. Users can search for hotels, make bookings, manage their profiles, and administrators can manage hotels and view analytics.

## 🚀 Features

### User Features
- 🔐 User authentication (Register/Login)
- 🔍 Search hotels by destination, dates, and guests
- 📅 Book hotels with date selection
- 👤 User profile management
- 📋 View booking history
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
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File uploads

## 📁 Project Structure

```
HotelBooking/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── api/      # API service files
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   └── Pages/       # Page components
│   └── public/      # Static assets
│
├── backend/          # Express backend API
│   ├── src/
│   │   ├── config/     # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Mongoose models
│   │   └── routes/      # API routes
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

📖 **Detailed deployment guide**: See `DEPLOYMENT_GUIDE.md`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel by ID

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID

### User
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile

### Admin
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings

## 🔒 Security Features

- JWT-based authentication
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
