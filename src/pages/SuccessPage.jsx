import { Link, useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [params] = useSearchParams();
  const message = params.get("message");

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Done</h1>
      <p className="mt-2 text-sm text-gray-700">
        {message || "If you completed payment, you can now return to products."}
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          to="/products"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to products
        </Link>
        <Link
          to="/cart"
          className="flex-1 rounded-lg border px-4 py-2.5 text-center text-sm font-semibold hover:bg-gray-50"
        >
          Go to cart
        </Link>
      </div>
    </div>
  );
}

