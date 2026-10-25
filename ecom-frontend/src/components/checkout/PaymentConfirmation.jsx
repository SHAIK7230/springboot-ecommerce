import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { stripePaymentConfirmation } from '../../store/actions';
import toast from 'react-hot-toast';
import { Skeleton } from '@mui/material';

const PaymentConfirmation = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    const { cart } = useSelector((state) => state.carts);
    const [loading, setLoading] = useState(false);

    const paymentIntent = searchParams.get("payment_intent");
    const clientSecret = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");
    const orderId = searchParams.get("order_id");
    const paymentMethod = searchParams.get("payment_method") || "Order";

    const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
        ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
        : null;

    useEffect(() => {
        if (paymentIntent &&
            clientSecret &&
            redirectStatus &&
            cart &&
            cart?.length > 0 &&
            selectedUserCheckoutAddress?.addressId
        ) { 
            const sendData = {
                addressId: selectedUserCheckoutAddress.addressId,
                pgName: "Stripe",
                pgPaymentId: paymentIntent,
                pgStatus: "succeeded",
                pgResponseMessage: "Payment successful"
            };
            dispatch(stripePaymentConfirmation(sendData, setErrorMessage, setLoading, toast));
        }
    }, [paymentIntent, clientSecret, redirectStatus, cart]);

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-4 py-12'>
            {loading ? (
                <div className='max-w-md w-full mx-auto space-y-4'>
                    <Skeleton variant="circular" width={64} height={64} className="mx-auto" />
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rectangular" height={120} />
                </div>
            ) : (
                <div className="p-8 rounded-2xl shadow-xl text-center max-w-lg w-full mx-auto bg-white border border-gray-100">
                    <div className="text-emerald-500 mb-5 flex justify-center">    
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                            <FaCheckCircle size={56} className="text-emerald-500" />
                        </div>
                    </div>

                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
                        {orderId ? "Order Confirmed" : "Payment Succeeded"}
                    </span>

                    <h2 className='text-3xl font-extrabold text-gray-900 mb-2'>
                        Thank You for Your Order!
                    </h2>

                    {orderId && (
                        <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 inline-block">
                            <span className="text-xs text-slate-500 block">Order Reference Number</span>
                            <span className="font-mono font-bold text-lg text-slate-800">#{orderId}</span>
                            <span className="text-xs text-blue-600 block mt-0.5">Payment: {decodeURIComponent(paymentMethod)}</span>
                        </div>
                    )}

                    <p className="text-gray-600 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                        Your order has been placed and confirmed. We are packing your items and will deliver them to your address shortly.
                    </p>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/products"
                            className="py-3 px-6 rounded-xl bg-custom-blue text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2">
                            <FaShoppingBag />
                            <span>Continue Shopping</span>
                        </Link>

                        <Link
                            to="/"
                            className="py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
                            <FaHome />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentConfirmation;
