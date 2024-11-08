import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isrolaunches')
    .setDescription('🚀 Get information about upcoming ISRO launches'),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    try {
      // Note: This is a mock API call as there's no public API for ISRO launches
      // In a real scenario, you'd need to find a reliable source for this information
      const mockLaunches = [
        { mission: 'PSLV-C53', date: '2023-06-30', payload: 'Earth Observation Satellite' },
        { mission: 'GSLV-F12', date: '2023-08-15', payload: 'Communication Satellite' },
        { mission: 'SSLV-D2', date: '2023-09-02', payload: 'Small Satellite' },
      ];

      const embed = new EmbedBuilder()
        .setTitle('🇮🇳 Upcoming ISRO Launches')
        .setDescription('Here are the upcoming launches by the Indian Space Research Organisation (ISRO):')
        .setColor('#FF9933') // Orange color from the Indian flag
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Indian_Space_Research_Organisation_Logo.svg/1200px-Indian_Space_Research_Organisation_Logo.svg.png')
        .setTimestamp();

      mockLaunches.forEach(launch => {
        embed.addFields({ 
          name: `🛰️ ${launch.mission}`, 
          value: `📅 Date: ${launch.date}\n📦 Payload: ${launch.payload}` 
        });
      });

      embed.setFooter({ 
        text: 'Data is for demonstration purposes only', 
        iconURL: interaction.client.user?.avatarURL() || undefined 
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching ISRO launches:', error);
      await interaction.editReply('Sorry, there was an error fetching information about upcoming ISRO launches. Please try again later.');
    }
  },
};