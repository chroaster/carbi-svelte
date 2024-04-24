'use strict';
const supportedCountries = ['KOR', 'USA'];

class CryptoExchange {
  constructor(country = 'USA', rate) {
    if (!supportedCountries.includes(country)) {
      throw new Error(`${country} is not supported.`);
    }
    this.country = country;
    this.rate = rate;
  }

  ticker = (currency, baseCurrency) => {
    if (this.country === 'KOR') {
      return this.tickerBithumb(currency, 'KRW');
    } else if (this.country === 'USA') {
      switch (currency) {
        case 'CRO':
          return this.tickerCrypto(currency, 'USDT');
      }
    } else {
      throw new Error('Must specify country.');
    }
  };

  tickerBithumb = async (currency, baseCurrency = 'KRW') => {
    // Docs: https://apidocs.bithumb.com/
    try {
      const url =
        `https://api.bithumb.com/public/ticker/${currency}`;
      const response = await fetch(`${url}`, { cache: 'no-cache', });
      if (response.ok) {
        const bithumbResponse = await response.json();

        if (bithumbResponse.status === "0000") {
          const data = bithumbResponse.data;
          // received normal response from bithumb
          return {
            price: Number.parseFloat(data.closing_price) / this.rate,
            volume: Number.parseFloat(data.acc_trade_value_24H),
            change: Number.parseFloat(data.fluctate_rate_24H),
            time: new Date(Number.parseFloat(data.date)),
          };
        } else {
          // received error response from bithumb
          throw new Error(bithumbResponse.status);
        }
      } else {
        // fetch failed
        throw new Error(response.status);
      }
    } catch (err) {
      console.error(`Bithumb retrieval error: ${err.message}`);
      return { available: false };
    }
  }

  tickerCoinbase = async (currency, baseCurrency = 'USD') => {
    // Docs: https://docs.pro.coinbase.com/#get-24hr-stats
    try {
      const url =
        `https://api.pro.coinbase.com/products/${currency}-${baseCurrency}/stats`;
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        const data = await response.json();
        const currentPrice = Number.parseFloat(data.last);
        const openPrice = Number.parseFloat(data.open);
        const changeSinceOpen = 100 * ((currentPrice - openPrice) / openPrice);
        return {
          price: currentPrice,
          volume: Number.parseFloat(data.volume),
          change: changeSinceOpen,
          time: new Date(),
        };
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      console.error(`Coinbase retrieval error: ${err.message}`);
      return { available: false };
    }
  }

  // Currently fails with CORS error
  tickerCrypto = async (currency, baseCurrency) => {
    // Docs: https://exchange-docs.crypto.com/spot/index.html#public-get-ticker

    // return { available: false };

    try {
      const url =
        `https://api.crypto.com/v2/public/get-ticker?instrument_name=${currency}_${baseCurrency}`;
      const response = await fetch(`${url}`, { cache: 'no-cache' });
      if (response.ok) {
        const data = (await response.json()).result.data;
        const currentPrice = Number.parseFloat(data.a);
        const openPrice = currentPrice - Number.parseFloat(data.c);
        const changeSinceOpen = 100 * ((currentPrice - openPrice) / openPrice);
        return {
          price: currentPrice,
          volume: Number.parseFloat(data.v),
          change: changeSinceOpen,
          time: new Date(Number.parseFloat(data.t)),
        };
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      console.error(`Crypto.com retrieval error: ${err.message}`);
      return { available: false };
    }
  }
}

exports.CryptoExchange = CryptoExchange;
