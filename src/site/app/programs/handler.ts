
import { Request, Response } from 'express';
import { getCollection } from '../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;

        const response = await getCollection('programs', { page, limit });

        // Transform API data to match template expectation
        // Note: CMS Programs type currently lacks fundraising specific fields (goal, raised, etc.)
        // We will mock these for now to maintain UI integrity as per the template design
        const programs = response.data.entries.map((entry: any) => ({
            title: entry.data.name,
            slug: entry.data.slug,
            description: entry.data.excerpt || '',
            image: entry.data.thumbnail?.url || '/assets/img/thumbs/thumb-2.webp',
            category: 'Campaign', // Could be dynamic if added to schema

            // Mocked fields for UI demo purposes until schema is updated
            daysLeft: Math.floor(Math.random() * 30) + 1,
            percentComplete: Math.floor(Math.random() * 100),
            raised: '$' + (Math.floor(Math.random() * 10000) + 1000).toLocaleString(),
            goal: '$20,000',
            isActive: Math.random() > 0.5
        }));

        return {
            data: {
                data: programs
            },
            pagination: response.data.pagination,
            metadata: {
                title: 'Our Programs - Cheriven Foundation',
                description: 'Explore our active programs and campaigns.'
            }
        };
    } catch (error) {
        console.error('Failed to fetch programs:', error);
        return {
            data: { data: [] },
            metadata: { title: 'Programs - Error' }
        };
    }
}
