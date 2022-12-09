import { AppSettings, transformSettings } from '@/lib/AppSettings';

const createSettings = (overrides: Partial<AppSettings> = {}): AppSettings => ({
    github_token: 'foo',
    repository_storage_path: 'bar',
    use_forks: true,
    use_pull_requests: true,
    ...overrides,
});

it('should return the original settings if no environment variable references are found', () => {
    const settings = createSettings({github_token: 'foo',});

    expect(transformSettings(settings)).toEqual(settings);
});

it('should return the original settings if environment variable references are found but not set', () => {
    const settings = createSettings({github_token: '$UNSET_ENV_VAR_NAME',});

    expect(transformSettings(settings)).toEqual(settings);
});

it('should replace environment variable references with their values', () => {
    process.env.TEST_ENV_VAR_NAME_FOO = 'bar';

    const settings = createSettings({github_token: '$TEST_ENV_VAR_NAME_FOO',});

    expect(transformSettings(settings).github_token).toEqual('bar');
});
