const stockPriceService = require("../service/stockPriceService");

const rebalance = async (portfolio, rebalanceMap, date) => {
  let totalInvestment = 0;
  const stocks = portfolio.stocks;
  let toBeRebalanced = [];
  let totalAmountRebalanced = 0;

  const findPrice = async () => {
    try {
      const stocks = portfolio.stocks;
      let stockPrices = [];
      for(let i = 0 ; i< stocks.length; i++){
        stockPrices.push(stockPriceService(stocks[i].symbol, date));
      }

      rebalanceMap.forEach((rebalancePercent, symbol) => {
        const ifExists = stocks.find(stock => stock.symbol === symbol );
        if(!ifExists){
          stockPrices.push(stockPriceService(symbol, date));
          stocks.push({ symbol, numberOfShares: 0, rebalancePercent });
        }
      });
      await findRebalanceShares(stockPrices, rebalanceMap)
    } catch (err) {
      console.log(err);
    }
  };

  const findRebalanceShares = async (stockPrices, rebalanceMap) => {
    await Promise.all(stockPrices).then( prices => {
      prices.forEach((price, idx) => {
        stocks[idx].price = parseFloat(price);
        totalInvestment += stocks[idx].numberOfShares * parseFloat(price);
      });
    });
    
    totalInvestment = Math.round(totalInvestment);
    stocks.forEach((stock) => {
      const currentValue = stock.numberOfShares * stock.price;
      const rebalanceAmount = totalInvestment * parseFloat(rebalanceMap.get(stock.symbol) / 100);
      if(currentValue > rebalanceAmount) {
        const differenceAmount = currentValue - rebalanceAmount;
        totalAmountRebalanced += differenceAmount;
        const shares = Math.round(differenceAmount/currentValue);
        toBeRebalanced.push({
          symbol: stock.symbol,
          numberOfShares: shares,
          mode: "sell"
        });
      } else if (rebalanceAmount > currentValue){
        const differenceAmount = rebalanceAmount - currentValue;
        totalAmountRebalanced -= differenceAmount;
        const shares = Math.round(differenceAmount/currentValue);
        toBeRebalanced.push({
          symbol: stock.symbol,
          numberOfShares: shares,
          mode: "buy"
        });
      } else if (!rebalanceMap.get(stock.symbol)){
        totalAmountRebalanced += currentValue
        toBeRebalanced.push({
          symbol: stock.symbol,
          numberOfShares: stock.numberOfShares,
          mode: "sell"
        });
      } else if(stock.rebalancePercent) {
        const investment = totalInvestment * rebalancePercent / 100;
        const shares = Math.round(investment/price);
        toBeRebalanced.push({
          symbol: symbol,
          numberOfShares: shares,
          mode: "buy"
        });
        totalAmountRebalanced -= investment;
      }
    });
    console.log(toBeRebalanced);
  };
  findPrice();
};




module.exports = rebalance;