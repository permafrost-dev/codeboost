import Conf from 'conf';
import yaml from 'js-yaml';

const ConfBaseConfig = {
    cwd: __dirname,
    deserialize: (text: string) => yaml.load(text),
    serialize: value => yaml.dump(value, { indent: 2 }),
    fileExtension: 'yml',
};

export function createConf(name: string, options: Record<string, any> = {}): Conf {
    return new Conf(<any>{
        configName: name,
        ...Object.assign({}, ConfBaseConfig, options),
    });
}
