import { Link, useNavigate } from "react-router";
import type { User } from "../types";
import { SearchBox } from "./SearchBox";
import { logout } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface HeaderProps {
  user: User | null;
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const displayUser = user || authUser;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              ArtShare
            </Link>
            <nav className="hidden md:flex space-x-1">
              <Link
                to="/feed"
                className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Feed
              </Link>
              <Link
                to="/explore"
                className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Explore
              </Link>
              {displayUser && (
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Profile
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBox />
            {displayUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/feed")}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Upload
                </button>
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
                    {displayUser.name[0].toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-700">{displayUser.handle}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

