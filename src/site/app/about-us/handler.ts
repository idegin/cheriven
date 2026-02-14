import { Request, Response } from 'express';
import { getAll } from '../../../types/cms-types';

export default async function handler(req: Request, res: Response)
{
    const volunteers = await getAll('people', { limit: 10 });

    return {
        data: {
            volunteers: volunteers.success ? volunteers.data.entries : []
        },
        metadata: {
            title: 'About Us - Cheriven Foundation',
            description: 'Learn more about Cheriven Empowerment Foundation, our mission, vision, and the team behind our impact.'
        }
    };
}
