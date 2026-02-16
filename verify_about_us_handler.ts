
import handler from './src/site/app/about-us/handler.ts';

console.log('Running handler...');
try {
    const result = await handler({} as any, {} as any);
    console.log('Volunteers count:', result.data.volunteers.length);
    console.log('Reviews count:', result.data.reviews.length);
} catch (error) {
    console.error('Handler Error:', error);
}
