
import { Request, Response } from 'express';
import { getCollection } from '../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;

        // Fetch gallery items
        const response = await getCollection('gallery', { page, limit });

        // Transform
        const galleryItems = response.data.entries.map((entry: any, index: number) => ({
            number: String((page - 1) * limit + index + 1).padStart(2, '0'),
            title: entry.data.name,
            description: entry.data.excerpt || '',
            image: entry.data.thumbnail?.url || '/assets/img/thumbs/thumb-69.webp',
            slug: entry.data.slug,
            category: 'Gallery'
        }));




        return {
            data: {
                data: galleryItems
            },
            pagination: response.data.pagination,
            metadata: {
                title: 'Gallery - Cheriven Foundation',
                description: 'Our moments captured.'
            }
        };
    } catch (error) {
        console.error('Failed to fetch gallery:', error);
        return {
            data: [],
            metadata: { title: 'Gallery', description: 'Our moments' }
        };
    }
}
