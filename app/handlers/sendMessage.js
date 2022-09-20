class Message {
    //Any
    static sendMessage = (apiStatus, data, message) => ({
        apiStatus,
        data,
        message,
    });

    //Success
    static sendSuccess = (data, message) =>
        Message.sendMessage(true, data, message);

    //Error
    static sendError = e => Message.sendMessage(false, e, e.message);
}
module.exports = Message;
