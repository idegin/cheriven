import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
    return {
        data: {
            heading: 'Cheriven',
            subHeading: 'Cheriven empowerment foundation is a Nigeria Non-profit, Non-religious, Non-political Organization founded by kind hearted people to give hope to the less privileged and vulnerable in the society.'
        },
        metadata: {
            title: 'Cheriven Foundation',
            description: 'Cheriven empowerment foundation is a Nigeria Non-profit, Non-religious, Non-political Organization founded by kind hearted people to give hope to the less privileged and vulnerable in the society.'
        }
    };
}