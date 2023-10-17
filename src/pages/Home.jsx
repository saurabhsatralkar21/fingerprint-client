import React from 'react'
import { useEffect } from 'react'

export default function Home() {
  useEffect(()=> {
    const removePreviousUser = () => {
      if(localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")){
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    }
  removePreviousUser();
  },[])
  return (
    <div className='gapFiller'>  
      <h3> Site to showcase Fingerprint usecases</h3> <hr />
      <div className='usecaseDetails'>

        <div className='caseCard'>
          <h5>Registration abuse detection</h5>
          <p>Registration abuse usecase showcases how Fingerprint's visitorID can be helpful to prevent registration abuse
            of the services the business offers. With the help of visitorID, we can help companies block the visitor from registering with 
            the businesses multiple times and abusing it. 
          </p>
        </div>
        
        <div className='caseCard'>
          <h5>Frictionless login</h5>
          <p>Frictionless logins help companies provide better user experience for their customers by bypassing Two Factor Authentication 
            of the returning users that are identified and tagged with a visitorID. 
          </p>
        </div>
      </div>
    </div>
  )
}
