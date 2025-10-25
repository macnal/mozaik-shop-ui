import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    const entries = fs.readdirSync(dir);
    for (const f of entries) {
        const dirPath = path.join(dir, f);
        const stat = fs.statSync(dirPath);
        if (stat.isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    }
}

walkDir('./src/api/gen/endpoints', file => {
    if (path.extname(file) === '.ts') {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;

        // Replace literal `${config.api.url}` with process.env.API_BASE
        const needle = '${config.api.url}';
        if (content.includes(needle)) {
            content = content.split(needle).join("${process.env.API_BASE}");
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(file, content);
        }
    }
});
