import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">

        <h1>GraphQL Monster Demo</h1>

        <pre>
          user: test@graphql.monster
          password: test@graphql.monster
        </pre>
        <Link to="/posts"> Posts (without photos)</Link>
        <Link to="/postsV2"> Posts V2 (with photos)</Link>
      </header>
    </div>
  );
}

export default Home;
