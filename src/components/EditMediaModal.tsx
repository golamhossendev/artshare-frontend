import { useState, useEffect } from "react";
import type { MediaItem } from "../types";
import { useUpdateMediaMutation } from "../store/api";
import { trackEvent, trackException } from "../utils/telemetry";
import { useAppSelector } from "../store/hooks";

interface EditMediaModalProps {
  media: MediaItem;
  isOpen: boolean;
  onClose: () => void;
}

export const EditMediaModal = ({ media, isOpen, onClose }: EditMediaModalProps) => {
  const [title, setTitle] = useState(media.title);
  const [description, setDescription] = useState(media.description);
  const [tags, setTags] = useState(media.tags.join(", "));
  const [visibility, setVisibility] = useState<"public" | "private">(media.visibility || "public");
  const [error, setError] = useState("");
  const [updateMedia, { isLoading: loading }] = useUpdateMediaMutation();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid synchronous state updates in effect
      setTimeout(() => {
        setTitle(media.title);
        setDescription(media.description);
        setTags(media.tags.join(", "));
        setVisibility(media.visibility || "public");
        setError("");
      }, 0);
    }
  }, [isOpen, media]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const startTime = Date.now();
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await updateMedia({
        id: media.id,
        updates: {
          title,
          description,
          tags: tagArray,
          visibility,
        },
      }).unwrap();

      const duration = Date.now() - startTime;

      // Track successful update
      trackEvent('MediaUpdate', {
        mediaId: media.id,
        userId: user?.id,
        title,
        tagsCount: tagArray.length,
        visibility,
        duration,
        success: true,
      });

      onClose();
    } catch (err: unknown) {
      const duration = Date.now() - startTime;
      const errorMessage = (err as { data?: { error?: string }; message?: string })?.data?.error || 
                           (err as { message?: string })?.message || 
                           "Failed to update media.";
      
      // Track failed update
      trackEvent('MediaUpdate', {
        mediaId: media.id,
        userId: user?.id,
        duration,
        success: false,
        error: errorMessage,
      });

      if (err instanceof Error) {
        trackException(err, { action: 'update', mediaId: media.id });
      }

      setError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Edit Media</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                id="edit-tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <label
                htmlFor="edit-visibility"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Visibility
              </label>
              <select
                id="edit-visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60 transition-colors"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

