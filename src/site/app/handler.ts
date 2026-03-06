import { Request, Response } from 'express';
import { getAll } from '../../types/cms-types';

export default async function handler(req: Request, res: Response)
{
    let programs: any = { success: false };
    let volunteers: any = { success: false };
    let blogs: any = { success: false };
    let reviews: any = { success: false };
    let events: any = { success: false };

    try {
        [ programs, volunteers, blogs, reviews, events ] = await Promise.all([
            getAll('programs', { limit: 6 }),
            getAll('people', { limit: 4 }),
            getAll('blog', { limit: 6 }),
            getAll('reviews', { limit: 6 }),
            getAll('events', { limit: 4 })
        ]);
    } catch (error) {
        console.error('Failed to fetch home page data:', error);
    }

    return {
        data: {
            heading: 'Cheriven',
            subHeading: 'Cheriven empowerment foundation is a Nigeria Non-profit, Non-religious, Non-political Organization founded by kind hearted people to give hope to the less privileged and vulnerable in the society.',
            programs: programs.success ? programs.data.entries : [],
            volunteers: volunteers.success ? volunteers.data.entries : [],
            blogs: blogs.success ? blogs.data.entries : [],
            reviews: reviews.success ? reviews.data.entries : [],
            events: events.success ? events.data.entries : []
        },
        metadata: {
            title: 'Cheriven Foundation',
            description: 'Cheriven empowerment foundation is a Nigeria Non-profit, Non-religious, Non-political Organization founded by kind hearted people to give hope to the less privileged and vulnerable in the society.'
        }
    };
}
