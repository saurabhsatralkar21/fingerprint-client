import React from 'react'
import '../App.css'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import FingerprintJS, {defaultEndpoint, defaultScriptUrlPattern} from '@fingerprintjs/fingerprintjs-pro'

export default function Register() {
    // const visitorData = useContext(FingerprintContext)
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        visitorId: '',
    })

    // useEffect will run 2 times because of React.StrictMode in main.jsx - This won't be the case in production
    // To not abuse the API calls too much, just comment out the <React.StrictMode> in main.jsx file
    useEffect(() => {
        const getVisitorId = async () => {
            try {
                if (localStorage.getItem("storedVisitorID")!= null ) {
                    const storedVisitorID = JSON.parse(localStorage.getItem("storedVisitorID"))
                    setUserData(userData => ({ ...userData, visitorId: storedVisitorID.value }));
                    console.log(`Visitor ID was previously saved. Grabbing the same ID: ${storedVisitorID.value}`);
                    }
                   else {
                        const fpPromise = FingerprintJS.load({
                            apiKey: import.meta.env.VITE_FPJS_API,
                            region: "eu",
                            endpoint: [
                                "https://metrics.ssatralkar.com/3zOi3zXsrhJjSsCA/N6nwCk5wrZtCQ6P7?region=eu",
                                defaultEndpoint
                              ],
                              scriptUrlPattern: [
                                "https://metrics.ssatralkar.com/3zOi3zXsrhJjSsCA/i2EJipXeQ5ii4in8?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
                                defaultScriptUrlPattern
                              ]
                        });

                        const fp = await fpPromise;
                        const result = await fp.get();
                        console.log(result.visitorId);


                        const now = new Date();
                        const expirationTime = now.getTime() + (23.5 * 60 * 60 * 1000); // 23.5 is expiration hour
                        const value = result.visitorId
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
    }, []); // Run this effect only once on component mount

    
    const registerUser = async (e) => {
        e.preventDefault()
        const {name, email, password, visitorId} = userData
        try {
            const response = await axios.post("/register", {
                name, email, password, visitorId
            })

            if(response.data.error){
                toast.error(response.data.error)
            } else {
                setUserData({})
                toast.success("Registration successful")
                navigate('/login')
            }
        }
        catch(error) {
            console.log(error);
        }

    }


  return (
            <>
               <div className='registration-form'>
                <form action='' method='POST' onSubmit={registerUser}>
                    <div className='login100-form-title'>
                        Register with us!
                    </div>
                    <div className="form-group gapFiller">
                        <label htmlFor="exampleInputUsername">Name: </label>
                        <input type="text" className="form-control" id="exampleInputUsername" aria-describedby="emailHelp" placeholder="John Doe" 
                        value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} autoComplete='off' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address: </label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="abc@example.com" 
                        value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} autoComplete='off'/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Create a password: </label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="*******" 
                        value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} autoComplete='off'/>
                    </div>
                    
                    <div className="container-login100-form-btn m-t-17">
                        <button className="login100-form-btn registerbtn">Register</button>
                    </div>
                </form>

                

               </div>
               <div className='tooltipContainer'>
                    <div className='tooltipDetails'>
                            <h5>Tool Tip 💡</h5>
                            <p> If you attempt to register more than 4 times in a minute, your visitorID will be tagged as 
                                suspicious and will be blocked from future registrations 
                            </p>
                    </div>
               </div>
               
            </>
  )
}
