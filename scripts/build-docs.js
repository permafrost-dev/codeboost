const { renameSync, unlinkSync, copyFileSync } = require('fs');
const TypeDoc = require('typedoc');

async function main() {
    copyFileSync(`${__dirname}/../src/index.ts`, `${__dirname}/../src/codeboost.ts`);

    const app = new TypeDoc.Application();

    // If you want TypeDoc to load tsconfig.json / typedoc.json files
    app.options.addReader(new TypeDoc.TSConfigReader());
    app.options.addReader(new TypeDoc.TypeDocReader());

    app.bootstrap({
        excludeInternal: true,
        excludeProtected: true,
        excludePrivate: true,
        githubPages: false,
        out: './docs/api',
        plugin: [ 'typedoc-plugin-markdown' ],
        entryPoints: [ 'src/codeboost.ts' ],
    });

    const project = app.convert();

    if (project) {
        const outputDir = 'docs/api';

        // Rendered docs
        await app.generateDocs(project, outputDir);
        // Alternatively generate JSON output
        // await app.generateJson(project, outputDir + '/documentation.json');

        unlinkSync(`${__dirname}/../src/codeboost.ts`);
        unlinkSync(`${__dirname}/../docs/api/README.md`);
        renameSync(`${__dirname}/../docs/api/modules.md`, `${__dirname}/../docs/api/README.md`);
    }
}

main().catch(console.error);
