async function api(type, res, id, bot) {

    /** urban */
    if (type === 'urban') {
        if (!id) {
            return res.status(404).send({error: 'Missing parameters!'});
        } else {
            const urban = require('urban-dictionary');
            urban.term(id, async (err, udResult) => {
                if (err) return res.status(404).send({
                    error: 'Request failed!'
                });
                try {
                    await res.status(200).send({
                        definition: udResult[Math.round(Math.random() * udResult.length - 1)].definition,
                        word: id
                    });
                } catch (e) {
                    console.log(e);
                }
            });
        }
    } else if (type === 'ID') {
        if (!id) {
            return res.status(404).send({error: 'Missing parameters!'});
        } else {
            try {
                await res.status(200).send({
                    ID: id,
                    tag: bot.users.get(id).tag,
                    avatar: bot.users.get(id).avatarURL
                });
            } catch (e) {
                res.status(404).send({
                    error: 'Invalid user!'
                });
            }
        }
    } else {
        return res.status(404).send({
            error: 'That\'s not a endpoint!'
        });
    }

}

exports.api = (type, res, id, bot) => {
    api(type, res, id, bot);
};