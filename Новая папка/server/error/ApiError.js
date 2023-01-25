class ApiError extends Error{
    constructor(status, message) {
        super();   // вызываем родительский конструктор
        this.status = status;
        this.message = message;
    }

    static badRequest(message) { //статические функции - это функции которые можно вызывать без создания объекта, можем обращаться напрямую к классу
        return new ApiError(404, message)
    }

    static internel(message) {
        return new ApiError(500, message)
    }

    static forbiden(message) { //если нет доступа
        return new ApiError(403, message)
    }
}
module.exports = ApiError;