
import { Request, Response } from 'express';
import { getCollection } from '../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    try {
        const response = await getCollection('people');


        // Transform API data to match template expectation
        // Explicitly typing entry for clarity, though TS should infer it from getCollection<'people'>
        const volunteers = response.data.entries.map((entry: any) => ({
            name: entry.data.name,
            role: entry.data.bio ? (entry.data.bio.substring(0, 30) + '...') : 'Volunteer',
            image: entry.data.avatar?.url || '/assets/img/thumbs/thumb-17.webp',
            description: entry.data.bio || '',
            slug: entry.data.slug
        }));



        return {
            data: {
                data: volunteers
            },
            metadata: {
                title: 'Volunteers - Cheriven Foundation',
                description: 'Meet our dedicated team of volunteers.'
            }
        };
    } catch (error) {
        console.error('Failed to fetch volunteers:', error);
        // Fallback or empty state
        return {
            data: [], // Empty array or fallback mock data
            metadata: {
                title: 'Volunteers - Cheriven Foundation',
                description: 'Meet our dedicated team of volunteers.'
            }
        };
    }
}
