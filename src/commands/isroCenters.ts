import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isrocenters')
    .setDescription('Get information about ISRO centers'),
  async execute(interaction: CommandInteraction) {
    try {
      const response = await axios.get('https://isro.vercel.app/api/centres');
      const centers = response.data.centres;

      let replyContent = 'ISRO Centers:\n\n';
      centers.forEach((center: { name: string, Place: string }) => {
        replyContent += `${center.name} - ${center.Place}\n`;
      });

      await interaction.reply(replyContent);
    } catch (error) {
      console.error('Error fetching ISRO centers:', error);
      await interaction.reply('Sorry, there was an error fetching ISRO centers information.');
    }
  },
};