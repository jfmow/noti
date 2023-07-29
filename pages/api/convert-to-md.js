import axios from 'axios'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)

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
    if(!request.body.body || !request.body.title || !request.headers.authorization){
        return response.status(400).send('Not enough data');
    }
    const markdownData = await convertToMarkdown(request.body.body, request.body.title, request.headers.authorization);

    response.status(200).send(markdownData)
}
async function convertToMarkdown(data, title, tok) {
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
                case 'image':
                    // Fetch the image data and convert it to base64
                    const base64String = await getImageBase64(block.data.fileId, tok);
                    md += `![Image](data:image/png;base64,${base64String})\n\n`;
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
            //console.log(err)
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

async function getImageBase64(file, tok) {

    // retrieve an example protected file url (will be valid ~5min)
    try {
        ////console.log('Hi', tok)
        const fileToken = await axios.post(
            'https://noti.suddsy.dev/api/files/token',
            {},
            {
                headers: {
                    Authorization: tok,
                },
            }
        );
        ////console.log(fileToken, 'bb', `https://noti.suddsy.dev/api/collections/imgs/records/${file}`)
        const respons = await axios.get(`https://noti.suddsy.dev/api/collections/imgs/records/${file}`, {
            headers: {
                Authorization: tok,
            },
        });
        // //console.log(respons)
        const response = await axios.get(
            `https://noti.suddsy.dev/api/files/imgs/${file}/${respons.data.file_data}?token=${fileToken.data.token}`,
            {
                headers: {
                    Authorization: fileToken.data.token,
                },
                responseType: 'arraybuffer',
            }
        );

        const base64String = Buffer.from(response.data, 'binary').toString('base64');
        return base64String;
    } catch (error) {
        console.error('Error fetching image:', error.message);
        throw error;
    }
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




