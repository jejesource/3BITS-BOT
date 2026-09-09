const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot) return;
        if (reaction.message.channel.id !== process.env.REACTION_ROLE_CHANNEL_ID) return;
        if (reaction.emoji.name !== process.env.REACTION_EMOJI) return;

        const role = reaction.message.guild.roles.cache.get(process.env.REACTION_ROLE_ID);
        if (!role) return;

        const member = await reaction.message.guild.members.fetch(user.id);
        await member.roles.add(role).catch(() => {});
    }
};
