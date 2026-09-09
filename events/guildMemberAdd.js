const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        if (channel) {
            await channel.send(`Hello ${member} Welcome to **3-BITS**!!`);
        }

        const role = member.guild.roles.cache.get(process.env.AUTO_ROLE_ID);
        if (role) {
            await member.roles.add(role).catch(() => {});
        }
    }
};
