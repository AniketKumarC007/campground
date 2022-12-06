class ExpressError extends Error{
    constructor(message , satusCode){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
module.exports = ExpressError;
// read error handling once again  :(