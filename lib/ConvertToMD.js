
export default async function convertToMarkdown(data, title, tok) {
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
                    switch (block.data.style) {
                        case "unordered":
                            md += parseUnorderedNestedList(block.data.items);
                            md += "\n";
                            break;
                        case "ordered":
                            md += parseNestedList(block.data.items);
                            md += "\n";
                            break;
                        default:
                            // Handle other styles or raise an error if needed.
                            break;
                    }
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
function parseNestedList(items) {
    let md = "";
    for (let i = 0; i < items.length; i++) {
        md += parseNestedListItem(items[i], i + 1);
    }
    return md;
}

function parseNestedListItem(item, number) {
    let md = `${number}. ${item.content}\n\n`;
    if (item.items && item.items.length > 0) {
        for (let i = 0; i < item.items.length; i++) {
            md += parseNestedListItem(item.items[i], `   ${number}.${i + 1}`);
        }
    }
    return md;
}

async function getImageBase64(file, tok) {

    // retrieve an example protected file url (will be valid ~5min)
    try {
        ////console.log('Hi', tok)
        const fileToken = await axios.post(
            `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/token`,
            {},
            {
                headers: {
                    Authorization: tok,
                },
            }
        );
        ////console.log(fileToken, 'bb', `${process.env.NEXT_PUBLIC_POCKETURL}/api/collections/imgs/records/${file}`)
        const respons = await axios.get(`${process.env.NEXT_PUBLIC_POCKETURL}/api/collections/imgs/records/${file}`, {
            headers: {
                Authorization: tok,
            },
        });
        // //console.log(respons)
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/imgs/${file}/${respons.data.file_data}?token=${fileToken.data.token}`,
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

function parseUnorderedNestedList(items) {
    let md = "";
    for (let i = 0; i < items.length; i++) {
        md += parseUnorderedNestedListItem(items[i], 1);
    }
    return md;
}
function parseUnorderedNestedListItem(item, level) {
    let md = `${"  ".repeat(level - 1)}- ${item.content}\n`;
    if (item.items && item.items.length > 0) {
        for (let i = 0; i < item.items.length; i++) {
            md += parseUnorderedNestedListItem(item.items[i], level + 1);
        }
    }
    return md;
}