const API_KEY =
  "81b05db8496581d7d2a2f7dee21dc20505c4eb8ed23072e1b9f00cb11f68a664";

const tickersHandlers = new Map(); // {}

//TODO: refactor to use URLSearchParams
const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys()
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;

export const getAvaliableCoinList = () => {
  return fetch(
    `https://min-api.cryptocompare.com/data/blockchain/list?api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .catch((error) => console.log(error));
};
