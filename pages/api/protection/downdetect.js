import { sendNotifications } from "@/lib/sendNotifications";
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

let previousRecords = null; // Variable to store the previous records

export default async function notifAll(req, res) {
    res.status(200);
    console.log(req.query);
    if (req.query.key !== process.env.REQUIRED_KEY) {
        return res.status(404).end('Not found!');
    }



    try {
        const authData = await pb.collection('users').authWithPassword(
            'server2',
            process.env.ADMINPASSWORD1,
        );
        console.log(authData);
        const records = await pb.collection('subscriptions').getFullList({
            sort: '-created',
            expand: 'user',
            filter: `user.admin = true`
        });

        previousRecords = records; // Store the current records as the previous records


        res.status(200).end('All ok!');
    } catch (error) {
        if (previousRecords) {
            try {
                const state = await sendNotifications(previousRecords, { "title": "CRITICAL", "body": "ALL SERVERS OFFLINE!" });
                console.log(state);
                res.status(200).end('Server offline');
            } catch (error) {
                res.status(500).end('Error');
            }
        } else {
            res.status(500).end('Error');
        }
    }
}
