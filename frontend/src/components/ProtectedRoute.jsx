import {Navigate} from 'react-router-dom'
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect } from 'react';

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch((err)=> setIsAuthorized(false))
    }, [])

    const refreshToken =  async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            const res = await api.post('/api/token/refresh/', {refresh: refreshToken})

            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }
        } catch (err){
            console.log(err)
            setIsAuthorized(false)
        }
    }
    
    const auth = async  () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN)
        if(!accessToken) {
            setIsAuthorized(false)
            return
        }

        const decoded = jwtDecode(accessToken)
        const tokenExp = decoded.tokenExp
        const now = Date.now() / 1000

        if(tokenExp < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }
    
    if(isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute