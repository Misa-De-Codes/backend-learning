//Just creating a child class for custom error response

class ApiResponse extends Error {
    constructor (statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }

