import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

export default function MFAVerify() {
    const [verifyCode, setVerifyCode] = useState({codeInput: ''})
    const [user, setUser] = useState()
    const navigate = useNavigate()
    
    useEffect(()=> {
        if(!user){
          const getUserData = JSON.parse(localStorage.getItem("accessToken"))
          const userData = jwt_decode(getUserData.accessToken)
          setUser(userData)
        }
      },[])

    const sendCode = async(e) => {
        e.preventDefault();
        try{
            const {codeInput} = verifyCode
            console.log(codeInput);
            const sendqrCode = await axios.post("/setMFA?code="+codeInput,{email: user.email, qrCode: codeInput})
            if(sendqrCode.data.error) {
                toast.error(sendqrCode.data.error)
            } else {
                toast.success(sendqrCode.data.success)
                setTimeout(()=>{
                    toast.loading("Redirecting you to the dashboard page")
                    setTimeout(()=>{
                        navigate('/dashboard')
                    }, 2000)
                    
                }, 2000)       
            }
    
            
        }catch(error){
            console.log(error);
        }
    }

  return (
    <div className='qrCode-Verify-Container'>
        <h5>Check your authenticator for the code!!</h5>
    <form action='' method='POST' onSubmit={sendCode}>
        <div className="form-group gapFiller">
            <label htmlFor="exampleInputCode">Enter the code below: </label>
            <input type="text" className="form-control" id="exampleInputCode" aria-describedby="2FACode" placeholder="*****" 
            value={verifyCode.codeInput} onChange={(e) => setVerifyCode({...verifyCode, codeInput: e.target.value})} autoComplete='off' name='code'/>
        </div>
        
        <div className="container-login100-form-btn m-t-17">
            <button className="login100-form-btn">Verify!</button>
        </div>
    </form>

</div>
  )
}
