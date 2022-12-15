import EventEmitter2 from 'eventemitter2';

export default class EventBus {
    public emitter: EventEmitter2;

    constructor() {
        this.emitter = new EventEmitter2();
    }

    public on(event: string, listener: (...args: any[]) => void) {
        return this.emitter.on(event, listener);
    }

    public off(event: string, listener: (...args: any[]) => void) {
        return this.emitter.off(event, listener);
    }

    public emit(event: string, ...args: any[]) {
        return this.emitter.emit(event, ...args);
    }

    public once(event: string, listener: (...args: any[]) => void) {
        return this.emitter.once(event, listener);
    }
}

export const eventbus = new EventBus();
