const Portfolio = require("./entities/Portfolio");
const Stock = require("./entities/Stock");
const rebalance = require("./portfolioManagement/rebalance");

const index = async () => {
  const portfolio = new Portfolio(1, [
    new Stock("AAPL", 50),
    new Stock("GOOG", 200),
    new Stock("CYBR", 150),
    new Stock("ABB", 900)
  ]);

  const rebalanceMap = new Map();
  rebalanceMap.set("AAPL", 22);
  rebalanceMap.set("GOOG", 38);
  rebalanceMap.set("GFN", 25);
  rebalanceMap.set("ACAD", 15);

  const date = "2019-11-22";
  await rebalance(portfolio, rebalanceMap, date);
};

index();