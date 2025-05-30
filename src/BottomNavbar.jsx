import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
// Import React Icons
import { FaBitcoin } from "react-icons/fa"; // Crypto icon
import { FaDollarSign } from "react-icons/fa"; // Forex icon
import { FaChartLine } from "react-icons/fa"; // Stocks icon
import { FaExchangeAlt } from "react-icons/fa"; // Converter icon

const BottomNavbar = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Navigate to the corresponding route based on the selected tab
    switch (newValue) {
      case 0:
        navigate("/crypto"); // Navigate to Crypto page
        break;
      case 1:
        navigate("/forex"); // Navigate to Forex page
        break;
      case 2:
        navigate("/stocks"); // Navigate to Stocks page
        break;
      case 3:
        navigate("/converter"); // Navigate to Converter page
        break;
      default:
        break;
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
        backgroundColor: "#ffffff", // White background
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
            fontSize: "0.7rem",
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
            fontSize: "0.7rem",
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
            fontSize: "0.7rem",
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
            fontSize: "0.7rem",
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