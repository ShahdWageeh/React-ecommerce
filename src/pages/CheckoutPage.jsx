import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCheckout, startCheckout } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { checkoutStatus, checkoutError, checkoutUrl } = useSelector(
    (s) => s.cart
  );

  useEffect(() => {
    dispatch(clearCheckout());
  }, [dispatch]);

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const onStart = async () => {
    await dispatch(startCheckout());
  };

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {checkoutError ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {checkoutError}
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onStart}
          disabled={checkoutStatus === "loading"}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {checkoutStatus === "loading" ? "Starting..." : "Pay with Stripe"}
        </button>
        <Link
          to="/cart"
          className="flex-1 rounded-lg border px-4 py-2.5 text-center text-sm font-semibold hover:bg-gray-50"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}

