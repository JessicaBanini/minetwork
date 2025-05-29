import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("GHS");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("0.00");
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromFlag, setFromFlag] = useState("");
  const [toFlag, setToFlag] = useState("");

  // Fetch Exchange Rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/d2d701c69f46320aa5541250/latest/USD"
        );
        if (!response.data.conversion_rates) {
          throw new Error("Failed to fetch exchange rates");
        }
        setExchangeRates(response.data.conversion_rates);
      } catch (err) {
        setError("Failed to load exchange rates. Check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // Convert Currency
  useEffect(() => {
    if (!amount || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      setConvertedAmount("0.00");
      return;
    }

    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const converted = (parseFloat(amount) * rate).toFixed(2);
    setConvertedAmount(converted);
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  // Get country code and flag from currency
  const getCountryCodeFromCurrency = async (currencyCode) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/currency/${currencyCode.toLowerCase()}`
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0].cca2.toLowerCase();
      } else {
        return "un";
      }
    } catch (error) {
      console.error("Error fetching country code:", error);
      return "un";
    }
  };

  // Update flag images when currency changes
  useEffect(() => {
    const updateFlags = async () => {
      const fromCode = await getCountryCodeFromCurrency(fromCurrency);
      const toCode = await getCountryCodeFromCurrency(toCurrency);
      setFromFlag(`https://flagcdn.com/${fromCode}.svg`);
      setToFlag(`https://flagcdn.com/${toCode}.svg`);
    };

    updateFlags();
  }, [fromCurrency, toCurrency]);

  return (
    <div className="min-h-screen bg-[#0a192f] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-green-500 mb-6">Currency Converter</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-400">Loading exchange rates...</p>
      ) : (
        <div className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* From Currency Dropdown */}
          <div className="flex items-center space-x-2">
            {fromFlag && (
              <img
                src={fromFlag}
                alt={`${fromCurrency} Flag`}
                className="w-8 h-6 rounded"
              />
            )}
            <select
            
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            >
              {Object.keys(exchangeRates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* To Currency Dropdown */}
          <div className="flex items-center space-x-2">
            {toFlag && (
              <img
                src={toFlag}
                alt={`${toCurrency} Flag`}
                className="w-8 h-6 rounded"
              />
            )}
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            >
              {Object.keys(exchangeRates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          />

          {/* Converted Amount */}
          <p className="text-gray-400">
            Converted Amount:{" "}
            <span className="text-green-500">
              {convertedAmount} {toCurrency}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
