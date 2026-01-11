export interface User {
  id?: string;
  name: string;
  handle: string;
  email?: string;
  artistType?: string;
  contact?: string;
  socialLinks?: Record<string, string>;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: "image" | "video";
  thumb: string;
  author: User;
  uploadedAt: string;
  blobUri?: string;
  duration?: number;
  visibility?: "public" | "private";
}

export interface Portfolio {
  artistId: string;
  collectionIds?: string[];
  visibility: "public" | "private";
  featuredItems?: string[];
}

