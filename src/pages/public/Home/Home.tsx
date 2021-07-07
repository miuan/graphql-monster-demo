import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">

        <h1>GraphQL Monster Template</h1>
        <p>
          This page is public and accesible for all visitors / users
          Edit <code>src/containers/public/Home/Home.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://graphql.monster/documentation/schema-description"
            target="_blank"
            rel="noopener noreferrer"
          >
            Schema
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://graphql.monster/documentation/optain-token"
            target="_blank"
            rel="noopener noreferrer"
          >
            Optain Token
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://graphql.org/learn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GraphQL
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
        </span>
      </header>
    </div>
  );
}

export default Home;
