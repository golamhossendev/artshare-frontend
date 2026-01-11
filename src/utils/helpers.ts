import { formatDistanceToNow } from "date-fns";
import type { MediaItem } from "../types";

export const timeAgo = (ts: string | undefined): string => {
  if (!ts) return "just now";
  try {
    return formatDistanceToNow(new Date(ts), { addSuffix: true });
  } catch {
    return "recently";
  }
};

export const sampleMedia = (): MediaItem[] => {
  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
      <rect width="100%" height="100%" fill="#f3f4f6" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="24">ArtShare Preview</text>
    </svg>
  `);

  return [
    {
      id: "1",
      title: "Nocturne - Short Performance",
      description: "Short behind-the-scenes of a musical piece.",
      tags: ["music", "performance"],
      type: "video",
      thumb: placeholder,
      author: { name: "Maya Rao", handle: "@maya" },
      uploadedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Abstract Sunrise",
      description: "Oil on canvas - 2024",
      tags: ["painting", "abstract"],
      type: "image",
      thumb: placeholder,
      author: { name: "Arjun Das", handle: "@arjun" },
      uploadedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    },
  ];
};

