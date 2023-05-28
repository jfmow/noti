
  

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
    limit = 5,
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
        return response.status(429).json({error: 'Too many requests'})
    }
    if(request.method != 'GET'){
        return    response.status(405).send('Method not allowed');
    }
    const userIp =
    request.ip ||
    request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.connection.remoteAddress;

  response.status(200).json({ ip: userIp });
}
