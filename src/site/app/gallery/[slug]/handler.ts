import { Request, Response } from 'express';
import { getEntryBySlug } from '../../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    const slug = Array.isArray(req.params.slug) ? req.params.slug[ 0 ] : req.params.slug;

    try {
        const entry = await getEntryBySlug('gallery', slug);

        console.log("This is the entry", entry);

        if (!entry) {
            return {
                data: { data: {} },
                metadata: { title: 'Gallery Item Not Found' }
            };
        }

        const images: { src: string; alt: string; }[] = [];

        // Handle 'images' field (array of CMSFile)
        if (Array.isArray(entry.images)) {
            entry.images.forEach((img: any) =>
            {
                if (img && img.url) {
                    images.push({ src: img.url, alt: img.filename || entry.name });
                }
            });
        }

        // Handle 'files' field (array of CMSFile, per user sample)
        // The type definition says 'files' is CMSFile (single), but sample shows array. safely handle array.
        const entryFiles: any = entry.files;
        if (Array.isArray(entryFiles)) {
            entryFiles.forEach((file: any) =>
            {
                if (file && file.url) {
                    images.push({ src: file.url, alt: file.filename || entry.name });
                }
            });
        }

        // If no images found in 'images' or 'files', fallback to thumbnail
        if (images.length === 0 && entry.thumbnail) {
            images.push({ src: entry.thumbnail.url, alt: entry.name });
        }

        const galleryItem = {
            title: entry.name,
            description: entry.excerpt || '',
            content: entry.content || '',
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
