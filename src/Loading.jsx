import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Loading() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Starting fade-out timer...');
    const timer = setTimeout(() => setIsFadingOut(true), 3000); // Start fade-out after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isFadingOut) {
      console.log('Fade-out complete. Navigating to /login...');
      const fadeOutTimer = setTimeout(() => {
        navigate('/login'); // Navigate to the login page
      }, 1000); // Match this duration with the fade-out animation duration
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isFadingOut, navigate]);

  return (
    <>
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1 }}
    //   style={{
    //     display: 'flex',
    //     flexDirection: 'column',
    //     height: '100vh',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}
    >
    </motion.div>
    <div className="page_container" 
             style={{ display: 'flex', 
                      flexDirection: 'column',
                      height: '100vh' 
                    }}>
            <div className="logo" 
                 style={{ flex: 1, 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}>
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="text-6xl font-bold mb-4"
                >
                    Mi<span className="text-purple">Net</span>
                </motion.div>
            </div>


    

    
    </div>
    </>
  );
}