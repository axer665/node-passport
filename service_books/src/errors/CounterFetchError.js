class CounterFetchError extends Error {
    constructor(message) {
        if (!message) message = 'Ошибка сервиса Счетчика';
        super(message);
        this.name = 'counterFetchError';
    }
}

module.exports = CounterFetchError;