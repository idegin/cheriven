
import { CMSListResponse, CMSSingleResponse, CollectionSlug, CollectionTypeMap, IDEGIN_CLOUD_BASE_URL, IDEGIN_CLOUD_SECRET_KEY } from '../types/cms-types';

async function cmsRequest<T>(endpoint: string, options?: RequestInit): Promise<T>
{
    const maxRetries = 5;
    const timeout = 15000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${IDEGIN_CLOUD_BASE_URL}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Authorization': `Bearer ${IDEGIN_CLOUD_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                    ...(options?.headers || {}),
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new Error(`CMS Request Failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.json();
        }
        catch (error) {
            if (attempt === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    throw new Error('Max retries reached');
}

/**
 * Validated wrapper around getAll to make it easier to reuse.
 * Note: 'search' query param is supported by the backend if needed.
 */
export async function getCollection<S extends CollectionSlug>(
    slug: S,
    query?: { page?: number; limit?: number; sort?: string; filter?: Record<string, any>; populate?: any; search?: string; }
): Promise<CMSListResponse<CollectionTypeMap[ S ]>>
{
    const params = new URLSearchParams();
    if (query?.page) params.set('page', query.page.toString());
    if (query?.limit) params.set('limit', query.limit.toString());
    if (query?.sort) params.set('sort', query.sort);
    if (query?.search) params.set('search', query.search);

    // Add simple filters if provided (e.g., filter[slug][eq]=xyz)
    if (query?.filter) {
        Object.entries(query.filter).forEach(([ key, val ]) =>
        {
            // This assumes simple equality or passing full filter string structure might be needed for complex queries
            // For now, let's allow constructing query strings manually or expanding this if needed.
            // A simple pass-through for now:
            if (typeof val === 'object') {
                Object.entries(val).forEach(([ op, opVal ]) =>
                {
                    params.set(`filter[${key}][${op}]`, String(opVal));
                });
            } else {
                params.set(`filter[${key}][eq]`, String(val));
            }
        });
    }

    const queryString = params.toString();
    const endpoint = `/public/cms/collections/${slug}${queryString ? `?${queryString}` : ''}`;
    return cmsRequest<CMSListResponse<CollectionTypeMap[ S ]>>(endpoint);
}

export async function getEntryBySlug<S extends CollectionSlug>(
    slug: S,
    entrySlug: string
): Promise<CollectionTypeMap[ S ] | null>
{
    const endpoint = `/public/cms/collections/${slug}/slug/${entrySlug}`;
    try {
        const res = await cmsRequest<CMSSingleResponse<CollectionTypeMap[ S ]>>(endpoint);
        if (res.success && res.data) {
            return res.data.data;
        }
    } catch (error) {
        console.error(`Error fetching entry by slug ${entrySlug}:`, error);
    }
    return null;
}
