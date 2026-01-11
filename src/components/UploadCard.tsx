import { useState } from "react";
import { useUploadMediaMutation } from "../store/api";
import { trackEvent, trackException, trackMetric } from "../utils/telemetry";
import { useAppSelector } from "../store/hooks";

export const UploadCard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [uploadMedia, { isLoading: loading }] = useUploadMediaMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      trackEvent('MediaFileSelected', {
        fileName: f.name,
        fileSize: f.size,
        fileType: f.type,
        userId: user?.id,
      });
    }
  };

  const handlePublish = async () => {
    if (!file) {
      setError("Please choose an image or video file.");
      return;
    }

    setError("");

    const startTime = Date.now();
    const fileSize = file.size;
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';

    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // Upload file to backend - RTK Query will auto-refetch media list via invalidatesTags
      const result = await uploadMedia({
        file,
        title: title || file.name,
        description,
        tags: tagArray,
      }).unwrap();

      const duration = Date.now() - startTime;

      // Track successful upload
      trackEvent('MediaUpload', {
        mediaId: result.id,
        userId: user?.id,
        title: result.title,
        type: result.type,
        tagsCount: tagArray.length,
        duration,
        fileSize,
        fileType,
        success: true,
      });

      // Track upload metric
      trackMetric('MediaUploadDuration', duration, {
        type: result.type,
        fileSize,
      });
      trackMetric('MediaUploadSize', fileSize, {
        type: result.type,
      });

      // Clear form after successful upload
      setTitle("");
      setDescription("");
      setTags("");
      setFile(null);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      const errorMessage = err?.data?.error || err?.message || "Failed to upload. Please try again.";
      
      // Track failed upload
      trackEvent('MediaUpload', {
        userId: user?.id,
        title: title || file.name,
        type: fileType,
        duration,
        fileSize,
        success: false,
        error: errorMessage,
      });

      if (err instanceof Error) {
        trackException(err, { action: 'upload', fileType, fileSize });
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="text-lg font-medium mb-4 text-gray-900">Share your art</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded p-4 hover:border-indigo-400 transition-colors">
          <label className="cursor-pointer text-sm text-gray-600 text-center">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFile}
              className="hidden"
            />
            <div className="mb-2 text-2xl">📁</div>
            <div className="mb-1 font-medium">Select image or video</div>
            <div className="text-xs text-gray-500">Max 200MB</div>
          </label>
          {file && (
            <div className="text-xs mt-2 text-gray-700 font-medium truncate max-w-full">
              {file.name}
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-3 text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      <div className="mt-4 flex items-center justify-end">
        <button
          onClick={handlePublish}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60 hover:bg-indigo-700 transition-colors"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
};

