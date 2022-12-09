import { parseFullRepositoryName } from '@/lib/stringHelpers';

it('should parse a full repository name', () => {
    const result = parseFullRepositoryName('owner/name');
    expect(result).toEqual({ owner: 'owner', name: 'name' });
});
