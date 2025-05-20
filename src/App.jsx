import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './Loading';
import Login from './Login';
import CreateAccount from './CreateAccount';
import SeedPhrase from './SeedPhrase';
import AllCoins from './AllCoins'
import './App.css';

export default function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
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

          {/* CreateAccount Page */}
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

          {/* Seedphrase Page */}
          <Route
            path="/seedphrase"
            element={
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <SeedPhrase />
              </motion.div>
            }
          />

<Route
            path="/allcoins"
            element={
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AllCoins />
              </motion.div>
            }
          />



          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <motion.div
                key="not-found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1>Page Not Found</h1>
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}