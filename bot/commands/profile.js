module.exports = {
    name: 'profile',
    description: 'Set your profile and view it on our website! Available settings: color, shortdesc, longdesc.',
    usage: 'profile <setting>',
    cooldown: 3,
    async execute(bot, message, args) {

        const Profile = require('../../database/mongo/profile.js'); //profile database
        const discord = require('discord.js'); //discord.js lib for our embed message
        const lettercount = require('letter-count'); //will count the amount of characters
        const util = require('../../util/bot/color.js'); //will check color

        /** find our document by userID */
        Profile.findOne({
            userID: message.author.id
        }, (err, profile) => {
            if (err) throw err;
            /** no database for this user found -> we're creating a new one */
            if (!profile) {
                let newP = new Profile({
                    userID: message.author.id,
                    color: '#27ae61',
                    shortDesc: 'A Fish n Economy user.',
                    longDesc: 'Not specified!',
                    createdAt: Date.now()
                });
                newP.save().catch(err => console.log(err));
                return message.channel.send(`**Added ${message.author.tag} to the database!**`);
            } else {
                if (!args.length) {
                    const embed = new discord.RichEmbed()
                        .setAuthor(`${message.author.tag}'s online profile`, message.author.avatarURL)
                        .setURL(`http://localhost:3000/users/${message.author.id}`)
                        .addField('Short description', profile.shortDesc)
                        .addField('Long Description - supports markdown', profile.longDesc)
                        .addField('Color', profile.color)
                        .setColor(profile.color)
                        .setFooter('Account created at')
                        .setTimestamp(profile.createdAt);
                    message.channel.send(`localhost:3000/users/${message.author.id}`, embed);
                } else {
                    let type = args[0];
                    if (type.toLowerCase() === 'shortdesc') {
                        const text = args.slice(1).join(' ');
                        if (!text) return message.channel.send('🚫 **You need to include some info!**');
                        const count = lettercount.count(text).chars;
                        if (count > 100) return message.channel.send('🚫 **Limit your short description to max. 100 characters!**');
                        profile.shortDesc = text;
                        profile.save().catch(err => console.log(err));
                    } else if (type.toLowerCase() === 'longdesc') {
                        const text = args.slice(1).join(' ');
                        if (!text) return message.channel.send('🚫 **You need to include some info - use some markdown!**');
                        const count = lettercount.count(text).chars;
                        if (count < 30) return message.channel.send('🚫 **Please include some information - min. 30 characters!**');
                        if (count > 250) return message.channel.send('🚫 **Limit your long description to max. 250 characters! You can use markdown.**');
                        profile.longDesc = text;
                        profile.save().catch(err => console.log(err));
                    } else if (type.toLowerCase() === 'color') {
                        if (util.isColor(args[1]) === 'noColor') return message.channel.send('🚫 **That\'s an invalid color! Use CSS or hex colors.**');
                        else {
                            profile.color = util.isColor(args[1]);
                            profile.save().catch(err => console.log(err));
                        }
                    } else {
                        return message.channel.send('🚫 **Invalid arguments!**');
                    }
                    message.channel.send('✅ **Successfully saved your information! It may take 5 seconds for the information to finally appear on the website.**\n' +
                        '<http://localhost:3000/users/' + message.author.id + '/>');
                }
            }
        });
    },
};