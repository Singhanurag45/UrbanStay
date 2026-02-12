import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Hotels from "./Pages/Hotels";
import Profile from "./Pages/Profile";
import Booking from "./Pages/Booking";
import MyBookings from "./Pages/MyBookings";
import PaymentStatus from "./Pages/PaymentStatus";

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ManageHotels from "./Pages/Admin/ManageHotels";
import Users from "./Pages/Admin/Users";
import AdminProfile from "./Pages/Admin/AdminProfile";
import Bookings from "./Pages/Admin/AllBookings";
import AdminLayout from "./Pages/Admin/AdminLayout";


function App() {
  return (
    <>
      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

      <div className="min-h-screen bg-zinc-950">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotels" element={<Hotels />} />

          {/* User */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="user">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hotel/:hotelId/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-status"
            element={
              <ProtectedRoute>
                <PaymentStatus />
              </ProtectedRoute>
            }
          />

           {/* We wrap them in the Layout here */}
          <Route path="/admin" element={
             <ProtectedRoute role="admin">
                <AdminLayout />
             </ProtectedRoute>
          }>
            {/* These pages will appear inside the <Outlet /> */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="manage-hotels" element={<ManageHotels />} />
          </Route>

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <FAQ/>

      <Footer />
    </>
  );
}

export default App;
