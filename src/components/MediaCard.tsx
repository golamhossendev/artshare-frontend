import { useState } from "react";
import { timeAgo } from "../utils/helpers";
import { useAppSelector } from "../store/hooks";
import { EditMediaModal } from "./EditMediaModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { MediaItem } from "../types";

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard = ({ item }: MediaCardProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isOwner = currentUser?.id === item.author?.id;

  return (
    <>
      <article className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="md:flex">
          <div className="md:w-1/3 bg-black flex items-center justify-center min-h-[200px]">
            {item.type === "video" ? (
              <video
                src={item.thumb}
                controls
                className="w-full h-full object-cover"
                preload="metadata"
              />
            ) : (
              <img
                src={item.thumb}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          <div className="p-4 md:w-2/3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h3>
                <div className="text-sm text-gray-500">
                  by {item.author?.name || "Unknown"} • {timeAgo(item.uploadedAt)}
                </div>
              </div>
              {isOwner && (
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-700 line-clamp-2">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {(item.tags || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                Like
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                Comment
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                Share
              </button>
            </div>
          </div>
        </div>
      </article>

      {isEditOpen && (
        <EditMediaModal media={item} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      )}

      {isDeleteOpen && (
        <DeleteConfirmModal
          media={item}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </>
  );
};

