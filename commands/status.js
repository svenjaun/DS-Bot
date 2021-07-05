const fse = require('fs-extra')
const Discord = require('discord.js')

module.exports.run = async(bot, message, args) => {
    message.delete()
    await fse.readJson('./counter.json', 'utf8', function(err, json) {

        let member = message.mentions.members.first();
        if (!member) {
            member = message.mentions.roles.first();
            if (member) {
                singleState(message, member, json);
                return
            }
        } else {
            singleState(message, member, json);
            return
        }

        printAllStats(bot, message, json);
    })
}

function singleState(message, member, json) {
    writeMessage(message, json[member] ? `${member} got Niggerd ${json[member].counter} times` : `${member} hasn't got Niggerd yet`)

}

function printAllStats(bot, message, json) {
    let fields = [{
        name: '\u200b',
        value: '\u200b',
        inline: false,
    }];
    let plannedDiff = 1000 * 60 * 5; // Five Minutes
    let totalCount = 0;
    for (let obj in json) {
        let diffTime = Math.abs(new Date() - new Date(json[obj].lastChanged));
        let seconds = parseInt((plannedDiff - diffTime) / 1000)
        if (seconds <= 0) {
            seconds = "ready"
        } else {
            seconds += " seconds"
        }
        let name = json[obj].username;
        if (name != "ĐUCK SQUAĐ") {
            fields.push({
                name: name,
                value: `Counter: ${json[obj].counter} \n Cooldown: \n${seconds}`,
                inline: true,
            })
            totalCount += json[obj].counter;
        }
    }

    fields.push({
        name: "ĐUCK SQUAĐ",
        value: `Counter: ${totalCount}`
    })

    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#000')
        .setTitle('Nigger counter stats')
        .setAuthor('ĐUCK SQUAĐ - Bot', message.guild.iconURL())
        .setThumbnail("https://i1.sndcdn.com/artworks-000830725738-e65q3c-t500x500.jpg")
        .addFields(fields)
        .setTimestamp()

    writeMessage(message, exampleEmbed)
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