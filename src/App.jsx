import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading';
import Login from './Login';
import CreateAccount from './CreateAccount';
import SeedPhrase from './SeedPhrase';
import AllCoins from './AllCoins';
import Forex from './Forex';
import Stocks from './Stocks';
import Converter from './Converter'; // Import the Converter component
import BottomNavbar from './BottomNavbar'; // Import the Bottom Navbar component
import './App.css';

const AppContent = () => {
  const location = useLocation(); // Get the current route
  const [activeTab, setActiveTab] = useState(0); // State to track active tab in Bottom Navbar

  // Define routes where the Bottom Navbar should NOT be displayed
  const hideNavbarRoutes = ['/', '/login', '/create-account', '/seedphrase'];

  // Check if the current route is in the list of routes where the navbar should be hidden
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {/* AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Loading Page */}
          <Route
            path="/"
            element={
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Loading />
              </motion.div>
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Login />
              </motion.div>
            }
          />

          {/* Create Account Page */}
          <Route
            path="/create-account"
            element={
              <motion.div
                key="create-account"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CreateAccount />
              </motion.div>
            }
          />

          {/* Seed Phrase Page */}
          <Route
            path="/seedphrase"
            element={
              <motion.div
                key="seedphrase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <SeedPhrase />
              </motion.div>
            }
          />

          {/* Crypto Page */}
          <Route
            path="/crypto"
            element={
              <motion.div
                key="crypto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AllCoins />
              </motion.div>
            }
          />

          {/* Forex Page */}
          <Route
            path="/forex"
            element={
              <motion.div
                key="forex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Forex />
              </motion.div>
            }
          />

          {/* Stocks Page */}
          <Route
            path="/stocks"
            element={
              <motion.div
                key="stocks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Stocks />
              </motion.div>
            }
          />

          {/* Converter Page */}
          <Route
            path="/converter"
            element={
              <motion.div
                key="converter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Converter />
              </motion.div>
            }
          />

          {/* Fallback Route - Redirect to Login */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </AnimatePresence>

      {/* Conditionally Render Bottom Navbar */}
      {shouldShowNavbar && (
        <BottomNavbar
          activeTab={activeTab}
          onNavigationChange={(newValue) => {
            setActiveTab(newValue);
            // Navigate to the corresponding route based on the selected tab
            switch (newValue) {
              case 0:
                window.location.href = '#/crypto';
                break;
              case 1:
                window.location.href = '#/forex';
                break;
              case 2:
                window.location.href = '#/stocks';
                break;
              case 3:
                window.location.href = '#/converter';
                break;
              default:
                break;
            }
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}