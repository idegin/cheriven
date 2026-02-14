import { Request, Response } from 'express';
import { getEntryBySlug, getCollection } from '../../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    const slug = Array.isArray(req.params.slug) ? req.params.slug[ 0 ] : req.params.slug;

    try {
        const entry = await getEntryBySlug('programs', slug);

        if (!entry) {
            return {
                data: { data: {} },
                metadata: { title: 'Program Not Found' }
            };
        }

        const program = {
            title: entry.name,
            description: entry.excerpt || '', // Used as short description
            aboutText: entry.content || '', // Used as main content
            image: entry.thumbnail?.url || '/assets/img/thumbs/thumb-114.webp',
            organizer: entry.organizer?.data ? {
                name: entry.organizer.data.name,
                image: entry.organizer.data.avatar?.url || '/assets/img/thumbs/thumb-120.webp',
                role: entry.organizer.data.role || 'Program Organizer'
            } : null
        };

        // Fetch recent programs
        const recentProgramsResponse = await getCollection('programs', { limit: 3, sort: '-createdAt' });
        const recentPrograms = recentProgramsResponse.data.entries
            .filter((p: any) => p.data.slug !== slug)
            .slice(0, 3)
            .map((p: any) => ({
                title: p.data.name,
                slug: p.data.slug,
                image: p.data.thumbnail?.url || '/assets/img/thumbs/thumb-2.webp',
                date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }));

        return {
            data: {
                data: {
                    ...program,
                    sidebar: {
                        recentPrograms
                    }
                }
            },
            metadata: {
                title: `${program.title} - Program Details`,
                description: program.description
            }
        };
    } catch (error) {
        console.error("Error fetching program:", error);
        return {
            data: { data: {} },
            metadata: { title: 'Error' }
        };
    }
}
