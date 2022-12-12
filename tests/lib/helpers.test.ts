import { generateRunId, versionToShortVersion } from '@/lib/helpers';

it('shortens a version string', () => {
    expect(versionToShortVersion('1')).toBe('1.0');
    expect(versionToShortVersion('1.0.3')).toBe('1.0');
    expect(versionToShortVersion('1.41.3')).toBe('1.41');
});

it('generates a run id', () => {
    expect(generateRunId().length).toBeGreaterThan(1);
});

it('generates unique run ids', () => {
    const ids = new Set();

    for (let i = 0; i < 100; i++) {
        ids.add(generateRunId());
    }

    expect(ids.size).toBe(100);
});
