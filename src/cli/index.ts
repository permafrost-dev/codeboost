import { Application } from '@/lib/Application';
import { APP_VERSION } from '@/lib/consts';
import { Command } from 'commander';

const program = new Command();

program.name('codeboost');
program.version(APP_VERSION);

program
    .command('run')
    .description('Run the specified boost against a repository.')
    .argument('[name]', 'boost name', null)
    .option('-r,--repo <repoName>', 'repository to run against')
    .option('-c,--config <configFile>', 'config file to use', 'codeboost.config.js')
    .action(async (name, options) => {
        const app = new Application(options.config);
        await app.execute(options.repo, name);
    });

program.parse();
