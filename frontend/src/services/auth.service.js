import api from '../api/axios'

const signup = (signupData) => api.post('/auth/signup', signupData)
const login = (loginData) => api.post('/auth/login', loginData)
const logout = () => api.post('/auth/logout')
const refresh = () => api.post('/auth/refresh')
const health = () => api.get('/health')
const verifyEmail = (token) => api.get(`/auth/verify/${token}`)
const updateUserImg = (data) => api.post('/auth/user-img', data)


export const AuthServices = {signup, login, logout, refresh, health, verifyEmail, updateUserImg}