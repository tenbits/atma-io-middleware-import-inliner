export function u_getNewLine(str, io) {
    var match = /(\r\n)|(\r)|(\n)/.exec(str);
    return (match && match[0]) || io.env.newLine;
};
export function u_getIndent(str): string {
    var match = /^[ \t]+/.exec(str);
    return match && match[0] || '';
};
export function u_makeIndent(str: string, indent: string, io) {
    if (!indent) return str;

    let newline = u_getNewLine(str, io);
    return str
        .split(newline)
        .map(line => indent + line)
        .join(newline);
};

export function u_getFilesFromPath(path, io) {
    var file = new io.File(path);
    if (file.exists() === false) {
        console.error('File not found', file.uri.toLocalFile());
        return [];
    }

    return [file];
};

export function u_readFile(io, file, indent, insertFileName) {
    var content = file.read().toString();
    var newline = u_getNewLine(content, io);
    if (indent) {
        content = content
            .split(newline)
            .map(line => indent + line)
            .join(newline);
    }
    if (insertFileName) {
        content = indent
            + '// source '
            + file.uri.file
            + newline
            + content;
    }
    return content;
};

export function u_asString(str) {
    str = str
        .replace(/[\n\r]/g, '\\n')
        .replace(/"/g, '\\"')
        ;

    return `"${str}"`;
};