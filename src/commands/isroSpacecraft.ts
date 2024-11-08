import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isrospacecraft')
    .setDescription('Get information about ISRO spacecraft'),
  async execute(interaction: CommandInteraction) {
    try {
      const response = await axios.get('https://isro.vercel.app/api/spacecrafts');
      const spacecraft = response.data.spacecrafts;

      let replyContent = 'ISRO Spacecraft:\n\n';
      spacecraft.forEach((craft: { name: string }) => {
        replyContent += `${craft.name}\n`;
      });

      await interaction.reply(replyContent);
    } catch (error) {
      console.error('Error fetching ISRO spacecraft:', error);
      await interaction.reply('Sorry, there was an error fetching ISRO spacecraft information.');
    }
  },
};