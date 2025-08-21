interface BookmarkLink {
    name?: string;
    url?: string;
    favicon?: string; // Add favicon property
}

class YamlParser {
    static parse(yamlString: string): BookmarkLink[] {
        const lines = yamlString.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const result: BookmarkLink[] = [];
        let currentItem: BookmarkLink | null = null;

        lines.forEach((line: string) => {
            if (line.startsWith('-')) {
                if (currentItem) {
                    result.push(currentItem);
                }
                currentItem = {};
                const nameMatch = line.match(/name:\s*(.*)/);
                if (nameMatch) {
                    currentItem.name = nameMatch[1].trim();
                }
            } else if (currentItem) {
                const urlMatch = line.match(/url:\s*(.*)/);
                if (urlMatch) {
                    currentItem.url = urlMatch[1].trim();
                } else { // Add this else block to check for favicon
                    const faviconMatch = line.match(/favicon:\s*(.*)/);
                    if (faviconMatch) {
                        currentItem.favicon = faviconMatch[1].trim();
                    }
                }
            }
        });

        if (currentItem) {
            result.push(currentItem);
        }
        return result;
    }
}

export { YamlParser };
