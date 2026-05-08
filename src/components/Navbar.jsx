import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { resetCartState } from "../features/cart/cartSlice";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded px-3 py-2 text-sm font-medium ${
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);
  const googleUser = useSelector((s) => s.auth.googleUser);
  const numOfCartItems = useSelector((s) => s.cart.numOfCartItems);

  const name = user?.name || googleUser?.name || "";
  const isSignedIn = Boolean(user || googleUser);

  const onLogout = async () => {
    await dispatch(logout());
    dispatch(resetCartState());
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/products" className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-700">Shopless</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <NavItem to="/products">Products</NavItem>
            {token && <NavItem to="/cart">Cart ({numOfCartItems})</NavItem>}
          </div>

          {!isSignedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-600 sm:inline">
                Hi, <span className="font-semibold">{name}</span>
              </span>
              <button
                onClick={onLogout}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

