import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.products);
  const token = useSelector((s) => s.auth.token);
  const cartStatus = useSelector((s) => s.cart.status);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onAdd = async (id) => {
    await dispatch(addToCart(id));
  };

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
      </div>

      {status === "loading" ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
          Loading products...
        </div>
      ) : null}

      {status === "failed" ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div
            key={p._id}
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            <Link to={`/products/${p._id}`} className="block">
              <div className="aspect-[4/3] w-full bg-gray-100">
                <img
                  src={p.imageCover}
                  alt={p.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-blue-700">
                  {p.category?.name || "Category"}
                </p>
                <h2 className="mt-1 line-clamp-2 text-sm font-semibold">
                  {p.title}
                </h2>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold">{p.price} EGP</span>
                  <span className="text-xs text-gray-500">
                    ⭐ {p.ratingsAverage ?? 0} ({p.ratingsQuantity ?? 0})
                  </span>
                </div>
              </div>
            </Link>

            <div className="border-t p-4">
              <button
                disabled={!token || cartStatus === "loading"}
                onClick={() => onAdd(p._id)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {!token
                  ? "Login to add to cart"
                  : cartStatus === "loading"
                  ? "Adding..."
                  : "Add to cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

