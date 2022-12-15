import packageJson from '@/../package.json';
import { Application } from '@/lib/Application';
import { APP_VERSION } from '@/lib/consts';
import { Command } from 'commander';
import updateNotifier from 'simple-update-notifier';

updateNotifier({ pkg: packageJson });

const program = new Command();

program.name('codeboost');
program.version(APP_VERSION);

program
    .command('run')
    .description('Run the specified boost against a repository.')
    .argument('[name]', 'boost name', null)
    .option('-r,--repo <repoName>', 'repository to run against', '')
    .option('-c,--config <configFile>', 'config file to use', '')
    .option('-d,--dry-run', 'dry run, only run scripts locally (do not fork/push/create pr)', false)
    .option('-b,--batch <filename>', 'batch mode using filename as a json database of repositories', false)
    .option('-s,--size <batchSize>', 'size of the batch to run', '2')
    .action(async (name, options) => {
        options.size = Number(options.size);

        const app = new Application(options.config, options.config.length > 0);
        await app.executeRun(options.repo, name, options);
    });

program
    .command('init')
    .description('Initialize codeboost.')
    .option('-c,--config <configFile>', 'config file to use', '')
    .action(async options => {
        const app = new Application(options.config, options.config.length > 0);
        await app.executeInit();
    });

program.parse();
