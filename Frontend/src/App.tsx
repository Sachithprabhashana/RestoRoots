import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { ExploreMenu } from './components/ExploreMenu';
import { FoodDisplay } from './components/FoodDisplay';
import { AppDownload } from './components/AppDownload';
import { Cart } from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import { Verify } from './pages/Verify';
import { LoginPopup } from './components/LoginPopup';
import { MyOrders } from './pages/MyOrders';
import { Admin } from './pages/Admin';
import { AddItems } from './pages/admin/AddItems';
import { ListItems } from './pages/admin/ListItems';
import { AdminOrders } from './pages/admin/AdminOrders';
import { Footer } from './components/Footer';

const Home: React.FC = () => {
  const [category, setCategory] = useState<string>("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload expoUrl="exp://192.168.8.129:8081" />
    </div>
  );
};

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <Router>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="min-h-screen">
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
        <Footer />
      </div>
    </Router>
  );
};

export default App;