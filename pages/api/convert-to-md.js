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
    limit = 3,
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
        return response.status(429).send('Too Many Requests please try again in 1 minute')
    }
    if (request.method != 'POST') {
        return response.status(405).send('Method not allowed');
    }
    const markdownData = convertToMarkdown(request.body.body, request.body.title);
    response.status(200).send(markdownData)
}
function convertToMarkdown(data, title) {
    let md = "";
    let errors = []

    md += `# ${title}\n\n`;

    for (const block of data.blocks) {
        try {
            switch (block.type) {
                case "simpleEmbeds":
                    md += `![Embed](link-to-your-file/${block.data.fileId})\n\n`;
                    break;
                case "paragraph":
                    md += `${block.data.text}\n\n`;
                    break;
                case "header":
                    md += `## ${block.data.text}\n\n`;
                    break;
                case "table":
                    md += "| " + block.data.content[0].join(" | ") + " |\n";
                    md += "| " + Array(block.data.content[0].length).fill("---").join(" | ") + " |\n";
                    for (let i = 1; i < block.data.content.length; i++) {
                        md += "| " + block.data.content[i].join(" | ") + " |\n";
                    }
                    md += "\n";
                    break;
                case "nestedList":
                    md += parseNestedList(block.data.items);
                    md += "\n";
                    break;
                case "image":
                    md += `![Image](link-to-your-image/${block.data.fileId})\n\n`;
                    break;
                case "SimpleIframeWebpage":
                    md += `<iframe src="${block.data?.src}" style="width: 100%; height: 70vh;" frameborder="0" allowfullscreen></iframe>\n\n`;
                    break;
                case "SimpleTodo":
                    md += parseSimpleTodoList(block.data.items);
                    md += "\n";
                    break;
                default:
                    // Handle unrecognized block types by skipping them
                    break;
            }
        } catch (err) {
            errors.push(err.message)
        }
    }

    return md;
}

function parseSimpleTodoList(items) {
    let md = "";
    for (const item of items) {
        md += `- [${item.checked ? "x" : " "}] ${item.content}\n`;
    }
    return md;
}

function parseNestedList(items, depth = 1) {
    let md = "";
    for (const item of items) {
        md += `${"  ".repeat(depth)}* ${item.content}\n`;
        if (item.items) {
            md += parseNestedList(item.items, depth + 1);
        }
    }
    return md;
}




