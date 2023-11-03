import React from 'react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../assets/css/customUtil.css'
import '../assets/css/loginAndRegistration.css'
import axios from 'axios'
import FingerprintJS, {defaultEndpoint, defaultScriptUrlPattern} from '@fingerprintjs/fingerprintjs-pro'


export default function Login() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    visitorId: ''
  })
  const [visitorIDExists, setVisitorIDExists] = useState(false)
  

  useEffect(()=>{
    const getVisitorId = async () => {
      try {
        if (localStorage.getItem("storedVisitorID")!= null ) {
          const storedVisitorID = JSON.parse(localStorage.getItem("storedVisitorID"))
          setUserData(userData => ({ ...userData, visitorId: storedVisitorID.value }));
          setVisitorIDExists(true)
          console.log(`Visitor ID was previously saved. Grabbing the same ID: ${storedVisitorID.value}`);
        }
         else {
          const fpPromise = FingerprintJS.load({
              apiKey: import.meta.env.VITE_FPJS_API,
              region: "eu",
              endpoint: [
                "https://metrics.ssatralkar.com/3zOi3zXsrhJjSsCA/N6nwCk5wrZtCQ6P7?region=eu",
                FingerprintJS.defaultEndpoint
              ],
              scriptUrlPattern: [
                "https://metrics.ssatralkar.com/3zOi3zXsrhJjSsCA/i2EJipXeQ5ii4in8?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
                FingerprintJS.defaultScriptUrlPattern
              ],
          });

          const fp = await fpPromise;
          const result = await fp.get();
          
          console.log(result.visitorId);

          const now = new Date();
          const expirationTime = now.getTime() + (23.5 * 60 * 60 * 1000); // 23.5 is expiration hour
          var value = result.visitorId
          localStorage.setItem("storedVisitorID", JSON.stringify({ value, expirationTime }))
          setUserData(userData => ({ ...userData, visitorId: result.visitorId }));
        }
      } catch (error) {
          console.error(error);
      }
  };

  const removePreviousUser = () => {
    if(localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")){
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
  }

  getVisitorId();
  removePreviousUser();

  }, [])

  const loginUser = async (e) => {
    e.preventDefault();
      const {email, password, visitorId} = userData
      const now = new Date();
      const expirationTime = now.getTime() + (0.50 * 60 * 60 * 1000);
      try {
        const response = await axios.post("/login", {
          email, password, visitorId
        })

      
          if(response.data.error){
              toast.error(response.data.error)
              setUserData({email: '',password: '', visitorId: visitorId})
          } else {


            if(response.data.warning) {
              setTimeout(()=>{
                  console.log(response.data.warning);
                  toast.loading("2FA not configured\nRedirecting to configure 2FA")
                  setTimeout(()=>{
                    const accessToken = response.data.accessToken
                    const refreshToken = response.data.refreshToken
                    localStorage.setItem('accessToken', JSON.stringify({ accessToken , expirationTime }))
                    localStorage.setItem('refreshToken', JSON.stringify({ refreshToken, expirationTime }))
                    navigate('/mfa')
                  },2000)                
                },3000)
              }

            if(response.data.success){
              // Implement adding the 2FA code

              if(response.data.authenticate) {
                setUserData({})
                toast.success("Login successful")

                  const accessToken = response.data.accessToken
                  const refreshToken = response.data.refreshToken
                  localStorage.setItem('accessToken', JSON.stringify({ accessToken , expirationTime }))
                  localStorage.setItem('refreshToken', JSON.stringify({ refreshToken, expirationTime }))
                  
                  if(visitorIDExists === true) {
                    navigate('/dashboard')
                  } else {
                    navigate('/mfaverify')
                  }


                // }
              }
              
              // navigate('/dashboard')
              
            }
          }
        }
        catch(error) {
          console.error(`Error: ${error}`)
        }
  }


  

  return (
    <>
    <div className='login-form' onSubmit={loginUser}>
    
    <form action='' method='POST'>
        <div className='login100-form-title'>
          Log In!
        </div><div className="form-group gapFiller">
            <label htmlFor="exampleInputEmail1">Email address: </label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="abc@example.com"
              value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} autoComplete='off'/>
          </div><div className="form-group">
            <label htmlFor="exampleInputPassword1">Password: </label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="*******"
              value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} autoComplete='off'/>
          </div>
          <div className="container-login100-form-btn m-t-17">
            <button className="login100-form-btn">Sign In</button>
          </div>

    </form>
  </div>
    
    <div className='tooltipContainer'>
        <div className='tooltipDetails'>
                <h5>Tool Tip 💡</h5>
                <p> If you're logging in for the first time, you will need to use the authenticator to verify yourself.
                  If you've been on the login page before, based on your visitorID, you will not need to verify yourself again.
                </p>
        </div>
      </div>
    </>
    
  
      )
  }
