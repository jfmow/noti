import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import { sendNotifications } from "@/lib/sendNotifications";
import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
let adminData = null
const applyMiddleware = middleware => (request, response) =>
    new Promise((resolve, reject) => {
        middleware(request, response, result =>
            result instanceof Error ? reject(result) : resolve(result)
        )
    })

const getIP = request =>
    request.ip ||
    request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.connection.remoteAddress

export const getRateLimitMiddlewares = ({
    limit = 5,
    windowMs = 60 * 1000,
    delayAfter = Math.round(5 / 2),
    delayMs = 0,
} = {}) => [
        slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
        rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
    ]

const middlewares = getRateLimitMiddlewares()

async function applyRateLimit(request, response) {
    await Promise.all(
        middlewares
            .map(applyMiddleware)
            .map(middleware => middleware(request, response))
    )
}

export default async function handler(request, response) {
    try {
        await applyRateLimit(request, response)
    } catch {
        return response.status(404).send('Not found!')
    }
    if (request.method != 'GET') {
        return response.status(404).send('Not found!');
    }
    response.status(200);
    try {
        await pb.collection('users').authWithPassword(
            process.env.ADMIN_OFFLINE_USER,
            process.env.ADMIN_OFFLINE_PWD,
        );
        const records = await pb.collection('subscriptions').getFullList({
            sort: '-created', filter: 'user.admin = true'
        });

        if (records.length > 0) {
            adminData = records
            response.status(200).end('Found!')
        } else {
            response.status(409).end('No subs');
        }
    } catch (error) {
        try {
            const state = await sendNotifications(adminData, { "title": "🛑ALL SERVERS DOWN🛑", "body": "This message has been sent via noti.jamesmowat.com, all servers may be offline." })
            console.log(state)
            response.status(200).end('Success');
        } catch (error) {
            response.status(500).end('error')
        }
    }
    pb.authStore.clear()
}
