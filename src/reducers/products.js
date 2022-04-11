export default (state = { products: [], productDetail: {}}, action) => {
    
    switch (action.type) {
        case 'GET_PRODUCTS':
            return  action.payload;
        case 'GET_PRODUCT_DETAILS':
            return { ...state, productDetail: action?.data };
        default: 
            return null;
    }
    
}