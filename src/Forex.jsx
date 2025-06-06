import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Modal, Skeleton, Snackbar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsModal from "./NotificationsModal";
import SettingsSidebar from "./SettingsSidebar";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const Forex = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [forexData, setForexData] = useState([]);
  const [filteredPairs, setFilteredPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // FastForex API Configuration
  const FASTFOREX_API_KEY = 'df73735f93-c04b9a7d5d-swzncp'; // Replace with your FastForex API key
  const BASE_URL = 'https://api.fastforex.io'; 
  const BASES = {
    GHS: ["USD", "NGN", "EUR", "GBP", "ZAR"],
    NGN: ["USD", "GHS", "EUR", "GBP", "XAF"],
    USD: ["EUR", "GBP", "GHS", "CAD", "AUD"],
    EUR: ["USD", "GBP", "GHS", "JPY", "NGN"],
    GBP: ["USD", "EUR", "CAD", "AUD", "GHS"],
  };

  useEffect(() => {
    let retryTimeout;

    const fetchForexData = async () => {
      setLoading(true);
      setError(null);

      try {
        const allData = [];
        for (const [base, quotes] of Object.entries(BASES)) {
          const res = await axios.get(`${BASE_URL}/fetch-all`, {
            params: {
              from: base,
              api_key: FASTFOREX_API_KEY,
            },
          });

          const rates = res.data.results;
          if (!rates) {
            console.warn(`Skipping ${base} due to API issue`);
            continue;
          }

          quotes.forEach((quote) => {
            const rate = rates[quote];
            if (!rate) return;

            const priceChange = (Math.random() * 0.02 - 0.01).toFixed(4); // simulate change
            const volatility = (Math.random() * 2 - 1).toFixed(2);

            allData.push({
              id: `${base}${quote}`,
              symbol: `${base}/${quote}`,
              name: `${base}/${quote}`,
              current_price: rate,
              price_change_24h: priceChange,
              price_change_percentage_24h: volatility,
              volume_24h: (Math.random() * 1e9).toFixed(0),
              sparkline_in_7d: {
                price: Array.from({ length: 20 }, () =>
                  (rate + Math.random() * 0.02 - 0.01).toFixed(4)
                ),
              },
            });
          });
        }

        setForexData(allData);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // API Rate Limit Exceeded
          setError({
            type: 'quota',
            message: 'Too many requests. Please refresh or try again later',
          });

          // Retry after 30 seconds
          retryTimeout = setTimeout(fetchForexData, 30000);

        } else if (!navigator.onLine) {
          // No Internet Connection
          setError({
            type: 'network',
            message: 'You are disconnected. Please check your internet connection.',
          });

        } else {
          // General Error
          setError({
            type: 'general',
            message: 'Too many requests. Please refresh or try again later.',
          });
        }

        setLoading(false);
      }
    };

    fetchForexData();

    return () => clearTimeout(retryTimeout); // Cleanup timeout on unmount
  }, []);

  useEffect(() => {
    setFilteredPairs(
      forexData.filter(currency =>
        currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, forexData]);

  const handlePairClick = () => {
    // Show Snackbar when user clicks on a pair
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const PairSkeleton = () => (
    <div className=" w-full flex justify-between gap-4 items-center  border-b border-[#2a3a55] py-8 px-1">
      <div className="flex items-center w-full ">
        <Skeleton variant="text" width={20} height={20} className="mr-2" sx={{bgcolor: 'rgba(255,255,255,0.1)' }}/>
        <div>
          <Skeleton variant="text" width={70} height={20} sx={{bgcolor: 'rgba(255,255,255,0.08)' }} />
          {/* <Skeleton variant="text" width={60} height={16} sx={{bgcolor: 'rgba(255,255,255,0.1)' }}/> */}
        </div>
      </div>
      <div className="w-full  mt-2 ">
        <Skeleton variant="rectangular" width={50} height={35} sx={{bgcolor: 'rgba(255,255,255,0.08)' }} />
      </div>
      <div className="w-full text-right">
        <Skeleton variant="text" width={60} height={30} sx={{bgcolor: 'rgba(255,255,255,0.08)' }} />
      </div>
      <div className="w-full text-right">
        <Skeleton variant="text" width={40} height={30} sx={{bgcolor: 'rgba(255,255,255,0.08)' }}/>
      </div>
    </div>
  );

  return (
    <div className="page_container flex flex-col items-center min-h-screen p-4 bg-[#0a192f] mb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a192f] w-full flex items-center justify-between  py-4 ">
        <SettingsIcon className="text-[#16ec6f] cursor-pointer" onClick={() => setIsSettingsOpen(true)} />
        <h1 className="flex-grow text-center mx-2 text-[#16ec6f] font-bold text-lg sm:text-xl">
          Track Forex
        </h1>
        <NotificationsIcon className="text-[#16ec6f] cursor-pointer" onClick={() => setIsNotificationOpen(true)} />
      </div>

      <NotificationsModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Top Movers */}
      <div className="sticky top-[56px] z-10 w-full bg-[#0a192f]">
      {!loading && (
        <div className="w-full mt-4 mb-4">
          <h2 className="text-[#fff] text-lg font-bold mb-2">Top 5 Movers</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-thin">
            {forexData
              .slice()
              .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
              .slice(0, 5)
              .map((pair, index) => (
                <div
                  key={index}
                  onClick={handlePairClick} // Show Snackbar on click
                  className="min-w-[110px] p-3 bg-[#112240] rounded-lg cursor-pointer hover:scale-105 transition-transform"
                >
                  <p className="text-white text-sm">{pair.symbol}</p>
                  <p
                    className={`font-bold text-base ${
                      parseFloat(pair.price_change_percentage_24h) >= 0
                        ? 'text-[#16ec6f]'
                        : 'text-red-500'
                    }`}
                  >
                    {parseFloat(pair.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
      </div>

      {/* Search Bar */}
      <div className="sticky top-[60px] z-10 w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="  Search currency pairs..."
        className="w-full mb-3 p-2 bg-[#112240] rounded-lg border-none placeholder-gray-400 text-white focus:outline-none"
      />
      </div>

      {/* Error Message */}
      {error && (
        <p className={`text-${error.type === 'quota' ? 'yellow-400' : 'red-400'} mt-2`}>
          {error.message}
        </p>
      )}

      {/* Forex List */}
      {loading ? (
        <>
          {[...Array(5)].map((_, index) => (
            <PairSkeleton key={index} />
          ))}
        </>
      ) : (
        <div className="w-full space-y-4">
          {filteredPairs.map((pair, index) => (
            <div
              key={pair.id}
              className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2a3a55] py-4 cursor-pointer"
              onClick={handlePairClick} // Show Snackbar on click
            >
              {/* Pair Info */}
              <div className='flex items-center justify-between w-full'>
                <div className="flex items-center w-full sm:w-1/2 mb-2 sm:mb-0">
                  <p className="text-gray-400 mr-2">{index + 1}</p>
                  <div>
                    <p className="text-white">{pair.symbol}</p>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="w-full ml-6 mt-2 sm:mt-0">
                  <ReactApexChart
                    options={{
                      chart: {
                        type: 'line',
                        sparkline: { enabled: true },
                        animations: { enabled: false },
                      },
                      tooltip: {
                        enabled: false,
                      },
                      stroke: {
                        curve: 'smooth',
                        width: 1,
                      },
                      colors: ['#16ec6f'],
                      series: [{ data: pair.sparkline_in_7d.price }],
                    }}
                    series={[{ data: pair.sparkline_in_7d.price }]}
                    type="line"
                    height={35}
                    width={55}
                  />
                </div>

                {/* Price */}
                <div className="w-full sm:w-1/4 text-center sm:text-right mb-2 sm:mb-0">
                  <p className="text-white">{formatNumber(pair.current_price)}</p>
                </div>

                {/* 24h Change Percent */}
                <div className="w-full sm:w-1/4 text-center sm:text-right">
                  <p
                    className={`font-bold ${
                      parseFloat(pair.price_change_percentage_24h) >= 0
                        ? 'text-[#16ec6f]'
                        : 'text-red-500'
                    }`}
                  >
                    {parseFloat(pair.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="No chart available for this currency pair."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            backgroundColor: '#112240',
            color: '#ffffff',
          },
        }}
      />
    </div>
  );
};

export default Forex;