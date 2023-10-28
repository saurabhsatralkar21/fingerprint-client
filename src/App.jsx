import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from '../src/pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MultifactorAuthentication from './pages/MultifactorAuthentication'
import MFAVerify from './pages/mfaVerify'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext'
import axios from 'axios'


axios.defaults.baseURL = "https://fpserver.ssatralkar.com/"
axios.defaults.withCredentials = true

function App() {
  // const {isLoading, error, data} = useVisitorData()

  return (
    <UserContextProvider>
      {/* <FingerprintContext.Provider value={{error, data}}> */}
        <Navbar />
        <Toaster position='top-center' toastOptions={{ className:'toast-popUps', duration: 3000}} />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/mfa' element={<MultifactorAuthentication/>} />
          <Route path='/mfaverify' element={<MFAVerify/>} />
        </Routes>
      {/* </FingerprintContext.Provider> */}
     </UserContextProvider>
     
  )
}

export default App
