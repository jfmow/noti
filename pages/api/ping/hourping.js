import { sendNotifications } from "@/lib/sendNotifications";
import PocketBase from 'pocketbase';
import axios from 'axios'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)

export default async function sendNotif(req, res) {
    if (req.headers.authorisation == undefined) {
        return res.status(404).end('Not found!')
    }
    if (req.headers.authorisation === process.env.HOUR_PING_KEY) {
        try {
            //const userIds = JSON.parse(req.body).user.id; // Get the user IDs array from req.body
            const toke = await pb.admins.authWithPassword(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

            const subs = await fetch(`${process.env.NEXT_PUBLIC_POCKETURL}/api/collections/subscriptions/records?expand=user`, {
                method: "GET",
                headers: {
                    Authorization: toke.token, // Set the Authorization header
                },
            });

            //console.log('user ids not filtered:', userIds)

            const data = await subs.json();

            const filteredItems = data.items.filter(item => item.expand.user.admin === true);

            const apiHealthPing = await axios.get('https://notidb.suddsy.dev/api/health')

            const state = await sendNotifications(filteredItems, { "title": '⚠️ ALERT ⚠️', "body": `${new Date().toLocaleString()}. ${apiHealthPing.data.message}` });

            res.status(200).send(data.items, toke.token);
        } catch (error) {
            console.log(error);
            res.status(500).send('Failed to send notif');
        }
    } else {
        res.status(404).end('Not found!')
    }
}
