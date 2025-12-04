/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');

function parseSemicolonCSVLine(line) {
    const fields = [];
    let cur = '';
    let inQuotes = false;
    for (let pos = 0; pos < line.length; pos++) {
        const ch = line[pos];
        if (ch === '"') {
            if (inQuotes && pos + 1 < line.length && line[pos + 1] === '"') {
                cur += '"';
                pos += 1; // skip next
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ';' && !inQuotes) {
            fields.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    fields.push(cur);
    return fields;
}

function csvEscape(field) {
    if (field == null) return '';
    const s = String(field);
    if (s.includes(';') || s.includes('\n') || s.includes('\r') || s.includes('"')) {
        return '"' + s.replaceAll('"', '""') + '"';
    }
    return s;
}

function readFileSyncUtf8(filePath) {
    return fs.readFileSync(filePath, {encoding: 'utf8'});
}

function writeFileSyncUtf8(filePath, content) {
    fs.writeFileSync(filePath, content, {encoding: 'utf8'});
}

function main() {
    const argv = process.argv.slice(1)

    const inputPath = 'articles.csv';
    let outputPath = 'articles_converted.csv';

    const raw = readFileSyncUtf8(inputPath);
    const lines = raw.split(/\r?\n/);
    if (lines.length === 0) {
        console.error('Input file is empty');
        process.exitCode = 3;
        return;
    }

    // handle possible BOM in first line
    if (lines[0].codePointAt(0) === 0xfeff) {
        lines[0] = lines[0].slice(1);
    }

    let game = null;
    const outLines = [];
    let processedRows = 0;
    lines.forEach(line => {
        if (line.trim() === '') {
            return;
        }
        if (line.startsWith('Magic the Gathering Singles')) {
            game = 'MtG';
            return;
        } else if (line.startsWith('Riftbound Singles')) {
            game = 'RB';
            return;
        } else if (line.startsWith('Pokémon Singles')) {
            game = 'PCG';
            return;
        }
        const fields = parseSemicolonCSVLine(line);
        // Ensure final output has exactly 20 columns.
        // We want the last column (index 19) to be the `game` value.
        const desiredTotal = 17;
        const gameValue = game ?? '';

        if (fields.length >= desiredTotal) {
            // Too many input columns: keep first desiredTotal-1 columns and discard the rest
            fields.length = desiredTotal - 1;
        }

        // Pad with empty strings until we have space for the last `game` column
        while (fields.length < desiredTotal - 1) {
            fields.push('');
        }

        // Append game as the last column
        fields.push(gameValue);

        outLines.push(fields.map(csvEscape).join(';'));
        processedRows++;
    });

    writeFileSyncUtf8(outputPath, outLines.join('\r\n'));
    console.log(`Wrote ${processedRows} data rows to ${outputPath}`);
}

if (require.main === module) {
    main();
}
