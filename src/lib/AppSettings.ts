/* It initializes a git instance */

import { LogTarget } from '@/traits/HasLogger';

export interface AppSettings {
    github_token: string;
    repository_storage_path: string;
    boosts_path: string;
    use_forks: boolean;
    use_pull_requests: boolean;
    log_target: LogTarget | LogTarget[];
    dry_run?: boolean;
    auto_merge_pull_requests?: boolean;
}

export function loadSettings(filename: string): AppSettings {
    return transformSettings(require(filename).default);
}

function loadLogTarget(settings) {
    if (!Array.isArray(settings.log_target)) {
        settings.log_target = [ settings.log_target ];
    }

    return (settings.log_target = settings.log_target
        .map(target => <LogTarget>target.toLowerCase())
        .filter((target: string) => [ 'console', 'file' ].includes(target)));
}

const isString = (value: any) => typeof value === 'string';
const isUndefined = (value: any) => typeof value === 'undefined';

export function transformSettings(settings: AppSettings): AppSettings {
    const getEnvVar = (key: string) => process.env[settings[key].slice(1)];
    const setDefaultValue = (key: string, value: any) => isUndefined(settings[key]) && (settings[key] = value);

    // load settings from environment variable references starting with '$'
    for (const key in settings) {
        if (isString(settings[key]) && !!getEnvVar(key)) {
            settings[key] = getEnvVar(key);
        }
    }

    setDefaultValue('dry_run', false);
    setDefaultValue('auto_merge_pull_requests', false);

    if (!settings.use_pull_requests) {
        settings.use_forks = false;
    }

    return loadLogTarget(settings);
}
