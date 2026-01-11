import { useDeleteMediaMutation } from "../store/api";
import { trackEvent, trackException } from "../utils/telemetry";
import { useAppSelector } from "../store/hooks";
import type { MediaItem } from "../types";

interface DeleteConfirmModalProps {
  media: MediaItem;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteConfirmModal = ({ media, isOpen, onClose }: DeleteConfirmModalProps) => {
  const [deleteMedia, { isLoading: loading }] = useDeleteMediaMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleDelete = async () => {
    const startTime = Date.now();
    try {
      await deleteMedia(media.id).unwrap();
      const duration = Date.now() - startTime;

      // Track successful delete
      trackEvent('MediaDelete', {
        mediaId: media.id,
        userId: user?.id,
        title: media.title,
        type: media.type,
        duration,
        success: true,
      });

      onClose();
    } catch (err: any) {
      const duration = Date.now() - startTime;
      const errorMessage = err?.data?.error || err?.message || "Failed to delete media.";
      
      // Track failed delete
      trackEvent('MediaDelete', {
        mediaId: media.id,
        userId: user?.id,
        duration,
        success: false,
        error: errorMessage,
      });

      if (err instanceof Error) {
        trackException(err, { action: 'delete', mediaId: media.id });
      }

      console.error("Failed to delete media:", err);
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Media</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{media.title}"? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

