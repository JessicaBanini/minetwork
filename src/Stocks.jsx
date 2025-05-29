import React, { useEffect, useState } from "react";
import { TextField, CircularProgress, Modal } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const StockApp = () => {
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
    const fetchStockData = async () => {
      try {
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

        //   price_change_percentage_24h: stock.changesPercentage,
          market_cap: stock.marketCap,
          sparkline_in_7d: {
            price: Array.from({ length: 20 }, () => Math.random() * 100)
          }
          
        }));

        setStockData(formattedData);
        setFilteredStocks(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to load stock data");
        setLoading(false);
      }
    };

    fetchStockData();
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
      setError("Failed to load chart data");
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
    chart: { type: 'candlestick', toolbar: { show: false } },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
    colors: ['#16ec6f'],
    theme: { mode: 'dark' }
  };

  return (
    <div className="page_container flex flex-col items-center min-h-screen p-4 bg-[#0a192f] overflow-y-auto mb-10">
      {/* Header */}
      <div className="flex items-center w-full mt-7 mb-2 sticky top-0 z-10 bg-[#0a192f]">
        <SettingsIcon className="text-[#16ec6f] cursor-pointer" />
        <h1 className="flex-grow text-center mx-2 text-[#16ec6f] font-bold text-lg sm:text-xl">
          Track Stocks
        </h1>
        <NotificationsIcon className="text-[#16ec6f] cursor-pointer" />
      </div>

      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="  Search stocks..."
        className="w-full mb-3 p-2 bg-[#112240] rounded-lg border-none placeholder-gray-400 text-white focus:outline-none mt-3"
      />

      {/* Error Message */}
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}

      {/* Stock List */}
      {loading ? (
        <CircularProgress className="text-[#16ec6f]" />
      ) : (
        <div className="w-full space-y-4">
          {filteredStocks.map((stock, index) => (
            <div 
              key={stock.id}
              className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2a3a55] py-2 px-1 cursor-pointer"
              onClick={() => handleStockClick(stock.symbol)}
            >
              {/* Stock Info */}
              <div className='flex items-center justify-between w-full'>

              <div className="flex items-center w-full sm:w-1/2 mb-2 sm:mb-0">
                <p className="text-gray-400 mr-2">{index + 1}</p>
                <div >
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
                      animations: { enabled: false }
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
          ))}
        </div>
      )}

      {/* Chart Modal */}
      <Modal
        open={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      >
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-[#0a192f] border-2 border-[#16ec6f] p-4 rounded-lg 
                        max-w-2xl w-full">
          <h2 className="text-[#16ec6f] text-lg mb-4">
            {selectedStock} Price Chart
          </h2>
          {chartLoading ? (
            <CircularProgress className="text-[#16ec6f] mt-5" />
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