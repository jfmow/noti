import webpush from 'web-push';

const vapidDetails = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT
};

export async function sendNotifications(subscriptions, msg) {
    try {
        console.log('sbs', subscriptions)
        console.log('msg', msg)
        const notification = JSON.stringify({
            title: msg.title,
            options: {
                body: msg.body
            }
        });
    
        const options = {
            TTL: 10000,
            vapidDetails: vapidDetails
        };
    
        for (const subscription of subscriptions) {
            console.log('subscriptio:', subscription)
            const endpoint = subscription.endpoint;
            console.log('endpoint:',endpoint)
            const id = endpoint.substr((endpoint.length - 8), endpoint.length);
            console.log('endpoint id:', id)
            try {
                const result = await webpush.sendNotification(subscription, notification, options);
                console.log(`-----Endpoint ID: ${id}`);
                console.log(`-----Result: ${result.statusCode}`);
            } catch (error) {
                console.log(`Endpoint ID: ${id}`);
                console.log(`Error: ${error}`);
                return error
            }
        }
    } catch (error) {
        console.log('error',error)
    }
    return 'Success with sending notifs to individ'
}
