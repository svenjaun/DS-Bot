const fse = require('fs-extra')

module.exports.run = async(bot, message, args) => {
    message.delete()
    await fse.readJson('./counter.json', 'utf8', function(err, json) {
        let member = message.mentions.members.first();
        if (!member) {
            member = message.mentions.roles.first();
            if (!member) {
                member = "ĐUCK SQUAĐ";
            }
        }

        writeMessage(message, json[member] ? `${member} got Niggerd ${json[member].counter} times` : `${member} hasn't got Niggerd yet`)
    })
}

function writeMessage(message, messageText) {
    message.channel.send(messageText).then((msg) => {
        msg.delete({ timeout: 10000 });
    });
}

module.exports.config = {
    name: "status",
    description: "give counter status",
    aliases: ["s", "stats"]
}

// https://i1.sndcdn.com/artworks-000830725738-e65q3c-t500x500.jpg