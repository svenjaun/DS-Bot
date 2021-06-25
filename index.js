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




let token = process.env.TOKEN;

let lastUserCount = 0;

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