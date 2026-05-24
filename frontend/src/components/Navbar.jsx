import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  const linkClass = (path) =>
    `block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  const navLinks = (
    <>
      <Link to="/" className={linkClass('/')} onClick={closeMenu}>
        Home
      </Link>
      <Link to="/cart" className={linkClass('/cart')} onClick={closeMenu}>
        Cart ({cartItems.length})
      </Link>

      {user ? (
        <>
          <Link to="/profile" className={linkClass('/profile')} onClick={closeMenu}>
            Hi, {user.name?.split(' ')[0] || 'Profile'}
          </Link>
          <Link to="/order-history" className={linkClass('/order-history')} onClick={closeMenu}>
            Orders
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="block py-2 px-3 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              onClick={closeMenu}
            >
              Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={linkClass('/login')} onClick={closeMenu}>
            Login
          </Link>
          <Link
            to="/register"
            className="block py-2 px-3 rounded-lg text-sm font-semibold text-center bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={closeMenu}
          >
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold text-indigo-600 shrink-0"
            onClick={closeMenu}
          >
            FashionAI
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                location.pathname === '/' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/cart"
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                location.pathname === '/cart' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Cart ({cartItems.length})
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === '/profile' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Hi, {user.name?.split(' ')[0]}
                </Link>
                <Link
                  to="/order-history"
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === '/order-history' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => dispatch(logout())}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: cart shortcut + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label={`Cart, ${cartItems.length} items`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={closeMenu}
            aria-label="Close menu overlay"
          />
          <div className="md:hidden absolute left-0 right-0 top-16 z-50 bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navLinks}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
