import { useState, useEffect } from "react";
import { MediaCard } from "../components/MediaCard";
import { useSearchQuery, useGetTrendingQuery } from "../store/api";
import { trackPageView } from "../utils/telemetry";

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    trackPageView('Explore');
  }, []);
  
  const { data: trendingData, isLoading: loadingTrending } = useGetTrendingQuery(undefined, {
    skip: !!searchQuery,
  });
  
  const { data: searchData, isLoading: loadingSearch } = useSearchQuery(searchQuery, {
    skip: !searchQuery,
  });

  const tags = trendingData?.tags || [];
  const media = searchQuery ? (searchData?.media || []) : (trendingData?.media || []);
  const loading = searchQuery ? loadingSearch : loadingTrending;

  return (
    <div>
      <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
        <div className="font-medium text-gray-900 mb-3">Trending Tags</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by tags, artist name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          Loading...
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          No media to explore yet.
        </div>
      ) : (
        <div className="space-y-4">
          {media.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </div>
  );
};

