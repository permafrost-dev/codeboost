export function parseFullRepositoryName(fullRepositoryName: string): { owner: string; name: string } {
    if (!fullRepositoryName.includes('/')) {
        throw new Error(`Invalid repository name (missing "/")`);
    }

    const parts = fullRepositoryName.split('/');

    return {
        owner: parts[0],
        name: parts[1],
    };
}
