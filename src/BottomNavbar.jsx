// BottomNavbar.jsx
import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
// Import React Icons
import { FaBitcoin } from "react-icons/fa"; // Crypto icon
import { FaDollarSign } from "react-icons/fa"; // Forex icon
import { FaChartLine } from "react-icons/fa"; // Stocks icon
import { FaExchangeAlt } from "react-icons/fa"; // Converter icon

const BottomNavbar = ({ onNavigationChange }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onNavigationChange) {
      onNavigationChange(newValue); // Notify parent component of navigation change
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        marginTop:'8rem',
        backgroundColor: "", // White background
        borderTop: "0.1rem solid gray", // Border for separation
      }}
      showLabels
    >
      {/* Crypto */}
      <BottomNavigationAction
        label="Crypto"
        icon={<FaBitcoin size={20} />} // Use React Icon
        sx={{
            color: "#112240",
            "&.Mui-selected": {
              color: "#23359",
            },
            "& .MuiBottomNavigationAction-label": {
                fontSize:'0.7rem',
              color: "#23359", // Default label color
              "&.Mui-selected": {
                color: "#23359", // Selected label color
              },
            },
          }}
      />

      {/* Forex */}
      <BottomNavigationAction
        label="Forex"
        icon={<FaDollarSign size={20} />} // Use React Icon
        sx={{
            color: "#112240",
            "&.Mui-selected": {
              color: "#23359",
            },
            "& .MuiBottomNavigationAction-label": {
                fontSize:'0.7rem',
              color: "#23359", // Default label color
              "&.Mui-selected": {
                color: "#23359", // Selected label color
              },
            },
          }}
      />

      {/* Stocks */}
      <BottomNavigationAction
        label="Stocks"
        icon={<FaChartLine size={20} />} // Use React Icon
        sx={{
            color: "#112240",
            "&.Mui-selected": {
              color: "#23359",
            },
            "& .MuiBottomNavigationAction-label": {
                fontSize:'0.7rem',
              color: "#23359", // Default label color
              "&.Mui-selected": {
                color: "#23359", // Selected label color
              },
            },
          }}
      />

      {/* Converter */}
      <BottomNavigationAction
        label="Converter"
        icon={<FaExchangeAlt size={20} />} // Use React Icon
        sx={{
            color: "#112240",
            "&.Mui-selected": {
              color: "#23359",
            },
            "& .MuiBottomNavigationAction-label": {
                fontSize:'0.7rem',
              color: "#23359", // Default label color
              "&.Mui-selected": {
                color: "#23359", // Selected label color
              },
            },
          }}
      />
    </BottomNavigation>
  );
};

export default BottomNavbar;