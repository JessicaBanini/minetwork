// Forex.jsx
import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Modal } from '@mui/material';
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
  const [selectedPair, setSelectedPair] = useState(null);
  const [ohlcData, setOhlcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

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
    const fetchForexData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allData = [];
        // Loop over each base and its desired quote pairs
        for (const [base, quotes] of Object.entries(BASES)) {
          const res = await axios.get(`${BASE_URL}/fetch-all`, {
            params: {
              from: base,
              api_key: FASTFOREX_API_KEY
            }
          });
          const rates = res.data.results;
          if (!rates) {
            console.warn(`Skipping ${base} due to API issue`);
            continue;
          }
          quotes.forEach((quote) => {
            const rate = rates[quote];
            if (!rate) return; // skip if quote not found
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
                )
              }
            });
          });
        }
        setForexData(allData);
      } catch (error) {
        console.error("Error fetching forex data:", error);
        setError(error.message || "Failed to load forex data");
      } finally {
        setLoading(false);
      }
    };
    fetchForexData();
  }, []);

  useEffect(() => {
    setFilteredPairs(
      forexData.filter(currency =>
        currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, forexData]);

  const handlePairClick = async (pair) => {
    setSelectedPair(pair);
    setChartLoading(true);
    try {
      const [base, quote] = pair.split('/');
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      const response = await axios.get(`${BASE_URL}/historical`, {
        params: {
          date_from: startDate.toISOString().split('T')[0],
          date_to: endDate.toISOString().split('T')[0],
          from: base,
          to: quote,
          api_key: FASTFOREX_API_KEY
        }
      });
      const ohlc = Object.entries(response.data.results).map(([date, rates]) => ({
        x: new Date(date).getTime(),
        y: [
          rates[quote],
          rates[quote],
          rates[quote],
          rates[quote]
        ]
      }));
      setOhlcData(ohlc);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      // setError("Failed to load chart data");
    } finally {
      setChartLoading(false);
    }
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };

  // const candlestickOptions = {
  //   chart: { type: 'candlestick', toolbar: { show: false } },
  //   xaxis: { type: 'datetime' },
  //   yaxis: { tooltip: { enabled: true } },
  //   colors: ['#16ec6f'],
  //   theme: { mode: 'dark' }
  // };

  return (
    <div className="page_container flex flex-col items-center min-h-screen p-4 bg-[#0a192f] overflow-y-auto mb-10">
      {/* Header */}
      <div className="flex items-center w-full mt-7 mb-2 sticky top-0 z-10 bg-[#0a192f]">
        <SettingsIcon className="text-[#16ec6f] cursor-pointer" onClick={() => setIsSettingsOpen(true)} />
        <h1 className="flex-grow text-center mx-2 text-[#16ec6f] font-bold text-lg sm:text-xl">
          Track Forex
        </h1>
        <NotificationsIcon className="text-[#16ec6f] cursor-pointer" onClick={() => setIsNotificationOpen(true)}/>
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
                  onClick={() => handlePairClick(pair.symbol)}
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

      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="  Search currency pairs..."
        className="w-full mb-3 p-2 bg-[#112240] rounded-lg border-none placeholder-gray-400 text-white focus:outline-none"
      />

      {/* Error Message */}
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}

      {/* Forex List */}
      {loading ? (
        <CircularProgress className="text-[#16ec6f]" />
      ) : (
        <div className="w-full space-y-4">
          {/* <div className='flex items-center mt-2 mb-0.5 text-center justify-around w-full pl-5 text-gray-500 text-sm'>
              <p>Pair</p>
              <p>Chart</p>
              <p>Price</p>
              <p>Change</p>
              </div> */}
          {filteredPairs.map((pair, index) => (
            <div 
              key={pair.id}
              className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2a3a55] py-4 cursor-pointer"
              onClick={() => handlePairClick(pair.symbol)}
            >
              
              {/* Pair Info */}
              <div className='flex items-center justify-between w-full'>
              
              <div className="flex items-center w-full sm:w-1/2 mb-2 sm:mb-0">
              
                <p className="text-gray-400 mr-2">{index + 1}</p>
                
                <div>
                  <p className="text-white">{pair.symbol}</p>
                  {/* <p className="text-gray-400">{pair.name}</p> */}
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
                    series: [{ data: pair.sparkline_in_7d.price }]
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


              {/* 24h Change */}
              {/* <div className="w-full sm:w-1/4 text-center sm:text-right mb-2 sm:mb-0">
                <p className="text-white">{formatNumber(pair.price_change_24h)}</p>
              </div> */}
              {/* 24h Change Percent */}
              <div className="w-full sm:w-1/4 text-center sm:text-right">
                <p 
                  className={`font-bold  ${
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

      {/* Chart Modal
      <Modal
        open={!!selectedPair}
        onClose={() => setSelectedPair(null)}
      >
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-[#0a192f] border-2 border-[#16ec6f] p-4 rounded-lg 
                      max-w-2xl w-full">
          <h2 className="text-[#16ec6f] text-lg mb-4">
            {selectedPair} Price Chart
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
      </Modal> */}
    </div>
  );
};

export default Forex;