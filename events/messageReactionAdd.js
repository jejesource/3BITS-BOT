const { Events } = require('discord.js');
const {
    resolvePartialReaction,
    isReactionRoleChannel,
    emojiMatches,
    getReactionRole
} = require('../utils/reactionRole');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot) return;

        const fullReaction = await resolvePartialReaction(reaction);
        if (!fullReaction) return;
        if (!isReactionRoleChannel(fullReaction.message)) return;
        if (!emojiMatches(fullReaction)) return;

        const role = await getReactionRole(fullReaction.message.guild);
        if (!role) {
            console.error('Reaction role not found. Check REACTION_ROLE_ID.');
            return;
        }

        const member = await fullReaction.message.guild.members.fetch(user.id);
        await member.roles.add(role).catch(console.error);
        console.log(`Added role ${role.name} to ${user.tag}`);
    }
};
