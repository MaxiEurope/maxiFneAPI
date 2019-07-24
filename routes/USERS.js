async function getUser(id, bot, res) {

    const Profile = require('../database/mongo/profile.js');
    const {
        toHTML
    } = require('discord-markdown');
    Profile.findOne({
        userID: id
    }, async (err, user) => {
        if(err) throw err;
        if(!user){
            res.status(404).send({
                error: 'User not found!'
            });
        }else{
            let uTag,
                uAvatar;
            try {
                uTag = bot.users.get(id).tag;
            } catch (e) {
                uTag = 'A User#0000';
            }
            try {
                uAvatar = bot.users.get(id).avatarURL;
            } catch (e) {
                uAvatar = 'https://cdn.discordapp.com/attachments/475276057013125130/602967633339351058/322c936a8c8be1b803cd94861bdfa868.png';
            }
            await res.render('../views/user.html', {
                color: user.color,
                tag: uTag,
                ID: id,
                avatar: uAvatar,
                shortDesc: user.shortDesc,
                longDesc: toHTML(user.longDesc),
                createdAt: (new Date(user.createdAt)).toGMTString()
            });
        }
    });

}

exports.users = (id, bot, res) => {
    getUser(id, bot, res);
};