const { Events, ActivityType } = require('discord.js');
const { findSetupMessage } = require('../utils/reactionRole');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}`);
        client.user.setActivity('3BITS // Develop By: JejeOliver', { type: ActivityType.Watching });

        const channelId = process.env.REACTION_ROLE_CHANNEL_ID;
        if (!channelId) return;

        try {
            const channel = await client.channels.fetch(channelId);
            const setupMessage = await findSetupMessage(channel);
            if (setupMessage) {
                const emoji = process.env.REACTION_EMOJI || '✔️';
                await setupMessage.react(emoji).catch(() => {});
                console.log(`✅ Reaction role message loaded: ${setupMessage.id}`);
            } else {
                console.log('⚠️ No reaction role setup message found. An admin should run /setup once.');
            }
        } catch (error) {
            console.error('Failed to load reaction role message:', error);
        }
    }
};
