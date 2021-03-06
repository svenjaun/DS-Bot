const Discord = require('discord.js')
const bot = new Discord.Client({
    disabledEvents: ["TYPING_START"],
    disableEveryone: true,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 240,
    messageSweepInterval: 300
});
const dotenv = require('dotenv');
dotenv.config();
const expressApp = require('express')();
const numbers = require('./numbers')
const fs = require('fs')

bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()

fs.readdir("./commands/", (err, files) => {
    if (err) return console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        return console.log("[LOGS] Couldn't Find Commands!");
    }
    jsfile.forEach((f) => {
        let pull = require(`./commands/${f}`)
        bot.commands.set(pull.config.name, pull)
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        })
    })
})

let token = process.env.TOKEN;
let prefix = "!";

let lastUserCount = 0;

bot.on("message", async(message) => {
    if (message.author.bot || message.channel.type === "dm") return;
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1)

    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if (commandfile) {
        commandfile.run(bot, message, args)
    } else {
        message.channel.send(`Not valid ĐS command`).then((msg) => {
            msg.delete({ timeout: 10000 });
        });
    }
})

bot.on("disconnect", async() => console.log(bot.user.username + " is disconnecting..."))
bot.on("reconnecting", async() => console.log(bot.user.username + "Bot reconnecting..."))
bot.on("error", async err => console.log("Client error: " + err))
bot.on("warn", async info => console.log("Client warning: " + info))

bot.on('ready', () => {
    console.log('Bot is ready...')
    setInterval(() => {
        let currentUserCount = 0;
        for (const channel of bot.channels.cache.filter((channel) => channel.type === "voice")) {
            if (channel[1].name !== "AFK") {
                channel[1].members.tap(coll => currentUserCount += coll.size)
            }
        }
        lastUserCount = currentUserCount;
    }, 1000)
})
bot.login(token)


expressApp.get('/', (req, res) => {
    let final = lastUserCount > 9 ? 10 : lastUserCount;
    res.send({ value: numbers[final] });
});

expressApp.listen(444, () => {
    console.log(`App listening at http://localhost:444`)
});