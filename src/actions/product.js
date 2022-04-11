import * as api from '../api/api'

export const getProducts = () => async(dispatch) => {
    try{
        const {data} = await api.getProducts()
        dispatch({ type: 'GET_PRODUCTS', payload: data })
    } catch(error){ 
        console.log(error.message)
    }
}

export const getProductDetail = (prodName) => async(dispatch) => {
    try{
        const {data} = await api.getProductDetail(prodName);
        dispatch({ type: 'GET_PRODUCT_DETAILS', payload: data })
    } catch(error){ 
        console.log(error.message)
    }
}