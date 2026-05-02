
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'
import Verify from './pages/Verify'
import CreateCharacter from './pages/CreateCharacter'
import Chat from './pages/Chat'
import Home from './pages/Home'
import Navbar from './components/Navbar'

import {AuthProvider} from './context/AuthContext'
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/createcharacter" element={<CreateCharacter />} />
          <Route path="/chat/:characterId" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
