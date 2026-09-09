const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup bot messages (Admin only)')
        .setDefaultMemberPermissions(0x00000008),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const reactionChannel = interaction.guild.channels.cache.get(process.env.REACTION_ROLE_CHANNEL_ID);
        if (reactionChannel) {
            const msg = await reactionChannel.send('CLICK ✔️ TO ASSIGN YOURSELF A ROLE !! ');
            await msg.react('✔️');
            await interaction.editReply(`✔️ Reaction role message sent to ${reactionChannel}`);
        } else {
            await interaction.editReply('❌ Reaction role channel not found. Check REACTION_ROLE_CHANNEL_ID in .env');
        }
    }
};