import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton,InputAdornment } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings'; // Settings icon
import NotificationsIcon from '@mui/icons-material/Notifications'; // Notifications bell icon

function AllCoins() {
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Handler for search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term
    console.log('Filtered by:', event.target.value); // Log filtered value
  };

  return (
    <>
      <Box
        className="page_container"

        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '1rem',
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: '100%',
            mt: 7,
            mb: 2, // Margin bottom
          }}
        >
          {/* Settings Icon */}
          <IconButton aria-label="settings">
            <SettingsIcon />
          </IconButton>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              // color: 'red', // Red text color
              fontWeight: '', // Bold text
              textAlign: 'center',
              flexGrow: 1, // Take up remaining space
              mx: 2, // Horizontal margin
            }}
          >
            Track Coins
          </Typography>

          {/* Notifications Bell */}
          <IconButton aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
            color: 'white',
            
            // Limit width of the search bar
            mb: 1, // Margin bottom
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={searchTerm}
            
            onChange={handleSearchChange}
            placeholder="Search coins..."

            sx={{
              
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#112240',
                color: '#FFFFFF',
                border: '0.01px solid rgba(22, 236, 111, 0.23)',
                borderRadius: '8px',
              },
              '& .MuiInputLabel-root': {
                color: '#16ec6f',
                fontWeight: 'bold',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '& input:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px #112240 inset', // Background color
                WebkitTextFillColor: '#FFFFFF', // Text color
                transition: 'background-color 5000s ease-in-out 0s', // Prevent animation
              },
            }}
          />
        </Box>

        <p className=' align-left w-full'>
          ALL COINS
        </p>

        <div >
          <div className='w-screen flex justify-between border-1 border-gray-900  border-b-gray-600  p-5'>
          <p>1</p>

          <div>
            <div className='flex flex-col'>
            <div> <img/> Bitcon </div>
            <p className=' text-gray-500'>BTC</p>
            </div> 
          </div>
         
          <div className='w-2/6 border-1 border-gray-600 '></div>



          <div>
            <div className='flex flex-col text-right '>
            <div> $23,206.52 </div>
            <p className=' text-red-700'>-9.5%</p>
            </div> 
          </div>



          </div>
          

        </div>

        
        
      </Box>
    </>
  );
}

export default AllCoins;