const fs = require('fs')

module.exports.run = async(bot, message, args) => {

    let argsresult;
    let counter = 0;
    message.delete()
    await fs.readFile('counter', 'utf8', function(err, data) {
        counter = parseInt(data);
        counter++;
        fs.writeFile("counter", counter.toString(), (err) => {
            if (err) console.log(err);
            message.channel.send(`Nigger Counter: ${counter}`).then((msg) => {
                msg.delete({ timeout: 10000 });
            });
        });
    })


}


module.exports.config = {
    name: "nigger",
    description: "nigger counter",
    aliases: ["nig", "n"]
}