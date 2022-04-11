import * as api from '../api/api'

export const signUp = (formData) => async(dispatch) => {
    try{
        const { data } = await api.signUp(formData);
        dispatch({ type: 'AUTH', data})
    } catch(error){ 
        console.log(error.message)
    }
}

export const logIn = (formData) => async(dispatch) => {
    try{
        const { data } = await api.logIn(formData);
        dispatch({ type: 'AUTH', data})
    } catch(error){ 
        console.log(error.message)
    }
}