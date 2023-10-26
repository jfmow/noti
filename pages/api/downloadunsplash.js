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
    if (request.method != 'POST') {
        return response.status(405).send('Method not allowed');
    }
    try {
        //console.log(request.body)
        const link = JSON.parse(request.body).image
        //console.log(link)

        // Sanitize and validate the 'type' parameter
        const isSafeType = (input) => {
            // Define a regular expression pattern to match strings from api.unsplash.com
            const pattern = /^https:\/\/api\.unsplash\.com\/.*$/;
            return pattern.test(input);
        };


        if (!isSafeType(link)) {
            // Handle invalid input (e.g., respond with an error)
            return response.status(400).send('Invalid input parameter');
        }

        const data = await fetch(`${link}&client_id=${process.env.UNSPLASH_APIKEY}`)
        if (data.status === 200) {
            return response.status(200).json({ message: "Success", code: 0 })
        }
        //console.log(data)
        return response.status(501).json({ message: "Fail", code: 1 })

    } catch (err) {
        console.log(err)
        response.status(500).send('Something went wrong!')
    }
}
