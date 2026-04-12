import React from 'react'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function ProtectedRoute({ children }) {


    const { userData,accessToken } = useContext(AuthContext)
    const isLoggedIn = Boolean(accessToken);
    console.log(isLoggedIn);
    

    if (!isLoggedIn){
        toast.warn('Only admin can accessmmm')
         return <Navigate to={'/'} />
    }
    if (userData && userData.role !== 'admin') {
        toast.warn('Only admin can access')
        return <Navigate to={'/'} />
    }


    return (
        <div>{children}</div>
    )
}
