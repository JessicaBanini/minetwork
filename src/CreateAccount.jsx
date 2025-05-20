import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import {AccountCircle, Phone, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const CreateAccount= ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    fullname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(''); // Error message state
  const [success, setSuccess] = useState(false); // Success message state
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Control Snackbar visibility
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!credentials.fullname.trim()) {
      setError('Please enter your full name.');
      setSnackbarOpen(true)
      return;
    }   

    if (!/^[a-zA-Z\s]*$/.test(credentials.fullname)) {
      setError('Name can only contain letters and spaces.');
      setSnackbarOpen(true)
      return;
    }

    if (!/^\d{10}$/.test(credentials.phone)) {
      setError('Phone number must contain exactly 10 digits.');
      setSnackbarOpen(true)
      return;
    }



    if (!credentials.email.trim() || !/\S+@\S+\.\S+/.test(credentials.email)) {
      setError('Please enter a valid email address.');
      setSnackbarOpen(true); // Open Snackbar for error
      return;
    }

    if (!credentials.password.trim() || credentials.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setSnackbarOpen(true); // Open Snackbar for error
      return;
    }



    // Simulate login logic
    console.log('Creating account with:', credentials);

    // Clear error and show success message
    setError('');
    setSuccess(true);
    setSnackbarOpen(true); // Open Snackbar for success
    setTimeout(() => {
      setSnackbarOpen(false); // Close Snackbar after redirect
      navigate('/seedphrase', { state: { email: credentials.email } });
    }, 1000); // Redirect after 3 seconds
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle between showing/hiding password
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close Snackbar when user clicks close
  };

  return (
    <Box
      className="page_container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        padding: '0rem 0.5rem 0rem 0.5rem',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
      }}
    >
      <Box className="flex items-center justify-center h-screen ">
        <CardContent className="flex flex-col gap-4 p-6">
          <h1 className='text-3xl font-bold' style={{ marginBottom: '1.5rem'}}>Sign Up</h1>

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <TextField
              label="Full name"
              type="text"
              variant="outlined"
              fullWidth
              required
              placeholder="John Doe"
              value={credentials.fullname}
              onChange={(e) => setCredentials({ ...credentials, fullname: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
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

            <TextField
              label="Phone number"
              type="tel"
              variant="outlined"
              fullWidth
              required
              placeholder="0564785963"
              value={credentials.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Allow only numbers
                setCredentials({ ...credentials, phone: value });
              }}
              inputProps={{
                maxLength: 10, // Limit to 10 digits
              }} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
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
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              placeholder="john@gmail.com"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
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


            {/* Password Field */}
            <TextField
              label="Password"
              placeholder="*******"
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              variant="outlined"
              fullWidth
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
          </form>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              textTransform: 'none',
              backgroundColor: '#16ec6fef',
              color: '#0A192F',
              fontWeight: 'bold',
              // height: '6.5vh',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: '#14d461',
              },
            }}
          >
            Sign Up
          </Button>

          {/* Sign Up Link */}
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: '#fff',
              textAlign: 'center',
              '& a': {
                color: '#16ec6f',
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </Typography>
        </CardContent>
      </Box>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Automatically hide after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position of the Snackbar
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? 'success' : 'error'}
          sx={{
            width: '100%',
            backgroundColor: success ? '#4caf50' : '#f44336', // Custom background color
            color: '#fff', // Custom text color
            '& .MuiAlert-icon': {
              color: '#fff', // Icon color
            },
          }}
        >
          {success ? 'Login successful!' : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateAccount;