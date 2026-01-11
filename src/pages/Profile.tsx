import { useState, useEffect } from "react";
import { useUser } from "../components/Layout";
import { useGetMediaQuery } from "../store/api";
import { EditMediaModal } from "../components/EditMediaModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { trackPageView } from "../utils/telemetry";
import type { MediaItem } from "../types";

export const Profile = () => {
  const { user } = useUser();
  const { data: media = [], isLoading: loading, error: queryError } = useGetMediaQuery(
    { artistId: user?.id || '' },
    { skip: !user?.id }
  );
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    trackPageView('Profile');
  }, []);

  const error = queryError ? ('data' in queryError ? (queryError.data as { error?: string })?.error : 'Failed to load profile') : '';

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl font-semibold text-white">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">Portfolio • {loading ? "..." : media.length} items</div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading profile...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((m) => (
              <div
                key={m.id}
                className="bg-white border rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className="relative">
                  <img
                    src={m.thumb}
                    alt={m.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={() => setEditingMedia(m)}
                      className="p-1.5 bg-white bg-opacity-90 hover:bg-indigo-50 rounded text-gray-600 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeletingMedia(m)}
                      className="p-1.5 bg-white bg-opacity-90 hover:bg-red-50 rounded text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-medium text-gray-900 mb-1">{m.title}</div>
                  <div className="flex flex-wrap gap-1">
                    {(m.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingMedia && (
        <EditMediaModal
          media={editingMedia}
          isOpen={!!editingMedia}
          onClose={() => setEditingMedia(null)}
        />
      )}

      {deletingMedia && (
        <DeleteConfirmModal
          media={deletingMedia}
          isOpen={!!deletingMedia}
          onClose={() => setDeletingMedia(null)}
        />
      )}
    </>
  );
};

