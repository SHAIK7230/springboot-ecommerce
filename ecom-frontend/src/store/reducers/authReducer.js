const savedAddress = localStorage.getItem("CHECKOUT_ADDRESS")
    ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
    : null;

const initialState = {
    user: null,
    address: [],
    clientSecret: null,
    selectedUserCheckoutAddress: savedAddress,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            return { ...state, user: action.payload };
        case "USER_ADDRESS": {
            let selected = state.selectedUserCheckoutAddress;
            const addresses = action.payload || [];
            // If no address selected or selected address is not in user's addresses, pick the first
            if ((!selected || !addresses.some(a => a?.addressId === selected?.addressId)) && addresses.length > 0) {
                selected = addresses[0];
                localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(selected));
            }
            return { ...state, address: addresses, selectedUserCheckoutAddress: selected };
        }
        case "SELECT_CHECKOUT_ADDRESS":
            return { ...state, selectedUserCheckoutAddress: action.payload };
        case "REMOVE_CHECKOUT_ADDRESS":
            localStorage.removeItem("CHECKOUT_ADDRESS");
            return { ...state, selectedUserCheckoutAddress: null };
        case "CLIENT_SECRET":
            return { ...state, clientSecret: action.payload };
        case "REMOVE_CLIENT_SECRET_ADDRESS":
            localStorage.removeItem("CHECKOUT_ADDRESS");
            return { ...state, clientSecret: null, selectedUserCheckoutAddress: null };
        case "LOG_OUT":
            localStorage.removeItem("CHECKOUT_ADDRESS");
            return { 
                user: null,
                address: null,
                selectedUserCheckoutAddress: null,
             };
             
        default:
            return state;
    }
};