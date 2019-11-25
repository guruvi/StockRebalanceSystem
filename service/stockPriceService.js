var rp = require('request-promise');
const constants = require("../config/constants");

const getStockValue = async (symbol, date) => {
  const url = createUrl(symbol);
  const response = await rp(url);
  return response["Time Series (Daily)"][date]["4. close"];
}

const createUrl = symbol => {
  const valueUrl = constants.VALUE_URL;
  const apikey = constants.API_KEY;
  const priceFunction = constants.PRICE_FUNCTION;

  var options = {
    uri: `${valueUrl}`,
    qs: {
      apikey,
      function: priceFunction,
      symbol
    },
    json: true
  };

  return options;
};
module.exports = getStockValue;