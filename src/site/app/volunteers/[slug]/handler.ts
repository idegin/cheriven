import { Request, Response } from 'express';
import { getEntryBySlug } from '../../../../lib/cms-service';

export default async function handler(req: Request, res: Response)
{
    const slug = Array.isArray(req.params.slug) ? req.params.slug[ 0 ] : req.params.slug;

    try {
        const volunteerEntry = await getEntryBySlug('people', slug);

        if (!volunteerEntry) {
            // Handle not found - for now maybe return null or a specific error object
            // that the router or template can handle.
            // But existing pattern seems to just render.
            // Let's return a "not found" friendly structure or redirect?
            // For simplicity, let's return null data which might cause empty render
            // or check in template.
            return {
                data: { data: {} }, // Empty object to avoid crash, template handles defaults
                metadata: { title: 'Volunteer Not Found' }
            };
        }

        // Map CMS data to template structure
        // CMS People: name, slug, avatar, bio, linkedin_url
        // Template expects: name, role, occupation, experience, email, phone, summary, image, socials
        const volunteer = {
            name: volunteerEntry.name,
            role: 'Volunteer', // Not in CMS yet
            occupation: 'Volunteer', // Not in CMS yet
            experience: 'N/A', // Not in CMS yet
            email: 'contact@cheriven.org', // Not in CMS yet
            phone: '', // Not in CMS yet
            summary: volunteerEntry.bio || '',
            image: volunteerEntry.avatar?.url || '/assets/img/thumbs/thumb-83.webp',
            socials: {
                facebook: '#',
                twitter: '#',
                instagram: '#',
                linkedin: volunteerEntry.linkedin_url || '#'
            }
        };

        return {
            data: {
                data: volunteer
            },
            metadata: {
                title: `${volunteer.name} - Volunteer Details`,
                description: volunteer.summary?.substring(0, 160) || ''
            }
        };
    } catch (error) {
        console.error("Error fetching volunteer details:", error);
        return {
            data: { data: {} },
            metadata: { title: 'Error' }
        };
    }
}
