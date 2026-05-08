import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearSelected,
  fetchProductById,
} from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const { selected, selectedStatus, selectedError } = useSelector(
    (s) => s.products
  );
  const cartStatus = useSelector((s) => s.cart.status);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  const onAdd = async () => {
    await dispatch(addToCart(id));
  };

  if (selectedStatus === "loading") {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
        Loading product...
      </div>
    );
  }

  if (selectedStatus === "failed") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {selectedError}
      </div>
    );
  }

  if (!selected) return null;

  return (
    <div>
      <Link
        to="/products"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to products
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="aspect-square bg-gray-100">
            <img
              src={selected.imageCover}
              alt={selected.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-xs font-semibold text-blue-700">
            {selected.brand?.name || "Brand"} · {selected.category?.name || "Category"}
          </p>
          <h1 className="mt-2 text-2xl font-bold">{selected.title}</h1>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <span>
              ⭐ {selected.ratingsAverage ?? 0} ({selected.ratingsQuantity ?? 0})
            </span>
            <span>Sold: {selected.sold ?? 0}</span>
          </div>

          <div className="mt-5 text-3xl font-extrabold">{selected.price} EGP</div>

          <p className="mt-4 whitespace-pre-line text-sm text-gray-700">
            {selected.description}
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              disabled={!token || cartStatus === "loading"}
              onClick={onAdd}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {!token
                ? "Login to add to cart"
                : cartStatus === "loading"
                ? "Adding..."
                : "Add to cart"}
            </button>
            <Link
              to="/cart"
              className="flex-1 rounded-lg border px-4 py-2.5 text-center text-sm font-semibold hover:bg-gray-50"
            >
              Go to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

