const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a support ticket menu')
        .setDefaultMemberPermissions(0x00000020),

    async execute(interaction) {
        await interaction.deferReply();

        const file = new AttachmentBuilder('./ticket.png', { name: 'ticket.png' });

        const ticketEmbed = new EmbedBuilder()
            .setColor('#ffffff')
            .setTitle('🎫 3-BITS SUPPORT TICKET')
            .setDescription('Click the button below to create a support ticket.')
            .setImage('attachment://ticket.png')
            .setFooter({ text: '3BITS SUPPORT' })
            .setTimestamp();

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_support')
                    .setLabel('Ticket Support')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📩')
            );

        await interaction.editReply({ embeds: [ticketEmbed], components: [buttons], files: [file] });
    }
};
