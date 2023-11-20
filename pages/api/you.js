import { pb } from '@/lib/Anayltics_pb'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

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
    limit = 500,
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

    if (!pb.authStore.isValid) {
        await pb.collection('services').authRefresh();
    }

    const userLanguageHeader = request.headers['accept-language'];
    const userRegion = extractRegionFromLanguageHeader(userLanguageHeader);
    const userIp =
        request.ip ||
        request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.connection.remoteAddress;
    let reqBody = request.body
    if (!reqBody.id) {
        return response.status(406).send('Not all required data included')
    }

    //console.log(reqBody)
    if (reqBody?.url === '/') {
        reqBody.url = 'home'
    }
    //console.log(reqBody)
    const data = {
        "fingerprint": reqBody.id,
        "url": reqBody?.url || '',
        "region": userRegion,
        "ip": userIp,
        "action": reqBody?.action || ''
    };

    try {
        await pb.collection('analytics').create(data);
    } catch {
        return response.status(500).send('Internal server error')
    }
    response.status(200).send('Success')
}


function extractRegionFromLanguageHeader(languageHeader) {
    // Implement your logic to extract the region from the language header.
    // For simplicity, let's assume that the language header contains the region code.

    const regionCode = languageHeader ? languageHeader.split('-')[1].split(',')[0] : 'Unknown';
    return regionCode || 'Unknown';
}