const { SlashCommandBuilder } = require('discord.js');
const { SETUP_MARKER, findSetupMessage } = require('../utils/reactionRole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup bot messages (Admin only)')
        .setDefaultMemberPermissions(0x00000008),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const reactionChannel = interaction.guild.channels.cache.get(process.env.REACTION_ROLE_CHANNEL_ID);
        if (!reactionChannel) {
            await interaction.editReply('❌ Reaction role channel not found. Check REACTION_ROLE_CHANNEL_ID in .env');
            return;
        }

        const emoji = process.env.REACTION_EMOJI || '✔️';
        const existing = await findSetupMessage(reactionChannel);

        if (existing) {
            await existing.react(emoji).catch(() => {});
            await interaction.editReply(
                `✔️ Reaction role is already set up in ${reactionChannel}. The same message will keep working after Railway restarts — no need to run /setup again.`
            );
            return;
        }

        const msg = await reactionChannel.send(`**${SETUP_MARKER}!!** `);
        await msg.react(emoji);
        await interaction.editReply(`✔️ Reaction role message sent to ${reactionChannel}`);
    }
};
