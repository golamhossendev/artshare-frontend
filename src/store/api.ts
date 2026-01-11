import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, MediaItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Media', 'Portfolio'],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<
      { token: string; user: User },
      { name: string; handle: string; email: string; password: string; artistType?: string }
    >({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    login: builder.mutation<{ token: string; user: User }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Media endpoints
    uploadMedia: builder.mutation<
      MediaItem,
      { file: File; title?: string; description?: string; tags?: string[] }
    >({
      query: ({ file, title, description, tags }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);
        if (description) formData.append('description', description);
        if (tags) formData.append('tags', Array.isArray(tags) ? tags.join(',') : tags);

        return {
          url: '/media/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Media'],
    }),

    requestUpload: builder.mutation<
      { sasUrl: string; mediaId: string; blobName: string; blobUrl: string },
      { title?: string; description?: string; tags?: string[]; type: 'image' | 'video' }
    >({
      query: (data) => ({
        url: '/media/request-upload',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Media'],
    }),

    createMedia: builder.mutation<MediaItem, Partial<MediaItem>>({
      query: (data) => ({
        url: '/media',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Media'],
    }),

    getMedia: builder.query<MediaItem[], { artistId?: string; limit?: number; offset?: number }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.artistId) queryParams.append('artistId', params.artistId);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
        return {
          url: `/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        };
      },
      providesTags: ['Media'],
    }),

    getMediaById: builder.query<MediaItem, { id: string; artistId: string }>({
      query: ({ id, artistId }) => ({
        url: `/media/${id}?artistId=${artistId}`,
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Media', id }],
    }),

    updateMedia: builder.mutation<MediaItem, { id: string; updates: Partial<MediaItem> }>({
      query: ({ id, updates }) => ({
        url: `/media/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Media'],
    }),

    deleteMedia: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),

    // User endpoints
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Discovery endpoints
    search: builder.query<{ media: MediaItem[]; users: User[] }, string>({
      query: (query) => ({
        url: `/discovery/search?q=${encodeURIComponent(query)}`,
      }),
    }),

    getTrending: builder.query<{ tags: string[]; media: MediaItem[] }, void>({
      query: () => ({
        url: '/discovery/trending',
      }),
    }),

    // Moderation endpoints
    flagContent: builder.mutation<
      { id: string; mediaId: string; reporterId: string; reason: string; status: string },
      { mediaId: string; reason: string }
    >({
      query: (data) => ({
        url: '/moderation/flag',
        method: 'POST',
        body: data,
      }),
    }),

    // Portfolio endpoints
    getPortfolio: builder.query<any, string>({
      query: (artistId) => ({
        url: `/portfolios/${artistId}`,
      }),
      providesTags: (_result, _error, artistId) => [{ type: 'Portfolio', id: artistId }],
    }),

    updatePortfolio: builder.mutation<any, { artistId: string; updates: any }>({
      query: ({ artistId, updates }) => ({
        url: `/portfolios/${artistId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { artistId }) => [{ type: 'Portfolio', id: artistId }],
    }),

    // Application Insights status endpoint
    getInsightsStatus: builder.query<{
      status: string;
      applicationInsights: {
        configured: boolean;
        initialized: boolean;
        connectionString: string | null;
        enabledFeatures: {
          autoDependencyCorrelation: boolean;
          autoCollectRequests: boolean;
          autoCollectPerformance: boolean;
          autoCollectExceptions: boolean;
          autoCollectDependencies: boolean;
          autoCollectConsole: boolean;
          useDiskRetryCaching: boolean;
          sendLiveMetrics: boolean;
        };
        cloudRole: string | null;
        cloudRoleInstance: string | null;
      };
      timestamp: string;
    }, void>({
      query: () => ({
        url: '/insights/status',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUploadMediaMutation,
  useRequestUploadMutation,
  useCreateMediaMutation,
  useGetMediaQuery,
  useGetMediaByIdQuery,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
  useGetUserQuery,
  useSearchQuery,
  useGetTrendingQuery,
  useFlagContentMutation,
  useGetPortfolioQuery,
  useUpdatePortfolioMutation,
  useGetInsightsStatusQuery,
} = apiSlice;

