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
    limit = 60,
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
        return response.status(429).send('Too Many Requests, if you want to increase you limit contact help@suddsy.dev')
    }
    if (request.method != 'GET') {
        return response.status(405).send('Method not allowed');
    }
    function generateRandomPassword(length, includeLetters = true, includeNumbers = true, includeSymbols = true) {
        let charset = "";

        if (includeLetters) {
            charset += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }

        if (includeNumbers) {
            charset += "0123456789";
        }

        if (includeSymbols) {
            charset += "!@#$%^&*()-_=+[]?";
        }

        if (charset === "") {
            console.error("At least one character set must be included.");
            return null;
        }

        let password = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }

        charset = ""

        return password;
    }

    // Example usage:
    const { length, letters, numbers, symbols } = request.query;

    // Define a function to sanitize and parse a string to an integer
    function parseAndSanitizeInt(value) {
        const parsedInt = parseInt(value, 10);
        return isNaN(parsedInt) || parsedInt < 0 ? null : parsedInt;
    }

    // Sanitize and parse the values
    const sanitizedLength = parseAndSanitizeInt(length);

    // Check for valid values
    if (sanitizedLength === null) {
        return response.status(400).send('Invalid request');
    }
    if (sanitizedLength > 500) {
        return response.status(200).send('Must be less than 500 char (bit much aye)')
    }
    const password1 = generateRandomPassword(sanitizedLength, letters === 'false' ? false : true, numbers === 'false' ? false : true, symbols === 'false' ? false : true); // Include all character sets
    response.status(200).send(JSON.stringify({ password: password1 }))
}
