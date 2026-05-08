import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartItemQty,
} from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, status, error, totalCartPrice, numOfCartItems } = useSelector(
    (s) => s.cart
  );

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const inc = (productId, currentCount) =>
    dispatch(updateCartItemQty({ productId, count: currentCount + 1 }));
  const dec = (productId, currentCount) =>
    dispatch(
      updateCartItemQty({ productId, count: Math.max(1, currentCount - 1) })
    );

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Your cart</h1>
          <p className="mt-1 text-sm text-gray-600">
            Items: {numOfCartItems} · Total: {totalCartPrice} EGP
          </p>
        </div>
        <div className="flex items-center gap-2">
          {items.length ? (
            <button
              disabled={status === "loading"}
              onClick={() => dispatch(clearCart())}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
              Clear cart
            </button>
          ) : null}
          <Link
            to="/products"
            className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Continue shopping
          </Link>
        </div>
      </div>

      {status === "loading" ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
          Loading cart...
        </div>
      ) : null}

      {status === "failed" ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {status === "succeeded" && items.length === 0 ? (
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-700">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse products
          </Link>
        </div>
      ) : null}

      <div className="space-y-3">
        {items.map((item) => {
          const p = item.product;
          return (
            <div
              key={p?._id || item._id}
              className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={p?.imageCover}
                    alt={p?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="line-clamp-1 text-sm font-semibold">
                    {p?.title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {p?.category?.name}
                  </p>
                  <p className="mt-2 text-sm font-bold">{item.price} EGP</p>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-between gap-3 sm:justify-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dec(p._id, item.count)}
                    className="h-9 w-9 rounded-lg border font-bold hover:bg-gray-50"
                    aria-label="decrease"
                  >
                    −
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold">
                    {item.count}
                  </span>
                  <button
                    onClick={() => inc(p._id, item.count)}
                    className="h-9 w-9 rounded-lg border font-bold hover:bg-gray-50"
                    aria-label="increase"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={status === "loading"}
                  onClick={() => dispatch(removeFromCart(p._id))}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length ? (
        <div className="mt-6 flex justify-end">
          <Link
            to="/checkout"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Checkout
          </Link>
        </div>
      ) : null}
    </div>
  );
}

