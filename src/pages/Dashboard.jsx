import React, { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import jwt_decode from 'jwt-decode'


export default function Dashboard() {
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    // console.log(user);

    const logoutUser = async(e)=>{
    // remove the cookie
      try {
            await axios.delete('/logout');
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            setUser()
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
      if(!user){
        const getUserData = JSON.parse(localStorage.getItem("accessToken"))
        if(getUserData){
          const userData = jwt_decode(getUserData.accessToken)
          setUser(userData)
        } else {
                toast.error("You are not logged in")
                setTimeout(()=>{
                    toast.loading("Redirecting to login page")
                    setTimeout(()=>{
                      navigate('/login')
                    },2000)
                },3000)
          }
        }
        
        
    },[])


  return (
    <div className='dashboard'>
        <div>
            <h1> Dashboard </h1>
              {!!user && (<h2>Hi {user.name}!</h2>)}
        </div>
      
        <div className="container-login100-form-btn m-t-17">
            <button className="login100-form-btn gapFiller" onClick={logoutUser}>Logout</button>
        </div>
    </div>
  )
}
