const Discord = require('discord.js')
require('dotenv').config()
const fs = require('fs')
var commands = []

fs.readdir("./commands/", (err, files) => {
    if (err) return console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        return console.log("[LOGS] Couldn't Find Commands!")
    }
    jsfile.forEach((f) => {
        let pull = require(`./${f}`)
        commands.push("```" + pull.config.name + "```")
    })
})

module.exports.run = async(bot, message, args) => {
    message.delete()
    if (args[0]) {
        let command = args[0]
        if (bot.commands.has(command)) {
            command = bot.commands.get(command)
            var SHembed = new Discord.MessageEmbed()
                .setColor("#000")
                .setAuthor(bot.user.username, bot.user.displayAvatarURL)
                .setDescription(`The bot prefix is: !\n\n**Command:** ${command.config.name}\n
            **Usage:** ${command.config.usage || "No Usages"}\n
            **Aliases:** ${command.config.aliases}`)
            message.channel.send(SHembed)
        }
    }

    if (!args[0]) {
        message.delete()
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Help Command!`, message.guild.iconURL)
            .setColor("#000")
            .setDescription(`${message.author.username} check your dms!`)
        let Sembed = new Discord.MessageEmbed()
            .setColor("#000")
            .setAuthor('ĐUCK SQUAĐ - Bot', message.guild.iconURL())
            .setThumbnail("https://i1.sndcdn.com/artworks-000830725738-e65q3c-t500x500.jpg")
            .setTimestamp()
            .setDescription(`These are the avaliable commands for the ${bot.user.username}!\nThe bot prefix is: !`)
            .addField(`Commands:`, commands.join("") || "No Commands found")
        message.channel.send(embed).then((msg) => {
            msg.delete({ timeout: 5000 });
        });
        message.author.send(Sembed)
    }
}

module.exports.config = {
    name: "help",
    aliases: ["h", "commands", "plshelpme", "help", "assistme"],
    usage: `!help or !help mute`,
    description: "Lists all Commands",
    accessableby: "Members"
}