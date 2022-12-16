import EventBus from '@/lib/EventBus';

describe('EventBus', () => {
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus();
    });

    it('should add a listener for the "on" event', () => {
        const event = 'test-event';
        const listener = jest.fn();

        eventBus.on(event, listener);
        eventBus.emit(event);

        expect(listener).toHaveBeenCalled();
    });

    it('should remove a listener for the "off" event', () => {
        const event = 'test-event';
        const listener = jest.fn();

        eventBus.on(event, listener);
        eventBus.off(event, listener);
        eventBus.emit(event);

        expect(listener).not.toHaveBeenCalled();
    });

    it('should trigger all listeners for the "emit" event', () => {
        const event = 'test-event';
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        eventBus.on(event, listener1);
        eventBus.on(event, listener2);
        eventBus.emit(event);

        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
    });

    it('should pass any additional arguments to the listeners in "emit"', () => {
        const event = 'test-event';
        const listener = jest.fn();
        const arg1 = 'arg1';
        const arg2 = 'arg2';

        eventBus.on(event, listener);
        eventBus.emit(event, arg1, arg2);

        expect(listener).toHaveBeenCalledWith(arg1, arg2);
    });

    it('should add a one-time listener for the given event', () => {
        const event = 'test-event';
        const listener = jest.fn();

        eventBus.once(event, listener);
        eventBus.emit(event);
        eventBus.emit(event);

        expect(listener).toHaveBeenCalledTimes(1);
    });
});
