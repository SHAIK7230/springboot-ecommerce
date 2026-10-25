import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPaymentMethod, createUserCart } from '../../store/actions';
import { FaMoneyBillWave, FaCreditCard, FaStripe, FaCheckCircle } from 'react-icons/fa';
import { MdQrCodeScanner } from 'react-icons/md';

const PaymentMethod = () => {
    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);
    const { cart, cartId } = useSelector((state) => state.carts);
    const { errorMessage } = useSelector((state) => state.errors);

    useEffect(() => {
        if (!paymentMethod) {
            dispatch(addPaymentMethod("Cash on Delivery"));
        }
    }, [dispatch, paymentMethod]);

    useEffect(() => {
        if (cart?.length > 0 && !cartId && !errorMessage) {
            const sendCartItems = cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));
            dispatch(createUserCart(sendCartItems));
        }
    }, [dispatch, cartId, cart, errorMessage]);

    const paymentOptions = [
        {
            id: "Cash on Delivery",
            title: "Cash on Delivery (COD)",
            description: "Pay with cash or UPI QR at your doorstep upon delivery",
            icon: <FaMoneyBillWave className="text-emerald-600 text-2xl" />,
            badge: "Recommended",
        },
        {
            id: "UPI Payment",
            title: "UPI / QR Code (Instant Demo)",
            description: "Instant payment via Google Pay, PhonePe, Paytm, or BHIM",
            icon: <MdQrCodeScanner className="text-blue-600 text-2xl" />,
        },
        {
            id: "Card Payment",
            title: "Credit / Debit Card (Instant Demo)",
            description: "Visa, MasterCard, RuPay, Maestro instant demo payment",
            icon: <FaCreditCard className="text-indigo-600 text-2xl" />,
        },
        {
            id: "Stripe",
            title: "Stripe Gateway",
            description: "Secure global card processing via Stripe",
            icon: <FaStripe className="text-purple-600 text-3xl" />,
        },
    ];

    return (
        <div className='max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8 border border-gray-100'>
            <div className="mb-6">
                <h1 className='text-2xl font-bold text-gray-900'>Select Payment Method</h1>
                <p className="text-gray-500 text-sm mt-1">Choose how you'd like to pay for your order</p>
            </div>

            <div className='space-y-3'>
                {paymentOptions.map((opt) => {
                    const isSelected = (paymentMethod || "Cash on Delivery") === opt.id;
                    return (
                        <div
                            key={opt.id}
                            onClick={() => dispatch(addPaymentMethod(opt.id))}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                isSelected
                                    ? "border-blue-600 bg-blue-50/50 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                            }`}>
                            <div className='flex items-center gap-4'>
                                <div className='p-2 bg-white rounded-md shadow-xs border border-gray-100 flex items-center justify-center w-12 h-12'>
                                    {opt.icon}
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-semibold text-gray-900'>{opt.title}</h3>
                                        {opt.badge && (
                                            <span className='text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full'>
                                                {opt.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-xs text-gray-500 mt-0.5'>{opt.description}</p>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                {isSelected ? (
                                    <FaCheckCircle className='text-blue-600 text-xl' />
                                ) : (
                                    <div className='w-5 h-5 rounded-full border-2 border-gray-300' />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PaymentMethod;