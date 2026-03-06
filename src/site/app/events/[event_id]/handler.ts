import { Request, Response } from 'express';
import { getEntryBySlug, getCollection } from '../../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    const slug = Array.isArray(req.params.event_id) ? req.params.event_id[0] : req.params.event_id;

    try {
        const entry = await getEntryBySlug('events', slug);

        if (!entry) {
            return {
                data: { data: {} },
                metadata: { title: 'Event Not Found' }
            };
        }

        const eventDate = new Date(entry.date);

        const eventData = {
            title: entry.name,
            image: entry.thumbnail?.url || '/assets/img/thumbs/thumb-114.webp',
            date: eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            location: entry.location || null,
            content: entry.content || '',
            cta_text: entry.cta_text || 'Join Event',
            cta_link: entry.cta_link || '#'
        };

        const recentEventsResponse = await getCollection('events', { limit: 5, sort: '-createdAt' });

        const recentEvents = recentEventsResponse.data.entries
            .filter((e: any) => e.data.slug !== slug)
            .slice(0, 4)
            .map((e: any) =>
            {
                const d = new Date(e.data.date);
                return {
                    title: e.data.name,
                    slug: e.data.slug,
                    image: e.data.thumbnail?.url || '/assets/img/thumbs/thumb-121.webp',
                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                };
            });

        return {
            data: {
                data: eventData,
                recentEvents
            },
            metadata: {
                title: `${eventData.title} - Events`,
                description: entry.content ? entry.content.replace(/<[^>]*>/g, '').substring(0, 160) : ''
            }
        };
    } catch (error) {
        console.error('Failed to fetch event details:', error);
        return {
            data: { data: {} },
            metadata: { title: 'Event Not Found' }
        };
    }
}
