const fs = require('fs')
const fse = require('fs-extra')

module.exports.run = async(bot, message, args) => {

    message.delete()
    await fse.readJson('./counter.json', 'utf8', function(err, json) {
        counter = parseInt(json);
        let member = message.mentions.members.first();
        if (!member) {
            member = message.mentions.roles.first();
            if (!member) {
                member = "ĐUCK SQUAĐ";
            }
        }

        if (json[member]) {
            let oldDate = new Date(json[member].lastChanged);
            let diffTime = Math.abs(new Date() - oldDate); // ms 
            let plannedDiff = 1000 * 60 * 5; // Five Minutes
            if (diffTime < plannedDiff) {
                writeDeletingMessage(message, `${member} can be Niggerd again in ${parseInt( (plannedDiff -diffTime) / 1000)} seconds`)
                return;
            }

            json[member].counter++;
            json[member].lastChanged = new Date();
        } else {
            json[member] = {}
            json[member].counter = 1;
            json[member].lastChanged = new Date();
        }
        fse.writeJson("./counter.json", json, (err) => {
            if (err) console.log(err);
            writeDeletingMessage(message, `Nigger Counter for ${member} is: ${json[member].counter}`)
        });
    })
}

function writeDeletingMessage(message, messageText) {
    message.channel.send(messageText).then((msg) => {
        msg.delete({ timeout: 10000 });
    });
}

module.exports.config = {
    name: "nigger",
    description: "nigger counter",
    aliases: ["nig", "n"]
}