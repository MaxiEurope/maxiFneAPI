/**
 * 
 * Hello!
 * I'm maxi, trying to create a local API.
 * Hm...
 * 
 */

/** process.env */
require('dotenv').config();
/** catch unhandled errors */
process.on('uncaughtException', function (exception) {
    console.log(exception);
});
process.on('UnhandledPromiseRejectionWarning', function (exception) {
    console.log(exception);
});
/** require express -> app */
const express = require('express');
const app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
/** extra */
const API = require('./routes/API.js');
const USERS = require('./routes/USERS.js');
const fs = require('fs');
const discord = require('discord.js');
const bot = new discord.Client({
    fetchAllMembers: true
});
bot.login(process.env.DISCORD_TOKEN);
bot.once('ready', () => {
    console.log('Discord API on!');
});
let cooldowns = new discord.Collection();
/** config */
const port = process.env.PORT || 3000;
const config = require('./util/config.json');
/** database */
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGODBPASS + process.env.MONGODBCLUSTER + '.mongodb.net/test', {
    useNewUrlParser: true
});
/** bot commands */
bot.commands = new discord.Collection();
const cmds = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
for (const file of cmds) {
    const command = require(`./bot/commands/${file}`);
    bot.commands.set(command.name, command);
}

/**
 * 
 *  APP
 * 
 */

/** get users */
app.get('/users/:id?', async function (req, res) {
    let id = req.params.id;
    /** parameter check */
    if (!id) {
        return res.status(404).send({
            error: 'Missing ID!'
        });
    } else {
        USERS.users(id, bot, res);
    }
});

/** get -> api/params */
app.get('/api/:type?/:id?', async function (req, res) {
    let type = req.params.type;
    let id = req.params.id;
    /** parameter checks */
    if (!type && !id) {
        res.status(404).sendFile('./public/html/info/apiInfo.html', {
            root: __dirname
        });
    } else {
        API.api(type, res, id, bot);
    }
});

/** get -> main */
app.get('/', async function (req, res) {
    let mods = ['327545924261904385', '242718397836558337', '335489881163825152', '234789844444905473'];

    function getMods(bot, ID, type) {
        if (type !== null && type === 'av') return bot.users.get(ID).avatarURL;
        else
            return bot.users.get(ID).tag;
    }
    try {
        await res.render(__dirname + '/public/main.html', {
            nutName: getMods(bot, mods[0]),
            shiName: getMods(bot, mods[1]),
            spaName: getMods(bot, mods[2]),
            nicName: getMods(bot, mods[3]),
            nutAv: getMods(bot, mods[0], 'av'),
            shiAv: getMods(bot, mods[1], 'av'),
            spaAv: getMods(bot, mods[2], 'av'),
            nicAv: getMods(bot, mods[3], 'av')
        });
    } catch (e) {
        console.log(e);
    }
});

/** error event */
/* eslint-disable no-unused-vars */
app.use(function (req, res, next) {
    return res.status(404).send({
        error: 'This endpoint does not exist!'
    });
});

/** app listening on port */
app.listen(port, function () {
    console.log('Fish n Economy API is online on port ' + port);
});

/**
 * 
 * BOT - MESSAGE EVENT
 * 
 */

bot.on('message', async message => {

    if (message.author.bot) return; //if the author is a bot, we return
    if (message.channel.type !== 'text') return; //if the message was sent in a dm, group.. whatever, we return
    if (message.author.id !== config.ownerID) return; //this is only for now!

    /** arguments */
    const prefix = config.prefix; //the bots prefix
    if (!message.content.startsWith(prefix)) return; //if the message does not start with the prefix, we return
    let args = message.content.slice(prefix.length).trim().split(/ +/g), //our arguments
        commandName = args.shift().toLowerCase(), //take an argument from the array and lowercase it
        command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); //get commandname or aliases
    if (!command) return; //we found no command

    /** cooldowns */
    if (!cooldowns.has(command.name)) { //if no command cooldown...
        cooldowns.set(command.name, new discord.Collection()); //...add one!
    }
    const now = Date.now(); //now...
    const timestamps = cooldowns.get(command.name); //...we take the command cooldown...
    const cooldownAmount = (command.cooldown || 3) * 1000; //...multiply with 1000 (ms), if no command cooldown, default 3 seconds

    if (timestamps.has(message.author.id)) { //if cooldown...
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //...take time...

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`🚫 ***${message.author.tag} has to wait ${timeLeft.toFixed(2)} second(s)!***`).then(m => { //return
                m.delete(3500); //delete message after 3.5 seconds
            });
        }
    }

    timestamps.set(message.author.id, now); //set cooldown, if user has no cooldown
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    /** run commands */
    try {
        command.execute(bot, message, args); //try executing command
    } catch (error) {
        console.error(error); //if error, console it
        message.reply('**An error occured!**');
    }

});


/**
 * 
 * IMPORTANT FUNCTIONS
 * 
 */

function generateToken() {
    let randomString = '';
    for (let i = 0; i < 40; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }
    return randomString;
}

/*
function getGuildMembers(bot, req, res) {
    let guildMembers = bot.guilds.get('438387515913797632').members.filter(b => b.user.bot).array();
    let guildResult = [];
    for (let i = 0; i < guildMembers.length; i++) {
        let currentMember = guildMembers[i].user;
        guildResult.push({
            currentMemberID: currentMember.username
        });
    }
    res.status(200).json(guildResult);
}
*/