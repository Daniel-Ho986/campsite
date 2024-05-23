// Catching any asynchronous errors and passing them to Express's error handling middleware.
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}