import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/home'
import Menu from './pages/menu'
import Cart from './pages/cart'
import PlaceOrder from './pages/place_order'
import AdminLogin from './pages/admin_login'
import AdminDashboard from './pages/admin_dashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu/:category" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/place-order/:orderId" element={<PlaceOrder />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App