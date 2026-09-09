const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');

function getTicketCount() {
    const data = JSON.parse(fs.readFileSync('./ticket-count.json', 'utf8'));
    return data.count;
}

function setTicketCount(count) {
    fs.writeFileSync('./ticket-count.json', JSON.stringify({ count }, null, 2));
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                const reply = { content: '❌ An error occurred!', ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'ticket_support') {
                const modal = new ModalBuilder()
                    .setCustomId('ticket_modal')
                    .setTitle('3BITS TICKET');

                const ticketInput = new TextInputBuilder()
                    .setCustomId('ticket_name')
                    .setLabel('What can we help you with?')
                    .setPlaceholder('Please describe your question or issue below.')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const firstRow = new ActionRowBuilder().addComponents(ticketInput);

                modal.addComponents(firstRow);

                await interaction.showModal(modal);
            } else if (interaction.customId.startsWith('close_ticket_') || interaction.customId.startsWith('complete_ticket_')) {
                const isClose = interaction.customId.startsWith('close_ticket_');
                const status = isClose ? '❌ Closed' : '✅ Resolved';

                const logEmbed = {
                    color: isClose ? 0xFF0000 : 0x00FF00,
                    title: `${status} Ticket`,
                    description: `Ticket ${isClose ? 'closed' : 'resolved'} by ${interaction.user}`,
                    fields: [
                        { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
                        { name: 'Type', value: interaction.channel.topic || 'N/A', inline: true }
                    ],
                    timestamp: new Date().toISOString()
                };

                const logChannel = interaction.guild.channels.cache.get(process.env.TICKET_LOG_CHANNEL_ID);
                if (logChannel) await logChannel.send({ embeds: [logEmbed] });

                const openerId = interaction.channel.topic?.split(' | ')[1];
                if (openerId) {
                    await interaction.channel.permissionOverwrites.edit(openerId, {
                        SendMessages: false
                    }).catch(() => {});
                }

                const deleteButton = {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 4,
                            label: 'Delete Ticket',
                            custom_id: `delete_ticket_${interaction.channel.id}`
                        }
                    ]
                };

                await interaction.channel.send({ content: `-ticket ${status}`, components: [deleteButton] });
            } else if (interaction.customId.startsWith('delete_ticket_')) {
                await interaction.channel.delete();
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ticket_modal') {
                const ticketNumber = getTicketCount();
                setTicketCount(ticketNumber + 1);

                const name = interaction.fields.getTextInputValue('ticket_name');

                const ticketChannel = await interaction.guild.channels.create({
                    name: `3bits-ticket-${ticketNumber}`,
                    type: 0,
                    topic: `Support | ${interaction.user.id}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ['ViewChannel']
                        },
                        {
                            id: interaction.user.id,
                            allow: ['ViewChannel', 'SendMessages', 'AttachFiles', 'EmbedLinks']
                        }
                    ]
                });

                const ticketEmbed = {
                    color: 0xFF6B00,
                    title: `🎫 Ticket #${ticketNumber}`,
                    description: `Hello ${interaction.user}!\n\n**Reason:** ${name}\n**Opened by:** ${interaction.user.tag}`,
                    footer: { text: '3BITS SUPPORT' },
                    timestamp: new Date().toISOString()
                };

                const closeButtons = {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 4,
                            label: 'Close Ticket',
                            custom_id: `close_ticket_${ticketChannel.id}`
                        },
                        {
                            type: 2,
                            style: 3,
                            label: 'Resolved',
                            custom_id: `complete_ticket_${ticketChannel.id}`
                        }
                    ]
                };

                await ticketChannel.send({ embeds: [ticketEmbed], components: [closeButtons] });
                await interaction.reply({ content: `✅ Your ticket has been created: ${ticketChannel}`, ephemeral: true });
            }
        }
    }
};
