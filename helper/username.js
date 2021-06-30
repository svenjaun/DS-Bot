module.exports.getUsername = (bot, guildId, userJson) => {
    let username;
    bot.guilds.cache.get(guildId).members.cache.tap((user) => {
        user.filter((member) => {

            if (member.user.id === replaceString(userJson)) {
                username = member.nickname ? member.nickname : member.user.username;
            }
        })
    })
    if (username) {
        return username
    }
    bot.guilds.cache.get(guildId).roles.cache.tap((roles) => {
        roles.filter((something) => {
            if (something.id === replaceString(userJson)) {
                username = `Role: ${something.name}`;
            }
        })
    })
    return username !== "" ? username : userJson;
}

function replaceString(string) {
    return string.replace("@", "").replace("<", "").replace(">", "").replace("&", "").replace("!", "")
}