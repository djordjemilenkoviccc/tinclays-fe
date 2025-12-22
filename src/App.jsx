import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import components that are needed immediately (layout, context providers)
import Header from './components/header';
import Footer from './components/footer';
import AdminHeader from './components/admin-header';
import CartProvider from './components/cart-context';
import ScrollToTop from './components/scroll-to-top';
import AuthProvider from './components/auth-context';
import ProtectedRoute from './components/protected-route';

// Lazy load all page components (code splitting)
const Home = lazy(() => import('./components/home'));
const Categories = lazy(() => import('./components/categories'));
const AboutMe = lazy(() => import('./components/about-me'));
const Contact = lazy(() => import('./components/contact'));
const FAQ = lazy(() => import('./components/faq'));
const Products = lazy(() => import('./components/products'));
const Login = lazy(() => import('./components/login'));
const Checkout = lazy(() => import('./components/checkout'));
const CheckoutStatus = lazy(() => import('./components/checkout-status'));

// Lazy load admin components (won't load unless user goes to admin pages)
const AdminPanel = lazy(() => import('./components/admin-panel'));
const AdminCategories = lazy(() => import('./components/admin-categories'));
const AdminProducts = lazy(() => import('./components/admin-products'));
const AdminProductsEdit = lazy(() => import('./components/admin-products-edit'));
const AdminCosts = lazy(() => import('./components/admin-costs'));
const AdminMainPage = lazy(() => import('./components/admin-main-page'));

// Loading spinner component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    marginTop: '120px'
  }}>
    <div style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #2a3b59',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminRoute && <Header />}  {/* Show regular header */}
      {isAdminRoute && <AdminHeader />}  {/* Show admin-specific header */}
      <div className="content-wrap">
        <Suspense fallback={<LoadingSpinner />}>
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
              path="/categories"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Categories />
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
              path="/admin-main-page"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminMainPage />
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
        </Suspense>
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
