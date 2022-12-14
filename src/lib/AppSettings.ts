/* It initializes a git instance */

import { LogTarget } from '@/traits/HasLogger';

export interface AppSettings {
    github_token: string;
    repository_storage_path: string;
    boosts_path: string;
    use_forks: boolean;
    use_pull_requests: boolean;
    log_target: LogTarget | LogTarget[];
}

export function loadSettings(filename: string): AppSettings {
    const settings = require(filename).default;

    return transformSettings(settings);
}

export function transformSettings(settings: AppSettings): AppSettings {
    // load settings from environment variable references starting with '$'
    for (const key in settings) {
        if (typeof settings[key] === 'string' && settings[key].startsWith('$')) {
            if (typeof process.env[settings[key].slice(1)] !== 'undefined') {
                settings[key] = process.env[settings[key].slice(1)];
            }
        }
    }

    if (!Array.isArray(settings.log_target)) {
        settings.log_target = [settings.log_target];
    }

    settings.log_target = settings.log_target
        .map(target => <LogTarget>target.toLowerCase())
        .filter((target: string) => {
            return ['console', 'file'].includes(target);
        });

    return settings;
}
