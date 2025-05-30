import React, { useEffect, useState } from "react";
import { TextField, CircularProgress, Modal, Skeleton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close'; // For closing the modal
import NotificationsModal from "./NotificationsModal";
import SettingsSidebar from "./SettingsSidebar";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import ChartModalSkeleton from "./ChartModalSkeleton"; // Adjust path as needed


const StockApp = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [ohlcData, setOhlcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

  const API_KEY = "4ScdiYYeARDkAKCdk2vzV0Nq49POkXm5"; // Replace with your FMP API key

  useEffect(() => {
    let retryTimeout;

    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/actives?apikey=${API_KEY}`
        );

        const formattedData = response.data.map(stock => ({
          id: stock.ticker,
          symbol: stock.ticker,
          name: stock.companyName,
          current_price: stock.price,
          price_change_24h: stock.changes,
          price_change_percentage_24h: parseFloat(stock.changesPercentage?.replace('%', '')) || 0,
          market_cap: stock.marketCap,
          sparkline_in_7d: {
            price: Array.from({ length: 20 }, () => Math.random() * 100)
          }
        }));

        setStockData(formattedData);
        setFilteredStocks(formattedData);
        setLoading(false);

      } catch (error) {
        if (error.response && error.response.status === 429) {
          // API Rate Limit Exceeded
          setError({
            type: 'quota',
            message: 'Too many requests. Please refresh or try again later.',
          });

          // Retry after 30 seconds
          retryTimeout = setTimeout(fetchStockData, 30000);

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
            message: 'Failed to load data. Please refresh or try again later.',
          });
        }

        setLoading(false);
      }
    };

    fetchStockData();

    return () => clearTimeout(retryTimeout); // Cleanup timeout on unmount
  }, [API_KEY]);

  useEffect(() => {
    setFilteredStocks(
      stockData.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, stockData]);

  const handleStockClick = async (symbol) => {
    setSelectedStock(symbol);
    setChartLoading(true);
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${API_KEY}`
      );

      const ohlc = response.data.historical
        .slice(0, 30)
        .reverse()
        .map(day => ({
          x: new Date(day.date).getTime(),
          y: [day.open, day.high, day.low, day.close]
        }));

      setOhlcData(ohlc);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setError({
        type: 'general',
        message: 'Failed to load chart data. Please try again later.',
      });
    } finally {
      setChartLoading(false);
    }
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const candlestickOptions = {
    chart: { 
      type: 'candlestick', 
      toolbar: { show: false },
      background: '#0a192f' // Dark theme background 
    },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
    colors: ['#16ec6f'],    
    theme: { mode: 'dark' }
  };

  const StockSkeleton = () => (
    <div className="flex sm:flex-row justify-between gap-4 items-center border-b border-[#2a3a55] py-2 px-1">
      <div className="flex items-center w-full ">
        <Skeleton variant="text" width={20} height={20} className="mr-2" sx={{bgcolor: 'rgba(255,255,255,0.1)' }}/>
        <div>
          <Skeleton variant="text" width={100} height={20} sx={{bgcolor: 'rgba(255,255,255,0.1)' }}/>
          <Skeleton variant="text" width={60} height={16} sx={{bgcolor: 'rgba(255,255,255,0.1)' }}/>
        </div>
      </div>
      <div className="w-full ml-6 mt-2 sm:mt-0">
        <Skeleton variant="rectangular" width={70} height={35} sx={{bgcolor: 'rgba(255,255,255,0.1)' }}/>
      </div>
      {/* <div className="w-full  text-center sm:text-right mb-2 sm:mb-0">
        <Skeleton variant="text" width={60} height={20} />
      </div> */}
      <div className="w-full  text-center sm:text-right">
        <Skeleton variant="text" width={40} height={20} sx={{bgcolor: 'rgba(255,255,255,0.1)' }}/>
      </div>
    </div>
  );

  return (
    <div className="page_container flex flex-col items-center min-h-screen p-4 bg-[#0a192f] mb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a192f] w-full flex items-center justify-between  py-4 ">
        <SettingsIcon className="text-[#16ec6f] cursor-pointer" onClick={() => setIsSettingsOpen(true)} />
        <h1 className=" text-[#16ec6f] font-bold text-lg sm:text-xl">Track Stocks</h1>
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

      {/* Search Bar */}
      <div className="sticky top-[56px] z-10 w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="  Search stocks..."
        className="w-full mb-3 p-2 bg-[#112240] rounded-lg border-none placeholder-gray-400 text-white focus:outline-nonemt-3  "
      />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center items-center min-h-[60vh] w-full">
          <p className={`text-center text-lg sm:text-xl px-4 ${
            error.type === 'quota' ? 'text-yellow-400' :
            error.type === 'network' ? 'text-red-400' : 'text-red-500'
          }`}>
            {error.message}
          </p>
        </div>
      )}


      {/* Stock List */}
      <div className="w-full space-y-4 mt-4">
        {loading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <StockSkeleton key={index} />
            ))}
          </>
        ) : (
          filteredStocks.map((stock, index) => (
            <div
              key={stock.id}
              className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2a3a55] py-2 px-1 cursor-pointer"
              onClick={() => handleStockClick(stock.symbol)}
            >
              {/* Stock Info */}
              <div className='flex items-center justify-between w-full'>
                <div className="flex items-center w-full sm:w-1/2 mb-2 sm:mb-0">
                  <p className="text-gray-400 mr-2">{index + 1}</p>
                  <div>
                    <p className="text-white">{stock.name}</p>
                    <p className="text-gray-400">{stock.symbol}</p>
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
                        width: 1
                      },
                      colors: ['#16ec6f'],
                      series: [{ data: stock.sparkline_in_7d?.price || [] }]
                    }}
                    series={[{ data: stock.sparkline_in_7d?.price || [] }]}
                    type="line"
                    height={35}
                    width={70}
                  />
                </div>

                {/* Price */}
                <div>
                  <div className="w-full sm:w-1/4 text-center sm:text-right mb-2 sm:mb-0">
                    <p className="text-white">{formatNumber(stock.current_price)}</p>
                  </div>

                  {/* 24h Change */}
                  <div className="w-full sm:w-1/4 text-center sm:text-right">
                    <p
                      className={`font-bold ${
                        stock.price_change_percentage_24h >= 0
                          ? 'text-[#16ec6f]'
                          : 'text-red-500'
                      }`}
                    >
                      {stock.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chart Modal */}
      <Modal
        open={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      >
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-[#0a192f] border-2 border-[#16ec6f] p-4 rounded-lg 
                        max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#16ec6f] text-lg">{selectedStock} Price Chart</h2>
            <CloseIcon 
              className="text-[#16ec6f] cursor-pointer" 
              onClick={() => setSelectedStock(null)} 
            />
          </div>
          {chartLoading ? (
        <ChartModalSkeleton />
      ) : (
        <ReactApexChart
          options={candlestickOptions}
          series={[{ data: ohlcData }]}
          type="candlestick"
          height={300}
        />
      )}
        </div>
      </Modal>
    </div>
  );
};

export default StockApp;