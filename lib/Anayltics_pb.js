import PocketBase from 'pocketbase';

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);

await pb.collection('services').authWithPassword(
    process.env.ANALYTICS_USER,
    process.env.ANALYTICS_PASSWORD,
);