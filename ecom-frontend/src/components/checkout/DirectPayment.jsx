import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { placeDirectOrderAction } from '../../store/actions';
import { formatPrice } from '../../utils/formatPrice';
import { FaMoneyBillWave, FaCreditCard, FaShieldAlt, FaLock, FaCheckCircle, FaTruck } from 'react-icons/fa';
import { MdQrCodeScanner, MdOutlinePayment } from 'react-icons/md';

const DirectPayment = ({ paymentMethod }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, totalPrice: reduxTotalPrice } = useSelector((state) => state.carts);
    const { selectedUserCheckoutAddress, user } = useSelector((state) => state.auth);
    const { btnLoader } = useSelector((state) => state.errors);

    const calculatedTotal = reduxTotalPrice > 0
        ? reduxTotalPrice
        : cart?.reduce((acc, cur) => acc + Number(cur?.specialPrice || cur?.price) * Number(cur?.quantity), 0);

    // Form states for demo card & UPI
    const [upiId, setUpiId] = useState(user?.email ? `${user.username || 'user'}@okaxis` : "customer@upi");
    const [cardNumber, setCardNumber] = useState("4532 8821 9012 3456");
    const [cardExpiry, setCardExpiry] = useState("08/29");
    const [cardCvv, setCardCvv] = useState("892");
    const [cardName, setCardName] = useState(user?.username || "Demo User");

    const handleConfirmOrder = (e) => {
        e.preventDefault();

        if (!selectedUserCheckoutAddress?.addressId) {
            toast.error("Please select a delivery address.");
            return;
        }

        if (!cart || cart.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        const method = paymentMethod || "Cash on Delivery";
        const sendData = {
            addressId: selectedUserCheckoutAddress.addressId,
            paymentMethod: method,
            pgName: method,
            pgPaymentId: `${method.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`,
            pgStatus: "succeeded",
            pgResponseMessage: `${method} payment completed successfully`,
        };

        dispatch(placeDirectOrderAction(method, sendData, navigate, toast));
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-100 my-8">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4 mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Complete Your Order</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Method: <span className="font-semibold text-blue-600">{paymentMethod}</span></p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400 block uppercase font-medium">Total Amount</span>
                    <span className="text-2xl font-extrabold text-gray-900">{formatPrice(calculatedTotal)}</span>
                </div>
            </div>

            {/* Delivery address mini recap */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex items-start gap-3">
                <FaTruck className="text-blue-600 text-lg mt-0.5 shrink-0" />
                <div className="text-xs text-slate-700">
                    <p className="font-semibold text-slate-900 mb-0.5">Delivering to:</p>
                    <p>{selectedUserCheckoutAddress?.buildingName}, {selectedUserCheckoutAddress?.street}</p>
                    <p>{selectedUserCheckoutAddress?.city}, {selectedUserCheckoutAddress?.state} - {selectedUserCheckoutAddress?.pincode}</p>
                </div>
            </div>

            {/* Cash on Delivery Content */}
            {paymentMethod === "Cash on Delivery" && (
                <div className="space-y-4">
                    <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FaMoneyBillWave size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-emerald-900 mb-1">Pay on Delivery</h3>
                        <p className="text-sm text-emerald-700 max-w-md mx-auto">
                            No advance payment needed. Pay ₹{Number(calculatedTotal).toLocaleString('en-IN')} in cash or via UPI QR code upon arrival at your doorstep.
                        </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 flex items-center gap-2">
                        <FaShieldAlt className="text-emerald-600 shrink-0 text-sm" />
                        <span>100% Safe & Verified contactless doorstep delivery</span>
                    </div>

                    <button
                        onClick={handleConfirmOrder}
                        disabled={btnLoader}
                        className="w-full py-3.5 px-6 rounded-xl bg-custom-blue text-white font-bold text-base shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
                        {btnLoader ? (
                            <span>Placing Order...</span>
                        ) : (
                            <>
                                <FaCheckCircle />
                                <span>Place Order • {formatPrice(calculatedTotal)}</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* UPI Payment Content */}
            {(paymentMethod === "UPI" || paymentMethod === "UPI Payment") && (
                <div className="space-y-5">
                    <div className="p-5 bg-blue-50/60 border border-blue-100 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <MdQrCodeScanner size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Instant UPI Payment</h3>
                                <p className="text-xs text-gray-500">Fast & zero surcharge</p>
                            </div>
                        </div>

                        {/* Demo QR Simulation */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 max-w-[200px] mx-auto text-center shadow-xs">
                            <svg className="w-36 h-36 mx-auto text-gray-800" viewBox="0 0 100 100" fill="currentColor">
                                <path d="M10 10h30v30H10zm5 5v20h20V15zm5 5h10v10H20zm40-10h30v30H60zm5 5v20h20V15zm5 5h10v10H70zm-50 40h30v30H10zm5 5v20h20V55zm5 5h10v10H20zm40 0h10v10H60zm10 10h10v10H70zm10-10h10v10H80zm0 10h10v10H80zm-20 10h10v10H60zm20 0h10v10H80z" />
                            </svg>
                            <p className="text-[11px] text-gray-500 font-medium mt-2">Scan with any UPI app</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Or Enter Virtual Payment Address (UPI ID)</label>
                        <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="username@okaxis"
                        />
                    </div>

                    <button
                        onClick={handleConfirmOrder}
                        disabled={btnLoader}
                        className="w-full py-3.5 px-6 rounded-xl bg-custom-blue text-white font-bold text-base shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
                        {btnLoader ? (
                            <span>Verifying & Placing Order...</span>
                        ) : (
                            <>
                                <FaCheckCircle />
                                <span>Pay {formatPrice(calculatedTotal)} & Confirm Order</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Card Demo Payment Content */}
            {(paymentMethod === "Card" || paymentMethod === "Card Payment") && (
                <div className="space-y-4">
                    {/* Visual Card Preview */}
                    <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-mono tracking-widest uppercase text-indigo-300">DEMO CARD</span>
                            <FaCreditCard className="text-2xl text-indigo-300" />
                        </div>
                        <p className="font-mono text-lg tracking-widest mb-4">{cardNumber || "•••• •••• •••• ••••"}</p>
                        <div className="flex justify-between items-center text-xs">
                            <div>
                                <span className="text-indigo-300 text-[10px] block uppercase">Card Holder</span>
                                <span className="font-semibold uppercase tracking-wider">{cardName || "YOUR NAME"}</span>
                            </div>
                            <div>
                                <span className="text-indigo-300 text-[10px] block uppercase">Expires</span>
                                <span className="font-semibold">{cardExpiry || "MM/YY"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Valid Thru</label>
                                <input
                                    type="text"
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                                <input
                                    type="password"
                                    maxLength="4"
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Name on Card</label>
                            <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 py-1">
                        <FaLock className="text-emerald-600 text-xs" />
                        <span>256-bit SSL encrypted secure demo transaction</span>
                    </div>

                    <button
                        onClick={handleConfirmOrder}
                        disabled={btnLoader}
                        className="w-full py-3.5 px-6 rounded-xl bg-custom-blue text-white font-bold text-base shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
                        {btnLoader ? (
                            <span>Authorizing Payment...</span>
                        ) : (
                            <>
                                <FaCheckCircle />
                                <span>Pay {formatPrice(calculatedTotal)} & Confirm Order</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DirectPayment;
