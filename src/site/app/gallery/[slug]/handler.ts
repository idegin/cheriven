import { Request, Response } from 'express';
import { getEntryBySlug } from '../../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    const slug = Array.isArray(req.params.slug) ? req.params.slug[ 0 ] : req.params.slug;

    try {
        const entry = await getEntryBySlug('gallery', slug);

        if (!entry) {
            return {
                data: { data: {} },
                metadata: { title: 'Gallery Item Not Found' }
            };
        }

        const images = [];
        // Handle images field which might be single or array despite type definition
        const entryImages: any = entry.images;
        if (Array.isArray(entryImages)) {
            images.push(...entryImages.map((img: any) => ({ src: img.url, alt: img.filename || entry.name })));
        } else if (entryImages) {
            images.push({ src: entryImages.url, alt: entryImages.filename || entry.name });
        }

        // If no images found in 'images', fallback to thumbnail
        if (images.length === 0 && entry.thumbnail) {
            images.push({ src: entry.thumbnail.url, alt: entry.name });
        }

        const galleryItem = {
            title: entry.name,
            description: entry.excerpt || entry.content || '',
            images: images.length > 0 ? images : [ { src: '/assets/img/thumbs/thumb-69.webp', alt: 'Placeholder' } ]
        };

        return {
            data: {
                data: galleryItem
            },
            metadata: {
                title: `${galleryItem.title} - Gallery`,
                description: galleryItem.description
            }
        };

    } catch (error) {
        console.error("Error fetching gallery item:", error);
        return {
            data: { data: {} },
            metadata: { title: 'Error' }
        };
    }
}
