import React, { useContext, useEffect, useState } from 'react'
import { createContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthServices } from '../services/auth.service';
import { injectStore } from '../api/axios';


export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [accessToken, setAccessToken] = useState('')
  const [loginUser, setLoginUser] = useState('')
  const [userData, setUserData] = useState(() => {
    let data = localStorage.getItem('userData')
    if (data) {
      return JSON.parse(data)
    }
    return null
  })
  const navigate = useNavigate()


  const signup = async (signupData) => {
    const res = await AuthServices.signup(signupData)
  }

  const login = async (inpVal) => {
    console.log(inpVal);

    const res = await AuthServices.login(inpVal)
    console.log(res);

    const token = res.data.data.accessToken; ////
    console.log('login access token:', res.data.data.user);
    setAccessToken(token)
    setUserData(res.data.data.user)
    localStorage.setItem('userData', JSON.stringify(res.data.data.user))
    return token
  }

const updateUserProfile = (updates) => {
  console.log('updates', updates);
  
  setUserData((prev) => {
    const updated = { ...prev, ...updates };
    localStorage.setItem('userData', JSON.stringify(updated));
    return updated;
  });
};


  useEffect(() => {
    const checkHealth = async () => {
      const res = await AuthServices.health()
      console.log(res.data);
    }

    checkHealth()
  }, [])

  const logout = async () => {
    await AuthServices.logout()
    setAccessToken('')
    navigate('/')
    console.log('logout token', accessToken);

  }

  useEffect(() => {
    console.log(accessToken);

  }, [accessToken])

  useEffect(() => {
    async function load() {
      try {
        const res = await AuthServices.refresh();
        const token = res.data?.data?.accessToken;
        // console.log('accesss token 1', res1);

        setAccessToken(token);
        // setUserData(res.data.data)
        ;

      } catch {
        setAccessToken("");
      }
    }
    load();
  }, []);


  injectStore({ accessToken, setAccessToken, logout })



  return (
    <AuthContext.Provider value={{ accessToken, signup, login, logout, userData,setUserData,updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  return useContext(AuthContext)
}