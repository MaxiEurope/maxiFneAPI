module.exports = {
    name: 'markdown',
    description: 'Transforms your markdown into html!',
    usage: 'markdown <text>',
    cooldown: 5,
    async execute(bot, message, args) {

        //const discord = require('discord.js'); //discord.js lib for our embed message
        const lettercount = require('letter-count'); //will count the amount of characters
        const {
            toHTML
        } = require('discord-markdown'); //discord-markdown

        const text = args.join(' ');
        if (!text) return message.channel.send('🚫 **You need to include some text!**');
        const count = lettercount.count(text).chars;
        if (count > 250) return message.channel.send('🚫 **Limit your markdown info to max. 250 characters!**');

        message.channel.send(toHTML(text), {
            split: true
        }).catch(err => message.reply(err));

    },
};