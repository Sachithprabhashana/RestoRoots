import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { ExploreMenu } from './components/ExploreMenu';
import { FoodDisplay } from './components/FoodDisplay';
import { Cart } from './pages/Cart';

const Home: React.FC = () => {
  const [category, setCategory] = useState<string>("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white pt-28">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart navigateToCheckout={() => alert('Proceeding to Stripe Checkout!')} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;