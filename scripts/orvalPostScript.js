const fs = require('fs');
const path = require('path');

const importConfigStatement = "import { config } from '@/config';\n";
const importAdjustParamsStatement = "import { adjustParams } from '@/utils/urlParamAjduster';\n";
const searchParamsStatement = /const normalizedParams = new URLSearchParams\(\);\s*Object\.entries\(params/sg
const badRequestStatement = /\|.*Response400;/g

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

walkDir('./src/api/gen/endpoints', file => {
    if (path.extname(file) === '.ts') {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;

        if (!content.includes(importConfigStatement.trim())) {
            const headerEndPos = content.indexOf('*/') + 2;
            content = content.slice(0, headerEndPos) + '\n' + importConfigStatement + content.slice(headerEndPos);
            changed = true;
        }

        if (!content.includes(importAdjustParamsStatement.trim())) {
            const headerEndPos = content.indexOf('*/') + 2;
            content = content.slice(0, headerEndPos) + '\n' + importAdjustParamsStatement + content.slice(headerEndPos);
            changed = true;
        }

        const matching  = content.match(searchParamsStatement);

        if (matching) {
            matching.forEach(c => {
                content = content.replace(c, c.replace('params', 'adjustParams(params)'))
            })
        }

        if (content.match(badRequestStatement)) {
            content.match(badRequestStatement).forEach(c => {
                content = content.replace(c, ';')
            });
        }

        if (changed) {
            fs.writeFileSync(file, content);
        }
    }
});
