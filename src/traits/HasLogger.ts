/* eslint-disable sort-keys */

import dayjs from 'dayjs';
import winston, { Logger } from 'winston';
import merge from 'deepmerge';
export class HasLogger {
    public logger!: Logger;

    public createLogger(defaultMeta: Record<string, any>) {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta,
            transports: [
                // eslint-disable-next-line array-element-newline
                new winston.transports.File({ filename: `${__dirname}/codeboost.log` }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({ format: winston.format.simple() }));
        }
    }

    public log(message: string, meta: any[] = []) {
        if (!this.logger) {
            return;
        }

        this.logger.info(message, ...[merge.all([{ _ts: dayjs().toISOString() }, ...meta])]);
    }

    public error(message: string, meta: any[] = []) {
        if (!this.logger) {
            return;
        }

        this.logger.error(message, ...[merge.all([{ _ts: dayjs().unix() }, ...meta])]);
    }
}
