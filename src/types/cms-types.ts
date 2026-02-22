/**
 * Auto-generated Documentation for Cheriven Foundation CMS
 * Generated at: 2026-02-15T21:43:05.647Z
 */

export const IDEGIN_CLOUD_SECRET_KEY = process.env.IDEGIN_CLOUD_SECRET_KEY;
export const IDEGIN_CLOUD_BASE_URL = "https://idegin-cloud-backend.fly.dev/api/v1";

export type CMSFile = {
    id: string;
    filename: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
};

export type PopulatedRelatedEntry<T = Record<string, unknown>> = {
    id: string;
    data: T;
};

export type CMSEntryMeta = {
    id: string;
    createdAt: string;
    updatedAt: string;
};

export type CMSPagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type CMSListResponse<T> = {
    success: boolean;
    message: string;
    data: {
        entries: (CMSEntryMeta & { data: T; })[];
        pagination: CMSPagination;
    };
};

export type CMSSingleResponse<T> = {
    success: boolean;
    message: string;
    data: CMSEntryMeta & { data: T; };
};

export type CMSCountResponse = {
    success: boolean;
    message: string;
    data: { count: number; };
};

export type CMSUpdateResponse<T> = CMSSingleResponse<T>;

export type CollectionSlug = "blog" | "people" | "category" | "gallery" | "programs" | "reviews";

export type Blog = {
    name: string;
    slug: string;
    thumbnail: CMSFile;
    category: PopulatedRelatedEntry<Category>;
    excerpt: string;
    content: string;
};

export type People = {
    name: string;
    slug: string;
    avatar: CMSFile;
    bio: string;
    linkedin_url: string;
    role: string;
};

export type Category = {
    name: string;
    slug: string;
};

export type Gallery = {
    name: string;
    slug: string;
    thumbnail: CMSFile;
    excerpt: string;
    content: string;
    files: CMSFile;
};

export type Programs = {
    name: string;
    slug: string;
    thumbnail: CMSFile;
    excerpt: string;
    content: string;
    organizer: PopulatedRelatedEntry<People>;
};

export type Reviews = {
    name: string;
    slug: string;
    avatar: CMSFile;
    content: string;
    role: string;
};

export type CollectionTypeMap = {
    "blog": Blog;
    "people": People;
    "category": Category;
    "gallery": Gallery;
    "programs": Programs;
    "reviews": Reviews;
};

async function cmsRequest<T>(endpoint: string, options?: RequestInit): Promise<T>
{
    const maxRetries = 5;
    const timeout = 15000;

    for (let attempt = 1; attempt <= maxRetries; attempt++)
    {
        try
        {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${IDEGIN_CLOUD_BASE_URL}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Authorization': `Bearer ${IDEGIN_CLOUD_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok)
            {
                const error = await response.json().catch(() => ({ message: 'Request failed' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }
            return response.json();
        }
        catch (error)
        {
            if (attempt === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    throw new Error('Max retries reached');
}

export async function getAll<S extends CollectionSlug>(
    slug: S,
    options?: { page?: number; limit?: number; search?: string; }
): Promise<CMSListResponse<CollectionTypeMap[ S ]>>
{
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.search) params.set('search', options.search);
    const query = params.toString();
    return cmsRequest(`/public/cms/collections/${slug}${query ? `?${query}` : ''}`);
}

export async function getById<S extends CollectionSlug>(
    slug: S,
    id: string
): Promise<CMSSingleResponse<CollectionTypeMap[ S ]>>
{
    return cmsRequest(`/public/cms/collections/${slug}/${id}`);
}

export async function getBySlug<S extends CollectionSlug>(
    slug: S,
    entrySlug: string
): Promise<CMSSingleResponse<CollectionTypeMap[ S ]>>
{
    return cmsRequest(`/public/cms/collections/${slug}/slug/${entrySlug}`);
}

export async function getCount<S extends CollectionSlug>(slug: S): Promise<CMSCountResponse>
{
    return cmsRequest(`/public/cms/collections/${slug}/count`);
}

export async function update<S extends CollectionSlug>(
    slug: S,
    id: string,
    data: Partial<CollectionTypeMap[ S ]>
): Promise<CMSUpdateResponse<CollectionTypeMap[ S ]>>
{
    return cmsRequest(`/public/cms/collections/${slug}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/*
================================================================================
                           API QUERY EXAMPLES
================================================================================

Base URL: https://idegin-cloud-backend.fly.dev/api/v1/public/cms
All requests require the Authorization header: Bearer <SECRET_KEY>

--------------------------------------------------------------------------------
                              BASIC QUERIES
--------------------------------------------------------------------------------

# Get all entries with pagination
GET /collections/blog?page=1&limit=10

# Search entries
GET /collections/blog?search=hello&searchFields=name

# Get entry by ID
GET /collections/blog/entry-id-here

# Get entry by slug
GET /collections/blog/slug/my-entry-slug

# Get entry count
GET /collections/blog/count

--------------------------------------------------------------------------------
                              FILTERING
--------------------------------------------------------------------------------

# Filter operators: eq, ne, gt, gte, lt, lte, in, nin, contains, startsWith, endsWith

# Exact match
GET /collections/blog?filter[name][eq]=Hello World

# Not equal
GET /collections/blog?filter[status][ne]=draft

# Greater than / Less than (for numbers and dates)
GET /collections/blog?filter[price][gte]=100&filter[price][lte]=500

# Contains (partial match)
GET /collections/blog?filter[name][contains]=keyword

# Starts with / Ends with
GET /collections/blog?filter[name][startsWith]=Hello
GET /collections/blog?filter[name][endsWith]=World

# In list (comma-separated values)
GET /collections/blog?filter[status][in]=published,featured

# Not in list
GET /collections/blog?filter[status][nin]=draft,archived

# Multiple filters (AND logic)
GET /collections/blog?filter[status][eq]=published&filter[price][gte]=50

# Count with filters
GET /collections/blog/count?filter[status][eq]=published

--------------------------------------------------------------------------------
                              SORTING
--------------------------------------------------------------------------------

# Sort ascending
GET /collections/blog?sort=name

# Sort descending (prefix with -)
GET /collections/blog?sort=-createdAt

# Multiple sort fields (comma-separated)
GET /collections/blog?sort=-featured,name

--------------------------------------------------------------------------------
                           FIELD SELECTION
--------------------------------------------------------------------------------

# Select specific fields only (comma-separated)
GET /collections/blog?fields=name,slug,createdAt

# Combine with filtering and sorting
GET /collections/blog?filter[status][eq]=published&sort=-createdAt&fields=name,slug

--------------------------------------------------------------------------------
                          POPULATE CONTROL
--------------------------------------------------------------------------------

# By default, all relationship fields are populated

# Populate specific relationships only (comma-separated)
GET /collections/blog?populate=category

# Populate with field selection for related data
GET /collections/blog?populate[category]=name,slug

# Multiple relationships with field selection
GET /collections/blog?populate[category]=name&populate[author]=name,avatar

# Control populate depth
GET /collections/blog?populateDepth=2

--------------------------------------------------------------------------------
                            AGGREGATION
--------------------------------------------------------------------------------

# Count related entries (e.g., count posts per category)
GET /collections/categories?countRelation=blog&relationField=category

# Group by field with count
GET /collections/blog?groupBy=status

# Group by with aggregations
GET /collections/blog?groupBy=category&aggregate[views]=sum&aggregate[price]=avg

# Available aggregations: count, sum, avg, min, max

--------------------------------------------------------------------------------
                          DISTINCT VALUES
--------------------------------------------------------------------------------

# Get distinct values for a field
GET /collections/blog/distinct/status

GET /collections/blog/distinct/name

--------------------------------------------------------------------------------
                         COMPLETE EXAMPLES
--------------------------------------------------------------------------------

# Example 1: Blog listing with filters, sort, and field selection
GET /collections/blog?filter[status][eq]=published&sort=-createdAt&fields=name,slug,excerpt&page=1&limit=10

# Example 2: Search with pagination
GET /collections/blog?search=typescript&searchFields=name,content&page=1&limit=20

# Example 3: Related entries with selective population
GET /collections/blog?populate[category]=name,slug&populate[author]=name,avatar&fields=name,slug,category,author

# Example 4: Categories with post counts
GET /collections/categories?countRelation=blog&relationField=category

# Example 5: Entries in date range
GET /collections/blog?filter[createdAt][gte]=2024-01-01&filter[createdAt][lte]=2024-12-31&sort=-createdAt

================================================================================
*/
