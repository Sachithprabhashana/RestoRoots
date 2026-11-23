import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { ExploreMenu } from './components/ExploreMenu';
import { FoodDisplay } from './components/FoodDisplay';
import { Cart } from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import { Verify } from './pages/Verify';
import { LoginPopup } from './components/LoginPopup';
import { MyOrders } from './pages/MyOrders';
import { Admin } from './pages/Admin';
import { AddItems } from './pages/admin/AddItems';
import { ListItems } from './pages/admin/ListItems';
import { AdminOrders } from './pages/admin/AdminOrders';

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
  const [showLogin, setShowLogin] = useState(false);
  return (
    <Router>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="min-h-screen bg-gray-50">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          {/* element={<Cart navigateToCheckout={() => alert('Proceeding to Stripe Checkout!')} />} */}
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/admin" element={<Admin />}>
            <Route path="add" element={<AddItems />} />
            <Route path="list" element={<ListItems />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;