const TypeDoc = require('typedoc');

async function main() {
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
        entryPoints: [
            'src/index.ts',
            'src/types/RepositoryInfo.ts',
            'src/traits/HasLogger.ts' 
        ],
    });

    const project = app.convert();

    if (project) {
        const outputDir = 'docs/api';

        // Rendered docs
        await app.generateDocs(project, outputDir);
        // Alternatively generate JSON output
        // await app.generateJson(project, outputDir + '/documentation.json');
    }
}

main().catch(console.error);
