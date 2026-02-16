import { Request, Response } from 'express';
import { getCollection } from '../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    try {
        // Fetch recent programs from CMS
        const recentProgramsResponse = await getCollection('programs', { limit: 6, sort: '-createdAt' });

        const recentPrograms = recentProgramsResponse.data.entries.map((p: any) =>
        {
            // Calculate a random percentage for demonstration or use a field if available
            // Since the CMS type 'Programs' doesn't seem to have funding goals, we'll mock these for now
            // or use what we have.
            const raised = 9650;
            const goal = 16560;
            const percentage = Math.round((raised / goal) * 100);

            return {
                title: p.data.name,
                slug: p.data.slug,
                image: p.data.thumbnail?.url || '/assets/img/thumbs/thumb-2.webp',
                excerpt: p.data.excerpt || '',
                date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                // Mocking specific donation fields as they are not in the CMS type definition yet
                raised: raised.toLocaleString(),
                goal: goal.toLocaleString(),
                percentage: percentage,
                progressStyle: `width: ${percentage}%`, // pre-calculated style string for EJS
                daysLeft: 42 // Mock value
            };
        });

        // Check for program query parameter
        let selectedProgram = null;
        const programSlug = req.query.program as string;

        if (programSlug) {
            try {
                const programResponse = await getCollection('programs', {
                    limit: 1,
                    filter: { slug: programSlug }
                });

                if (programResponse.data.entries.length > 0) {
                    const p = programResponse.data.entries[ 0 ];
                    selectedProgram = {
                        title: p.data.name,
                        slug: p.data.slug,
                        image: p.data.thumbnail?.url
                    };
                }
            } catch (err) {
                console.warn('Failed to fetch selected program:', err);
                // Continue without selected program if fetch fails
            }
        }

        return {
            data: {
                recentPrograms,
                selectedProgram
            },
            metadata: {
                title: selectedProgram ? `Donate to ${selectedProgram.title} - Cheriven Foundation` : 'Make a Donation - Support Our Causes',
                description: 'Your donation helps us support vulnerable communities.'
            }
        };
    } catch (error) {
        console.error("Error fetching donation page data:", error);
        return {
            data: { recentPrograms: [] },
            metadata: { title: 'Donations' }
        };
    }
}
