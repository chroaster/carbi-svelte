'use strict';

class Spot {
  constructor(currency = 'KRW', baseCurrency = 'USD') {
    this.currency = currency;
    this.baseCurrency = baseCurrency;
    this.url = `https://spot.coolbeans.fyi/${baseCurrency}/${currency}`;
  }

  rate = async () => {
    try {
      let response = await fetch(this.url);
      let data = await response.json();
      return data.rate;
    } catch (err) {
      console.error(`${new Date().toLocaleTimeString()} ERROR in Spot.js...`);
      console.error(`${err}`);
    }
  };
}

exports.Spot = Spot;