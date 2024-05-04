export function CountWords(content) {
    let totalWords = 0;
    let uniqueWords = new Set(); // Set to store unique words

    if (!content || content === undefined) return { totalWords: 0, uniqueWords: 0 };

    const data = JSON.parse(JSON.stringify(content).replace(/<[^>]*>/g, ''));

    data.blocks.forEach(block => {
        if (block.data && block.data.text) {
            const text = block.data.text;
            const words = text.match(/\b\w+(?:['-]\w+)?\b/g) || []; // Handle case when no words are found
            words.forEach(word => {
                uniqueWords.add(word.toLowerCase()); // Add word to unique words set (convert to lowercase for case-insensitive comparison)
                totalWords++;
            });
        }

        if (block.data && block.data.items) {
            const printNestedListWords = (items) => {
                items.forEach(item => {
                    if (item.content) {
                        const nestedWords = item.content.match(/\b\w+(?:['-]\w+)?\b/g) || []; // Handle case when no words are found
                        nestedWords.forEach(word => {
                            uniqueWords.add(word.toLowerCase()); // Add word to unique words set
                            totalWords++;
                        });
                    }
                    if (item.items) {
                        printNestedListWords(item.items);
                    }
                });
            };
            printNestedListWords(block.data.items);
        }

        if (block.data && block.data.content) {
            const tableContent = block.data.content.flat().filter(cell => typeof cell === 'string');
            const words = tableContent.join(' ').match(/\b\w+(?:['-]\w+)?\b/g) || []; // Handle case when no words are found
            words.forEach(word => {
                uniqueWords.add(word.toLowerCase()); // Add word to unique words set
                totalWords++;
            });
        }
    });

    return { totalWords, uniqueWords: uniqueWords.size }; // Return both totalWords and the size of uniqueWords set
}

export function CountCharacters(content, includeSpaces = true) {
    let totalCharacters = 0;
    if (!content || content === undefined) return 0
    const data = JSON.parse(JSON.stringify(content).replace(/<[^>]*>/g, ''));


    data.blocks.forEach(block => {
        if (block.data && block.data.text) {
            const text = block.data.text;
            totalCharacters += includeSpaces ? text.length : text.replace(/\s/g, '').length;
        }

        if (block.data && block.data.items) {
            const countNestedListCharacters = (items) => {
                let nestedListCharacters = 0;
                items.forEach(item => {
                    if (item.content) {
                        nestedListCharacters += includeSpaces ? item.content.length : item.content.replace(/\s/g, '').length;
                    }
                    if (item.items) {
                        nestedListCharacters += countNestedListCharacters(item.items);
                    }
                });
                return nestedListCharacters;
            };
            totalCharacters += countNestedListCharacters(block.data.items);
        }

        if (block.data && block.data.content) {
            const tableContent = block.data.content.flat().filter(cell => typeof cell === 'string');
            const text = tableContent.join(' ');
            totalCharacters += includeSpaces ? text.length : text.replace(/\s/g, '').length;
        }
    });

    return totalCharacters;
}