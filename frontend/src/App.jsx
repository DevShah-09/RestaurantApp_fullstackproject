import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/home'
import Menu from './pages/menu'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/menu/:category" element={<Menu/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App