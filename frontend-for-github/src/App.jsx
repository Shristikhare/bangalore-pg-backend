import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PGDetail from './pages/PGDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import AddEditPG from './pages/AddEditPG';
import MyEnquiries from './pages/MyEnquiries';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pgs" element={<Listings />} />
          <Route path="/pgs/:id" element={<PGDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/my-enquiries"
            element={
              <ProtectedRoute>
                <MyEnquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute ownerOnly>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add"
            element={
              <ProtectedRoute ownerOnly>
                <AddEditPG />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit/:id"
            element={
              <ProtectedRoute ownerOnly>
                <AddEditPG />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
