import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginWithGoogle, signin } from "../features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, token } = useSelector((s) => s.auth);

  const from = location.state?.from || "/products";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, navigate, from]);

  const onSubmit = async (values) => {
    const res = await dispatch(signin(values));
    if (signin.fulfilled.match(res)) navigate(from, { replace: true });
  };

  const onGoogle = async () => {
    const res = await dispatch(loginWithGoogle());
    if (loginWithGoogle.fulfilled.match(res)) navigate("/products");
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Welcome back</h1>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onGoogle}
        disabled={status === "loading"}
        className="mt-4 w-full rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
      >
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            {...register("email")}
            placeholder="you@example.com"
          />
          {errors.email?.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            {...register("password")}
            placeholder="••••••"
          />
          {errors.password?.message ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <button
          disabled={status === "loading"}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        New here?{" "}
        <Link
          className="font-semibold text-blue-700 hover:underline"
          to="/register"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

