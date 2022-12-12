import { customAlphabet } from 'nanoid';
import semver, { SemVer } from 'semver';

/**
 * It takes a version string like '1' or '1.0.3' and return the short version like '1.0'.
 * @param {string} version - The version string to convert.
 * @returns {string}A string
 */
export const versionToShortVersion = (version: string) => {
    const sv = <SemVer>semver.coerce(version);

    return `${sv.major}.${sv.minor}`;
};

/**
 * generates a unique run id for a boost run
 * @returns {string}
 */
export const generateRunId = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const func = customAlphabet(alphabet + numbers, 14);

    return func(14);
};
