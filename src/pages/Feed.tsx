import { useEffect } from "react";
import { UploadCard } from "../components/UploadCard";
import { MediaCard } from "../components/MediaCard";
import { useGetMediaQuery } from "../store/api";
import { trackEvent, trackPageView } from "../utils/telemetry";

export const Feed = () => {
  const {
    data: mediaList,
    isLoading: loading,
    error: queryError,
  } = useGetMediaQuery({});

  useEffect(() => {
    trackPageView('Feed');
  }, []);

  useEffect(() => {
    if (mediaList && !loading) {
      trackEvent('MediaFetch', {
        count: mediaList.length,
        success: true,
      });
    }
  }, [mediaList, loading]);

  useEffect(() => {
    if (queryError) {
      trackEvent('MediaFetch', {
        success: false,
        error: 'data' in queryError ? (queryError.data as { error?: string })?.error : 'Failed to load feed',
      });
    }
  }, [queryError]);

  const error = queryError
    ? "data" in queryError
      ? (queryError.data as { error?: string })?.error
      : "Failed to load feed"
    : "";

  return (
    <div className="space-y-6">
      <UploadCard />
      {loading ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          Loading feed...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      ) : (mediaList?.length ?? 0) === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          No media yet — be the first to share.
        </div>
      ) : (
        <div className="space-y-4">
          {mediaList?.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </div>
  );
};
