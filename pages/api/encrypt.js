import CryptoJS from 'crypto-js';


import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

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
    limit = 100,
    windowMs = 60 * 1000,
    delayAfter = Math.round(10 / 2),
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
        return response.status(429).send('Too Many Requests')
    }

    // Rest of the API route code.
    if (request.method === 'POST') {
        const secretKey = process.env.Encrypt_key;

        const data = request.body

        try {
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

            const response2 = {
                ciphertext
            };
            return response.status(200).json(response2);
        } catch (error) {
            console.log(error)
            return response.status(500).send('Failed to encrypt data');
        }
    } else {
        response.status(405).send('Method not allowed');
    }
}

