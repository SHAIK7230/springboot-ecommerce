const initialState = {
    paymentMethod: "Cash on Delivery",
};

export const paymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_PAYMENT_METHOD":
            return {
                ...state,
                paymentMethod: action.payload,
            };
        default:
            return state;
    }
};