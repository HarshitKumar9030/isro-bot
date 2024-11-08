import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Collection } from 'discord.js';
import { CustomClient } from '../index'; 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available commands'),
  async execute(interaction: CommandInteraction) {
    const client = interaction.client as CustomClient;
    const commands = client.commands;
    
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('ISRO Bot Commands')
      .setDescription('Here are all the available commands:')
      .setTimestamp()
      .setFooter({ text: 'ISRO Bot', iconURL: client.user?.avatarURL() || undefined });

    commands.forEach((command) => {
      helpEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description });
    });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};