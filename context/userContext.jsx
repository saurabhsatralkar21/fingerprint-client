import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';


export const UserContext = createContext({})


export function UserContextProvider({children}) {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    useEffect(()=> {
        const userData = () =>{
            if(!user){
                try {
                    const storedData = JSON.parse(localStorage.getItem('accessToken'));

                    if(storedData){
                        const accessToken = storedData.accessToken;
                        const config = {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + accessToken
                            }
                        }
    
                        const userData = jwt_decode(accessToken)
                        setUser(userData)
                    }
                    
                } catch(error) {
                    console.log(error);
                }
                }
        }
        userData();
    }, [])

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}