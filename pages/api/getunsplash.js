import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import validator from 'validator';
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
    limit = 20,
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
    if (request.method != 'GET') {
        return response.status(405).send('Method not allowed');
    }
    try {
        const { type } = request.query;

        // Sanitize and validate the 'type' parameter
        const validType = validator.escape(String(type));

        if (!validator.isAlphanumeric(validType)) {
            // Handle invalid input (e.g., respond with an error)
            return response.status(400).send('Invalid input for "type" parameter');
        }

        // Validate and convert the 'type' parameter to a string
        const data = await fetch(`https://api.unsplash.com/search/photos?query=${validType}&client_id=${process.env.UNSPLASH_APIKEY}&per_page=200&orientation=landscape`)
        const data2 = await data.json()
        response.status(200).json(data2)
    } catch (err) {
        response.status(500).send('Something went wrong!')
    }
}
