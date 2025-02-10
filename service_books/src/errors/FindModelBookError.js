class FindModelBookError extends Error {
    constructor(message) {
        if (!message) message = 'Ошибка поиска книги';
        super(message);
        this.name = 'findModelBookError';
    }
}

module.exports = FindModelBookError;