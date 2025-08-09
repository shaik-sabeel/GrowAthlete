import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>This is Home</h1>
      <Link to="/register">Register here</Link>
      <br />
      <Link to="/login">Login here</Link>
    </div>
  )
}

export default Home
