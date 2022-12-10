import { versionToShortVersion } from '@/lib/helpers';

it('shortens a version string', () => {
    expect(versionToShortVersion('1')).toBe('1.0');
    expect(versionToShortVersion('1.0.3')).toBe('1.0');
    expect(versionToShortVersion('1.41.3')).toBe('1.41');
});
