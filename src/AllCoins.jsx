import React, { useState, useEffect } from 'react';
import { TextField, Typography, IconButton, CircularProgress, Modal } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsModal from "./NotificationsModal";
import SettingsSidebar from "./SettingsSidebar";
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

function AllCoins() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [ohlcData, setOhlcData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            page: 1,
            sparkline: true
          }
        });
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setError('Refresh after a minute');
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const handleCoinClick = async (coinId) => {
    setSelectedCoin(coinId);
    setChartLoading(true);
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/ohlc`, {
        params: { vs_currency: 'usd', days: 7 }
      });
      setOhlcData(response.data);
    } catch (error) {
      console.error('Error fetching OHLC data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#0a192f',
    border: '2px solid #16ec6f',
    boxShadow: 24,
    p: 4,
    width: '90%',
    maxWidth: 800
  };

  const candlestickOptions = {
    chart: { type: 'candlestick', toolbar: { show: false } },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
    colors: ['#16ec6f'],
    theme: { mode: 'dark' }
  };


  return (
    <div className="page_container flex flex-col items-center min-h-screen p-4 bg-[#0a192f] overflow-y-auto mb-10">
      {/* Header */}
      <div className="flex items-center w-full mt-7 mb-2 sticky top-0 z-10 bg-[#0a192f] ">
        <IconButton className="p-2">
          <SettingsIcon className="text-[#16ec6f]" onClick={() => setIsSettingsOpen(true)} />
        </IconButton>
        
        <h1 className="flex-grow text-center mx-2 text-[#16ec6f] font-bold text-lg sm:text-xl">
          Track Crypto
        </h1>

        <IconButton className="p-2">
          <NotificationsIcon className="text-[#16ec6f]" onClick={() => setIsNotificationOpen(true)} />
        </IconButton>
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
      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="  Search coins..."
        className="w-full mb-3 p-2 bg-[#112240] rounded-lg border-none placeholder-gray-400 sticky top-20 z-10 bg-[#0a192f] text-white focus:outline-none"
      />

      {/* Error Message */}
      {error && (
        <p className="text-red-400 mt-2">{error}</p>
      )}

      {/* Coin List */}
      {loading ? (
        <div className="flex items-center justify-center m-h-3/4">
          <CircularProgress className="text-[#16ec6f] " />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCoins.length === 0 ? (
            <p className="text-white mt-2"></p>
          ) : (
            filteredCoins.map((coin, index) => (
              <div 
                key={coin.id}
                className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2a3a55] py-4 px-1 cursor-pointer"
                onClick={() => handleCoinClick(coin.id)}
              >
                {/* Coin Info */}
                <div className="flex items-center w-full sm:w-1/2 mb-2 sm:mb-0">
                
                  <p className="text-gray-400 mr-2">{index + 1}</p>
                  
                  <img  
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-6 h-6 mr-2 ml-1.5" 
                  />

                  <div className='flex items-center justify-between gap-4 w-full'>
                  <div>
                    <p className="text-white w-4/4 ">{coin.name}</p>
                    <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
                  </div>
                  <div className=" mr-2 mt-2 sm:mt-0 sm:w-3/4 lg:w-1/2 ">
                  <ReactApexChart 
                    options={{
                      chart: { 
                        type: 'line',
                        sparkline: { enabled: true },
                        animations: { enabled: false },
                        tooltip: { enabled: false }
                      },
                      stroke: { 
                        curve: 'smooth',
                        width: 1 // Thinner sparkline
                      },
                      colors: ['#16ec6f'],
                      series: [{ data: coin.sparkline_in_7d?.price || [] }]
                    }}
                    series={[{ data: coin.sparkline_in_7d?.price || [] }]}
                    type="line"
                    height={35}
                    width={70}
                  />
                </div>


                  <div>
                    <div className="w-full sm:w-1/4 text-right">
                    <p className="text-white ">{formatNumber(coin.current_price)}</p>
                  </div>


                {/* 24h Change */}
                <div className="w-full sm:w-1/4 text-right">
                  <p 
                    className={`font-bold ${
                      coin.price_change_percentage_24h >= 0 
                        ? 'text-[#16ec6f]' 
                        : 'text-red-500'
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>


                </div>
                </div>
                </div>
                
                
              </div>
            ))
          )}
        </div>
      )}

      {/* Chart Modal */}
      <Modal
        open={!!selectedCoin}
        onClose={() => setSelectedCoin(null)}
      >
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-[#0a192f] border-2 border-[#16ec6f] p-4 rounded-lg 
                        max-w-2xl w-full">
          <h2 className="text-[#16ec6f] text-lg mb-4">
            {selectedCoin && coins.find(c => c.id === selectedCoin)?.name} Price Chart
          </h2>
          {chartLoading ? (
            <CircularProgress className="text-[#16ec6f] mt-5" />
          ) : (
            <ReactApexChart 
              options={candlestickOptions}
              series={[{ data: ohlcData.map(d => ({
                x: new Date(d[0]),
                y: [d[1], d[2], d[3], d[4]]
              })) }]}
              type="candlestick"
              height={230}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AllCoins;