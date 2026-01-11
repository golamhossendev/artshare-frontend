import type { User } from "../types";

interface RightRailProps {
  user: User | null;
}

export const RightRail = ({ user }: RightRailProps) => {
  return (
    <div className="sticky top-6 space-y-4">
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="font-medium text-gray-900 mb-2">About</div>
        <div className="text-sm text-gray-600">
          ArtShare helps independent artists showcase images and short videos, discover collaborators
          and build portfolios.
        </div>
      </div>
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="font-medium text-gray-900 mb-2">Tips</div>
        <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
          <li>Use tags to improve discoverability</li>
          <li>Upload high-quality thumbnails</li>
          <li>Share across social networks</li>
        </ul>
      </div>
      {user && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
          <div className="font-medium text-indigo-900 mb-1">Premium Features</div>
          <div className="text-sm text-indigo-700">
            Upgrade for better analytics, storage, and promotion credits.
          </div>
        </div>
      )}
    </div>
  );
};

