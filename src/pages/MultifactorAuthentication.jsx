import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import '../App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

export default function MultifactorAuthentication() {

    const navigate = useNavigate()
    const [verifyCode, setVerifyCode] = useState({codeInput: ''})
    const [qrImage, setQrImage] = useState("")

    const {user, setUser} = useContext(UserContext)
    console.log(user);
    

    useEffect(()=>{
        if(!user){
            const getUserData = JSON.parse(localStorage.getItem("accessToken"))
            const userData = jwt_decode(getUserData.accessToken)
            setUser(userData)
          }
          
        const sendUser = async () =>{
            try{
                const sendingUser = await axios.post('/qrImage', {email: user.email, name: user.name, id: user.id})
                if(sendingUser.data.success === true)
                {
                    console.log(sendingUser.data.image);
                    setQrImage(sendingUser.data.image)
                }
                
            } catch(error) {
                console.log(error);
            }
        }
       
        sendUser();
    },[])

    const sendCode = async(e) => {
        e.preventDefault();
        try{
            const {codeInput} = verifyCode
            const sendqrCode = await axios.post("/setMFA?code="+codeInput,{email: user.email, qrCode: codeInput})
            if(sendqrCode.data.error) {
                toast.error(sendqrCode.data.error)
            } else {
                toast.success(sendqrCode.data.success)
            }

            setTimeout(()=>{
                toast.loading("Redirecting you to the login page")
                setTimeout(()=>{
                    axios.delete('/logout');
                    localStorage.removeItem("accessToken")
                    localStorage.removeItem("refreshToken")
                    navigate('/login')
                }, 2000)
                
            }, 2000)


                    
        }catch(error){

        }
    }

  return (
    <div style={{height: 100}}>
        <h1> 2FA checkpoint </h1>
        {!!user && (<h5>Hi {user.name}!<br/> It seems that you have not set up two factor authentication before. </h5>)}
        <h6>  </h6>
        <ol className='MFA-instructions'>
            <li>Follow the steps below for configuring it on your account to make it more secure:</li>
            <li className='MFA-instructions-items'>1. Download Google Authenticator app on your phone</li>
            <li className='MFA-instructions-items'>2. Scan the QR code and add the app to your Authenticator</li>
            <li className='MFA-instructions-items'>3. Insert the code in the input box below</li>
        </ol>

        <div className='qrCode-Container'>
            <form action='' method='POST' onSubmit={sendCode}>
                <div className='MFA-image'>
                    <img src={qrImage} id='qrImage' height={150} width={150} />
                </div>
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
    </div>
  )
}


