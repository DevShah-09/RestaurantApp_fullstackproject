import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/home'
import Menu from './pages/menu'
import PlaceOrder from './pages/place_order'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/menu/:category" element={<Menu/>} />
        <Route path="/place-order" element={<PlaceOrder/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App