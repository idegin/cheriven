
import { Request, Response } from 'express';
import { getCollection } from '../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const search = req.query.search as string || '';

        const response = await getCollection('blog', { page, limit, search, sort: '-createdAt' });

        const blogs = response.data.entries.map((entry: any) =>
        {
            const dateObj = new Date(entry.createdAt);
            return {
                title: entry.data.name,
                slug: entry.data.slug,
                image: entry.data.thumbnail?.url || '/assets/img/thumbs/thumb-9.webp',
                date: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                day: dateObj.getDate(),
                month: dateObj.toLocaleString('default', { month: 'short' }),
                excerpt: entry.data.excerpt || '',
                category: entry.data.category?.data?.name || 'Uncategorized',
                author: 'Admin'
            };
        });


        return {
            data: {
                data: blogs
            },
            pagination: response.data.pagination,
            metadata: {
                title: 'Blog - Cheriven Foundation',
                description: 'Latest news and updates from Cheriven Foundation.'
            }
        };
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return {
            data: { data: [] },
            metadata: {
                title: 'Blog - Cheriven Foundation',
                description: 'Latest news and updates.'
            }
        };
    }
}
