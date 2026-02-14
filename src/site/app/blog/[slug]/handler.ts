
import { Request, Response } from 'express';
import { getEntryBySlug, getCollection } from '../../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    const slug = Array.isArray(req.params.slug) ? req.params.slug[ 0 ] : req.params.slug;

    try {
        const entry = await getEntryBySlug('blog', slug);

        if (!entry) {
            return {
                data: { data: {} },
                metadata: { title: 'Post Not Found' }
            };
        }

        // Map CMS data to template structure
        const blogPost = {
            title: entry.name,
            content: entry.content || '',
            image: entry.thumbnail?.url || '/assets/img/thumbs/thumb-9.webp',
            date: new Date().toLocaleDateString(), // CreatedAt missing in returned data from getEntryBySlug wrapper as typed, usually comes in meta. For now using current or need to update getEntryBySlug to return meta too.
            author: 'Admin',
            category: entry.category?.data?.name || 'Uncategorized',
            comments: 0 // Placeholder
        };

        // Fetch additional data for sidebar: categories and recent posts
        const [ categoriesResponse, recentPostsResponse ] = await Promise.all([
            getCollection('category', { limit: 10 }), // Ensure correct slug for category collection
            getCollection('blog', { limit: 3, sort: '-createdAt' })
        ]);

        const categories = categoriesResponse.data.entries.map((c: any) => ({
            name: c.data.name,
            slug: c.data.slug
        }));

        const recentPosts = recentPostsResponse.data.entries
            .filter((p: any) => p.data.slug !== slug) // Exclude current post
            .slice(0, 3)
            .map((p: any) =>
            {
                const d = new Date(p.createdAt);
                return {
                    title: p.data.name,
                    slug: p.data.slug,
                    image: p.data.thumbnail?.url || '/assets/img/thumbs/thumb-9.webp',
                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                };
            });

        return {
            data: {
                data: blogPost,
                sidebar: {
                    categories,
                    recentPosts
                }
            },
            metadata: {
                title: `${blogPost.title} - Blog`,
                description: entry.excerpt || ''
            }
        };
    } catch (error) {
    }
}
