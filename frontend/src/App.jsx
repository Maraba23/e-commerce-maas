import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ProductPage from '../pages/Products';
import ProductDetail from '../pages/Product';
import NotFound from '../pages/NotFound';
import CartPage from '../pages/CartPage';
import OrderConfirmation from '../pages/OrderConfirmation';
import HackerLanding from '../pages/LandingPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HackerLanding />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
