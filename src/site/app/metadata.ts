import type { SiteMetadata } from '../../types/app.types.js';

const metadata: Partial<SiteMetadata> = {
    title: 'Cheriven Foundation - Empowering Communities',
    description: 'Cheriven Foundation is dedicated to empowering communities through sustainable development, education, and healthcare initiatives in Nigeria and beyond.',
    keywords: [ 'NGO', 'Foundation', 'Charity', 'Nigeria', 'Abuja', 'Education', 'Healthcare', 'Community Development', 'Poverty Alleviation' ],
    twitterHandle: '@cheriven',
    og: {
        type: 'website',
        url: 'https://cherivenfoundation.org',
        title: 'Cheriven Foundation - Empowering Communities',
        description: 'Cheriven Foundation is dedicated to empowering communities through sustainable development, education, and healthcare initiatives.',
        image: 'https://cherivenfoundation.org/logo.jpeg'
    },
    twitter: {
        card: 'summary_large_image',
        url: 'https://cherivenfoundation.org',
        title: 'Cheriven Foundation - Empowering Communities',
        description: 'Cheriven Foundation is dedicated to empowering communities through sustainable development, education, and healthcare initiatives.',
        image: 'https://cherivenfoundation.org/logo.jpeg'
    }
};

export default metadata;
