const { Events } = require('discord.js');
const {
    resolvePartialReaction,
    isReactionRoleChannel,
    emojiMatches,
    getReactionRole
} = require('../utils/reactionRole');

module.exports = {
    name: Events.MessageReactionRemove,
    async execute(reaction, user) {
        if (user.bot) return;

        const fullReaction = await resolvePartialReaction(reaction);
        if (!fullReaction) return;
        if (!isReactionRoleChannel(fullReaction.message)) return;
        if (!emojiMatches(fullReaction)) return;

        const role = await getReactionRole(fullReaction.message.guild);
        if (!role) return;

        const member = await fullReaction.message.guild.members.fetch(user.id);
        await member.roles.remove(role).catch(() => {});
    }
};
