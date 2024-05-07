import React, { useState } from "react";
import "./index.css";

export default function StockData() {
  const [dataSearch, setDataSearch] = useState(null);
  const handleSearching = async (e) => {
    const input = document.querySelector("#app-input").value;

    const url = `https://jsonmock.hackerrank.com/api/stocks?date=${input}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        setDataSearch(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="layout-column align-items-center mt-50">
      <section className="layout-row align-items-center justify-content-center">
        <input
          type="text"
          className="large"
          placeholder="5-January-2000"
          id="app-input"
          data-testid="app-input"
        />
        <button
          className=""
          id="submit-button"
          data-testid="submit-button"
          onClick={handleSearching}
        >
          Search
        </button>
      </section>
      {dataSearch != null && dataSearch.data.length > 0 ? (
        dataSearch.data.map((data, index) => {
          const { open, close, high, low } = data;
          return (
            <ul
              className="mt-50 slide-up-fade-in styled"
              id="stockData"
              data-testid="stock-data"
              key={index}
            >
              <li className="py-10">Open: {open}</li>
              <li className="py-10">Close: {close}</li>
              <li className="py-10">High: {high}</li>
              <li className="py-10">Low: {low}</li>
            </ul>
          );
        })
      ) : dataSearch != null ? (
        <div
          className="mt-50 slide-up-fade-in"
          id="no-result"
          data-testid="no-result"
        >
          No Results Found
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
