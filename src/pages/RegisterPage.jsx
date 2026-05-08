import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../features/auth/authSlice";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(6, "Please confirm your password"),
    phone: z
      .string()
      .min(8, "Phone is required")
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),
  })
  .refine((v) => v.password === v.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
  });

  useEffect(() => {
    if (token) navigate("/products");
  }, [token, navigate]);

  const onSubmit = async (values) => {
    const res = await dispatch(signup(values));
    if (signup.fulfilled.match(res)) navigate("/products");
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Create account</h1>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            {...register("name")}
            placeholder="Your name"
          />
          {errors.name?.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

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

        <div>
          <label className="mb-1 block text-sm font-medium">
            Confirm password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            {...register("rePassword")}
            placeholder="••••••"
          />
          {errors.rePassword?.message ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.rePassword.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            {...register("phone")}
            placeholder="+20..."
          />
          {errors.phone?.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          ) : null}
        </div>

        <button
          disabled={status === "loading"}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link className="font-semibold text-blue-700 hover:underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

