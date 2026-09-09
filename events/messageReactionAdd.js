const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        console.log(`Reaction added: ${reaction.emoji.name} by ${user.tag}`);
        if (user.bot) return;
        console.log(`Channel: ${reaction.message.channel.id}, Expected: ${process.env.REACTION_ROLE_CHANNEL_ID}`);
        console.log(`Emoji: ${reaction.emoji.name}, Expected: ${process.env.REACTION_EMOJI}`);
        if (reaction.message.channel.id !== process.env.REACTION_ROLE_CHANNEL_ID) return;
        if (reaction.emoji.name !== process.env.REACTION_EMOJI) return;

        const role = reaction.message.guild.roles.cache.get(process.env.REACTION_ROLE_ID);
        console.log(`Role found: ${role ? role.name : 'NOT FOUND'}`);
        if (!role) return;

        const member = await reaction.message.guild.members.fetch(user.id);
        await member.roles.add(role).catch(console.error);
        console.log(`Added role ${role.name} to ${user.tag}`);
    }
};
