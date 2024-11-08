import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isrolaunchers')
    .setDescription('Get information about ISRO\'s launchers'),
  async execute(interaction: CommandInteraction) {
    try {
      const response = await axios.get('https://isro.vercel.app/api/launchers');
      const launchers = response.data.launchers;

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)  // Updated color format
        .setTitle('ISRO Launchers')
        .setDescription('Here are the launchers developed by ISRO:')
        .setTimestamp();

      launchers.forEach((launcher: string) => {
        embed.addFields({ name: launcher, value: 'Launch Vehicle' });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching ISRO launchers:', error);
      await interaction.reply('Sorry, there was an error fetching information about ISRO launchers.');
    }
  },
};