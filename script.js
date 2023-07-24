const apiUrl = "https://api.coingecko.com/api/v3";

async function fetchCryptoData() {
  try {
    const response = await fetch(
      `${apiUrl}/coins/markets?vs_currency=usd&price_change_percentage=1h%2C24h%2C7d&order=market_cap_desc`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayCryptoData(cryptoData) {
  const tableBody = document.querySelector("#crypto-table tbody");
  tableBody.innerHTML = "";

  const firstTenCryptos = cryptoData.slice(0, 10);

  firstTenCryptos.forEach((crypto) => {
    if (
      crypto.name &&
      crypto.symbol &&
      crypto.current_price &&
      crypto.low_24h &&
      crypto.high_24h &&
      crypto.price_change_percentage_24h !== undefined
    ) {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td><img src="${crypto.image}" alt="${
        crypto.name
      }" width="30" height="30"></td>
        <td>${crypto.name}</td>
        <td>${crypto.symbol.toUpperCase()}</td>
        <td>$${crypto.current_price}</td>
        <td>$${crypto.low_24h}</td>
        <td>$${crypto.high_24h}</td>
        <td>${formatPriceChange(
          crypto.price_change_percentage_1h_in_currency
        )}</td>
        <td>${formatPriceChange(crypto.price_change_percentage_24h)}</td>
        <td>${formatPriceChange(
          crypto.price_change_percentage_7d_in_currency
        )}</td>
      `;
      row.addEventListener("click", () => showDetails(crypto));
      tableBody.appendChild(row);
    } else {
      console.warn("Incomplete crypto data:", crypto);
    }
  });
}

function formatPrice(price) {
  const formattedPrice = parseFloat(price);

  if (formattedPrice === parseInt(formattedPrice, 10)) {
    return formattedPrice;
  }

  return formattedPrice.toFixed(8);
}

function formatPriceChange(priceChange) {
  if (priceChange === undefined) {
    return "N/A";
  }

  const formattedChange = priceChange.toFixed(2);
  return priceChange >= 0 ? `+${formattedChange}%` : `${formattedChange}%`;
}

function showDetails(crypto) {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
    <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
    <p>Current Price: $${crypto.current_price}</p>
    <p>Lowest Price in the Last 24 Hours: $${crypto.low_24h}</p>
    <p>Highest Price in the Last 24 Hours: $${crypto.high_24h}</p>
    <!-- You can add more details here as needed -->
  `;
}

function displayBiggestGainers(gainersData) {
  const tableBody = document.querySelector("#biggest-gainers-table tbody");
  tableBody.innerHTML = "";

  gainersData.forEach((crypto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td><img src="${crypto.image}" alt="${
      crypto.name
    }" width="30" height="30"></td>
      <td>${crypto.name}</td>
      <td>${crypto.symbol.toUpperCase()}</td>
      <td>$${crypto.current_price}</td>
      <td>$${crypto.low_24h}</td>
      <td>$${crypto.high_24h}</td>
        <td>${formatPriceChange(
          crypto.price_change_percentage_1h_in_currency
        )}</td>
        <td>${formatPriceChange(crypto.price_change_percentage_24h)}</td>
        <td>${formatPriceChange(
          crypto.price_change_percentage_7d_in_currency
        )}</td>
    `;
    row.addEventListener("click", () => showDetails(crypto));
    tableBody.appendChild(row);
  });
}

function displayBiggestLosers(losersData) {
  const tableBody = document.querySelector("#biggest-losers-table tbody");
  tableBody.innerHTML = "";

  losersData.forEach((crypto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td><img src="${crypto.image}" alt="${
      crypto.name
    }" width="30" height="30"></td>
      <td>${crypto.name}</td>
      <td>${crypto.symbol.toUpperCase()}</td>
      <td>$${crypto.current_price}</td>
      <td>$${crypto.low_24h}</td>
      <td>$${crypto.high_24h}</td>
        <td>${formatPriceChange(
          crypto.price_change_percentage_1h_in_currency
        )}</td>
        <td>${formatPriceChange(crypto.price_change_percentage_24h)}</td>
        <td>${formatPriceChange(
          crypto.price_change_percentage_7d_in_currency
        )}</td>
         `;
    row.addEventListener("click", () => showDetails(crypto));
    tableBody.appendChild(row);
  });
}

function findBiggestGainers(cryptoData) {
  return cryptoData
    .filter((crypto) => crypto.price_change_percentage_24h > 0)
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 10);
}

function findBiggestLosers(cryptoData) {
  return cryptoData
    .filter((crypto) => crypto.price_change_percentage_24h < 0)
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    )
    .slice(0, 10);
}

async function searchCrypto() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.trim().toLowerCase();

  const cryptoData = await fetchCryptoData();
  const filteredCryptoData = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm) ||
      crypto.symbol.toLowerCase().includes(searchTerm)
  );

  displayCryptoData(filteredCryptoData);

  const allCryptos = cryptoData.map((crypto) => ({
    image: crypto.image,
    name: crypto.name,
    symbol: crypto.symbol,
    current_price: crypto.current_price,
    low_24h: crypto.low_24h,
    high_24h: crypto.high_24h,
    price_change_percentage_1h_in_currency:
      crypto.price_change_percentage_1h_in_currency,
    price_change_percentage_24h: crypto.price_change_percentage_24h,
    price_change_percentage_7d_in_currency:
      crypto.price_change_percentage_7d_in_currency,
  }));

  const biggestGainers = findBiggestGainers(allCryptos);
  displayBiggestGainers(biggestGainers);

  const biggestLosers = findBiggestLosers(allCryptos);
  displayBiggestLosers(biggestLosers);
}

document.getElementById("search-btn").addEventListener("click", searchCrypto);

(async function () {
  const cryptoData = await fetchCryptoData();
  displayCryptoData(cryptoData);

  const allCryptos = cryptoData.map((crypto) => ({
    image: crypto.image,
    name: crypto.name,
    symbol: crypto.symbol,
    current_price: crypto.current_price,
    low_24h: crypto.low_24h,
    high_24h: crypto.high_24h,
    price_change_percentage_1h_in_currency:
      crypto.price_change_percentage_1h_in_currency,
    price_change_percentage_24h: crypto.price_change_percentage_24h,
    price_change_percentage_7d_in_currency:
      crypto.price_change_percentage_7d_in_currency,
  }));

  const biggestGainers = findBiggestGainers(allCryptos);
  displayBiggestGainers(biggestGainers);

  const biggestLosers = findBiggestLosers(allCryptos);
  displayBiggestLosers(biggestLosers);
})();
