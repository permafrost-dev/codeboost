/* eslint-disable sort-keys */

import dayjs from 'dayjs';
import merge from 'deepmerge';
import winston, { Logger } from 'winston';

export type LogTarget = 'console' | 'file';

export class HasLogger {
    public logger!: Logger;

    public createLogger(targets: LogTarget[], defaultMeta: Record<string, any>) {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta,
            transports: [],
        });

        if (targets.includes('file')) {
            new winston.transports.File({ filename: `${__dirname}/codeboost.log` });
        }

        if (targets.includes('console')) {
            this.logger.add(new winston.transports.Console({ format: winston.format.simple() }));
        }
    }

    public log(message: string, meta: any[] = []) {
        if (!this.logger) {
            return;
        }

        this.logger.info(message, ...[ merge.all([{ _ts: dayjs().toISOString() }, ...meta ]) ]);
    }
}
