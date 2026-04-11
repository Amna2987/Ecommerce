import React from 'react'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {


    const { userData } = useContext(AuthContext)

    if (userData && userData.role !== 'admin') {
        return <Navigate to={'/'} />
    }

    return (
        <div>{children}</div>
    )
}
