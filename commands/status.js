const fse = require('fs-extra')
const Discord = require('discord.js')

module.exports.run = async(bot, message, args) => {

    message.delete()
    await fse.readJson('./counter.json', 'utf8', function(err, json) {

        let fields = [{
            name: '\u200b',
            value: '\u200b',
            inline: false,
        }];
        let plannedDiff = 1000 * 60 * 5; // Five Minutes
        for (let obj in json) {
            let diffTime = Math.abs(new Date() - new Date(json[obj].lastChanged));
            let seconds = parseInt((plannedDiff - diffTime) / 1000)
            if (seconds <= 0) {
                seconds = "ready"
            } else {
                seconds += " seconds"
            }
            let name = getUsername(bot, message.guild.id, obj);
            fields.push({
                name: name,
                value: `Counter: ${json[obj].counter} \n Cooldown: \n${seconds}`,
                inline: true,
            })
        }
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#000')
            .setTitle('Nigger counter stats')
            .setAuthor('ĐUCK SQUAĐ - Bot', message.guild.iconURL())
            .setThumbnail("https://i1.sndcdn.com/artworks-000830725738-e65q3c-t500x500.jpg")
            .addFields(fields)
            .setTimestamp()

        writeMessage(message, exampleEmbed)
    })
}

function writeMessage(message, messageText) {

    message.channel.send(messageText).then((msg) => {
        msg.delete({ timeout: 20000 });
    });
}

function getUsername(bot, guildid, obj) {
    let username = "";
    bot.guilds.cache.get(guildid).members.cache.tap((user) => {
        user.filter((member) => {
            if (member.user.id === obj.replace("@", "").replace("<", "").replace(">", "")) {
                username = member.user.nickname ? member.user.nickname : member.user.username;
            }
        })
    })
    if (username !== "") {
        return username
    }
    bot.guilds.cache.get(guildid).roles.cache.tap((roles) => {
        roles.filter((something) => {
            if (something.id === obj.replace("@", "").replace("<", "").replace(">", "").replace("&", "")) {
                username = `Role: ${something.name}`;
            }
        })
    })
    return username !== "" ? username : obj;
}


module.exports.config = {
    name: "status",
    description: "give counter status",
    aliases: ["s", "stats"]
}