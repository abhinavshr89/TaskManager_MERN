// Define a custom Error class called ErrorHandler which extends the built-in Error class
class ErrorHandler extends Error {
    // Constructor function that takes a message and a statusCode as parameters
    constructor(message, statusCode) {
        // Call the constructor of the parent class (Error) with the provided message
        super(message);
        // Set the statusCode property of the instance to the provided statusCode
        this.statusCode = statusCode;
    }
}

// Define an error middleware function to handle errors in Express.js
export const errorMiddleware = (err, req, res, next) => {
    // If the error message is not provided, set it to a default value "Internal Server Error"
    err.message = err.message || "Internal Server Error";
    // If the statusCode is not provided, set it to a default value 500 (Internal Server Error)
    err.statusCode = err.statusCode || 500;

    if (err.name === 'CastError') {
        const message = `Resource not found: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};


export default ErrorHandler;