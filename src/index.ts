import { Application } from '@/lib/Application';
import { APP_VERSION } from '@/lib/consts';
import { Command } from 'commander';

const program = new Command();

program.name('codeboost-cli');
program.version(APP_VERSION);

program
    .command('run', { isDefault: true })
    .description('Run a boost against the specified repository.')
    .argument('[repoName]', 'repository name', null)
    .option('-b, --boost <boost>', 'boost to run')
    .action(async (repoName, options) => {
        const app = new Application();

        await app.execute(repoName, options.boost);
    });

program.parse();
