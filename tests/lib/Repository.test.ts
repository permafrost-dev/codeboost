import { Repository } from '@/lib/Repository';

it('sets properties correctly on create', async () => {
    const repository = new Repository('owner/name', 'path');

    expect(repository).toBeInstanceOf(Repository);

    expect(repository.name).toBe('name');
    expect(repository.owner).toBe('owner');
    expect(repository.path).toBe('path/owner/name');

    expect(repository).toMatchSnapshot();
});
