export interface AppSettings {
    github_token: string;
}

export function loadSettings(filename: string): AppSettings {
    const settings = require(filename);

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

    return settings;
}
