import { Request, Response } from 'express';
import { getAll } from '../../types/cms-types';

export default async function handler(req: Request, res: Response)
{
    const [ programs, volunteers, blogs ] = await Promise.all([
        getAll('programs', { limit: 6 }), // Sorting removed as API might not support it yet or needs specific syntax
        getAll('people', { limit: 4 }),
        getAll('blog', { limit: 6 })
    ]);

    return {
        data: {
            heading: 'Cheriven',
            subHeading: 'Cheriven empowerment foundation is a Nigeria Non-profit, Non-religious, Non-political Organization founded by kind hearted people to give hope to the less privileged and vulnerable in the society.',
            programs: programs.success ? programs.data.entries : [],
            volunteers: volunteers.success ? volunteers.data.entries : [],
            blogs: blogs.success ? blogs.data.entries : []
        },
        metadata: {
            title: 'Cheriven Foundation',
            description: 'Cheriven empowerment foundation is a Nigeria Non-profit, Non-religious, Non-political Organization founded by kind hearted people to give hope to the less privileged and vulnerable in the society.'
        }
    };
}
