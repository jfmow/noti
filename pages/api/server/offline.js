import { sendNotifications } from "@/lib/sendNotifications";
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

let previousRecords = null;
import CryptoJS from "crypto-js";

export default async function notifAll(req, res) {
    const data = req.query.pub;
    try {
        // Encrypt
        //const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.ENC_CODE).toString();
        //const urlSafeCiphertext = encodeURIComponent(ciphertext);
        //console.log(urlSafeCiphertext)
        // Decrypt
        const decodedCiphertext = decodeURIComponent(data);
        const bytes = CryptoJS.AES.decrypt(decodedCiphertext, process.env.ENC_CODE);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (decryptedData != process.env.ENC_KEY) {
            return res.status(404).end('Not found!')
        }
    } catch (err) {
        res.status(404).end('Not found!')
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
    //console.log(decryptedData); // [{id: 1}, {id: 2}]

}
