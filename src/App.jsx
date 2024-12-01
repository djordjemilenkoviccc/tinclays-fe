import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';

import Header from './components/header';
import Footer from './components/footer';
import Home from './components/home';
import AboutMe from './components/about-me';
import Contact from './components/contact';
import FAQ from './components/faq';
import Products from './components/products';
import AdminPanel from './components/admin-panel';
import AdminHeader from './components/admin-header';
import AdminCategories from './components/admin-categories';
import AdminProducts from './components/admin-products';
import AdminProductsEdit from './components/admin-products-edit';
import AdminCosts from './components/admin-costs';
import Login from './components/login';
import Checkout from './components/checkout';
import CheckoutStatus from './components/checkout-status';
import CartProvider from './components/cart-context';
import ScrollToTop from './components/scroll-to-top';
import AuthProvider from './components/auth-context';
import ProtectedRoute from './components/protected-route';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminRoute && <Header />}  {/* Show regular header */}
      {isAdminRoute && <AdminHeader />}  {/* Show admin-specific header */}
      <div className="content-wrap">


        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              exact
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/products/:categoryId"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Products />
                </motion.div>
              }
            />
            <Route
              path="/about-me"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AboutMe />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Contact />
                </motion.div>
              }
            />
            <Route
              path="/faq"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FAQ />
                </motion.div>
              }
            />
            <Route
              path="/checkout"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Checkout />
                </motion.div>
              }
            />
            <Route
              path="/checkout-status"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckoutStatus />
                </motion.div>
              }
            />
            <Route
              path="/login"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Login />
                </motion.div>
              }
            />
            <Route
              path="/admin-panel/:status"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminPanel />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-categories"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminCategories />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-products"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminProducts />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-costs"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminCosts />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            <Route
              path='admin-products/edit/:id'
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminProductsEdit />
                  </motion.div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AnimatedRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>

  );
}


export default App;
