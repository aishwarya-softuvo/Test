import { Route, Routes } from 'react-router-dom'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'

const App = () => (
  <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<About />} path="/about" />
        <Route element={<Contact />} path="/contact" />
        <Route element={<Login />} path="/login" />
      </Routes>
    </main>
    <Footer />
  </div>
)

export default App
