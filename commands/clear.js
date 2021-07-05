module.exports.run = async(bot, message, args) => {

    let mins = 30;
    if (args[0]) {
        if (parseInt(args[0]) > 120 || parseInt(args[0]) < 1) {
            mins = 30;
        } else {
            mins = parseInt(args[0])
        }
    }
    mins = mins ? mins : 30;
    message.channel.messages.fetch().then((messages) => {
        messages.forEach(msg => {
            let oldDate = new Date(msg.createdTimestamp);
            let diffTime = Math.abs(new Date() - oldDate); // ms 
            let plannedDiff = 1000 * mins; // Five Minutes
            if (diffTime < plannedDiff) {
                msg.delete();
            }
        })
    })

}

module.exports.config = {
    name: "clear",
    aliases: ["c", "clear", "cls"],
    usage: `!clear`,
    description: "Clear messages in bot channel"
}