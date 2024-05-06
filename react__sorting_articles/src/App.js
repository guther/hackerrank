import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "h8k-components";

import Articles from "./components/Articles";

const title = "Sorting Articles";

function App({ articles }) {
  const [orderedArticles, setOrderedArticles] = useState(articles);

  const sortArticlesByMostUpvoted = () => {
    const desc = () =>
      [...orderedArticles].sort((a, b) => b.upvotes - a.upvotes);

    setOrderedArticles(() => desc());
  };

  const sortArticlesByMostRecent = () => {
    const desc = () =>
      [...orderedArticles].sort((a, b) => new Date(b.date) - new Date(a.date));

    setOrderedArticles(() => desc());
  };

  useEffect(() => {
    sortArticlesByMostUpvoted();
  }, []);

  return (
    <div className="App">
      <h8k-navbar header={title}></h8k-navbar>
      <div className="layout-row align-items-center justify-content-center my-20 navigation">
        <label className="form-hint mb-0 text-uppercase font-weight-light">
          Sort By
        </label>
        <button
          data-testid="most-upvoted-link"
          className="small"
          onClick={() => {
            sortArticlesByMostUpvoted();
          }}
        >
          Most Upvoted
        </button>
        <button
          data-testid="most-recent-link"
          className="small"
          onClick={sortArticlesByMostRecent}
        >
          Most Recent
        </button>
      </div>
      <Articles articles={orderedArticles} />
    </div>
  );
}

export default App;
