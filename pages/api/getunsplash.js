import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import validator from 'validator';
import PocketBase from "pocketbase";
import { isNumber } from 'lodash';
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
    limit = 200,
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
    if (request.method != 'POST') {
        return response.status(405).send('Method not allowed');
    }
    try {
        const type = JSON.parse(request.body).query
        const page = JSON.parse(request.body).page

        // Sanitize and validate the 'type' parameter
        const validSearchText = validator.escape(String(type));
        const validPageNumber = page

        if (validSearchText === "*rand**") {
            const data = await fetch(`https://api.unsplash.com/photos/random?count=24&client_id=${process.env.NEXT_PUBLIC_UNSPLASH}&orientation=landscape`)
            //const data = await fetch(`https://api.unsplash.com/search/photos?query=potato&client_id=${process.env.UNSPLASH_APIKEY}&per_page=200&orientation=landscape&page=${validPageNumber}`)
            const data2 = await data.json()
            return response.status(200).json({ "total": -1, "total_pages": -1, "results": data2 })
        }

        const isSafeType = (input) => {
            // Define a regular expression pattern to allow spaces and disallow problematic characters
            const pattern = /^[a-zA-Z0-9\s-]+$/;
            return pattern.test(input);
        };

        if (!isSafeType(validSearchText)) {
            // Handle invalid input (e.g., respond with an error)
            return response.status(400).send('Invalid input parameter');
        }

        if (!isNumber(validPageNumber)) {
            return response.status(400).send('Invalid input parameter');

        }

        const data = await fetch(`https://api.unsplash.com/search/photos?query=${validSearchText}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH}&per_page=200&orientation=landscape&page=${validPageNumber}`)
        const data2 = await data.json()
        return response.status(200).json(data2)
    } catch (err) {
        console.log(err)
        response.status(500).send('Something went wrong!')
    }
}
