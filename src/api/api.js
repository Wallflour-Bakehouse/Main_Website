import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' })

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('profile')){
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})

export const getProducts = () => API.get('/product/')
export const getProductDetail = (prodName) => API.get(`/product/${prodName}`)

export const logIn = (formData) => API.post('/user/login', formData)
export const signUp = (formData) => API.post('/user/signup', formData)
