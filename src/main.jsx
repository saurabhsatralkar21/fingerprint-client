import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter as Router} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/components/Navbar.css'
// import {
//   FpjsProvider
// } from '@fingerprintjs/fingerprintjs-pro-react'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  // <FpjsProvider
  //     loadOptions={{
  //       apiKey: "NOX3LSmkVaErLEQPkilK",
  //       region: "eu"
  //     }}
  //   >
      <Router>
        <App />
      </Router>
    // </FpjsProvider> 
  // </React.StrictMode>
)
