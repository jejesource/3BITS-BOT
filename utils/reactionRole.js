const SETUP_MARKER = 'CLICK ✔️ TO ASSIGN YOURSELF A ROLE';

function normalizeEmoji(value) {
    return String(value || '').replace(/\uFE0F/g, '');
}

function emojiMatches(reaction) {
    const expected = process.env.REACTION_EMOJI || '✔️';
    const name = reaction.emoji?.name;
    return (
        name === expected ||
        normalizeEmoji(name) === normalizeEmoji(expected) ||
        reaction.emoji?.toString() === expected
    );
}

async function resolvePartialReaction(reaction) {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Failed to fetch reaction:', error);
            return null;
        }
    }

    if (reaction.message?.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.error('Failed to fetch reaction message:', error);
            return null;
        }
    }

    return reaction;
}

function isReactionRoleChannel(message) {
    return message?.channel?.id === process.env.REACTION_ROLE_CHANNEL_ID;
}

async function getReactionRole(guild) {
    const roleId = process.env.REACTION_ROLE_ID;
    if (!roleId) return null;
    return guild.roles.cache.get(roleId) || guild.roles.fetch(roleId).catch(() => null);
}

async function findSetupMessage(channel) {
    const messages = await channel.messages.fetch({ limit: 50 });
    return messages.find(
        (msg) => msg.author.id === channel.client.user.id && msg.content.includes(SETUP_MARKER)
    ) || null;
}

module.exports = {
    SETUP_MARKER,
    emojiMatches,
    resolvePartialReaction,
    isReactionRoleChannel,
    getReactionRole,
    findSetupMessage
};
