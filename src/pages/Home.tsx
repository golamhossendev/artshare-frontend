import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header user={null} />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Showcase Your Art to the World
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          ArtShare helps independent artists showcase images and videos, discover collaborators, and
          build professional portfolios.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
          >
            Get Started
          </Link>
          <Link
            to="/feed"
            className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-lg"
          >
            Explore Feed
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Portfolio Pages</h3>
            <p className="text-sm text-gray-600">
              Create beautiful portfolio pages to showcase your work
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Global Reach</h3>
            <p className="text-sm text-gray-600">
              Connect with artists and audiences worldwide
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Discover</h3>
            <p className="text-sm text-gray-600">
              Find collaborators and trending content by tags
            </p>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

