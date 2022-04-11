export default (state = { authData: null}, action) => {

    switch (action.type) {
        case 'AUTH':
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }))
            window.location.href = "/home";
            return { ...state, authData: action?.data };

        default: 
            return null;
    }

}