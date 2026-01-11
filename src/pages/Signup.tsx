import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Footer } from "../components/Footer";
import { useRegisterMutation } from "../store/api";
import { setCredentials } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";
import { trackPageView, trackEvent, trackException } from "../utils/telemetry";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    password: "",
    confirmPassword: "",
    artistType: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading: loading }] = useRegisterMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    trackPageView("Signup");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const startTime = Date.now();
    try {
      const { name, handle, email, password, artistType } = formData;
      const result = await register({
        name,
        handle,
        email,
        password,
        artistType,
      }).unwrap();
      const duration = Date.now() - startTime;

      dispatch(setCredentials({ user: result.user, token: result.token }));

      // Track successful registration
      trackEvent("UserRegister", {
        userId: result.user.id,
        email: result.user.email,
        artistType: result.user.artistType,
        duration,
        success: true,
      });

      navigate("/feed");
    } catch (err: unknown) {
      const duration = Date.now() - startTime;
      const errorMessage =
        (err as { data?: { error?: string }; message?: string })?.data?.error ||
        (err as { message?: string })?.message ||
        "Failed to create account. Please try again.";

      // Track failed registration
      trackEvent("UserRegister", {
        email: formData.email,
        duration,
        success: false,
        error: errorMessage,
      });

      if (err instanceof Error) {
        trackException(err, { action: "register", email: formData.email });
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-indigo-600 mb-2">
                ArtShare
              </h1>
              <h2 className="text-xl font-semibold text-gray-900">
                Create your account
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Join independent artists worldwide
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="handle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Handle
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    id="handle"
                    name="handle"
                    type="text"
                    required
                    value={formData.handle}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="artistType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Artist Type
                </label>
                <select
                  id="artistType"
                  name="artistType"
                  value={formData.artistType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select type</option>
                  <option value="musician">Musician</option>
                  <option value="painter">Painter</option>
                  <option value="photographer">Photographer</option>
                  <option value="videographer">Videographer</option>
                  <option value="digital-artist">Digital Artist</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center text-sm">
                <input type="checkbox" id="terms" required className="mr-2" />
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60 transition-colors font-medium"
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
