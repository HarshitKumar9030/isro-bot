import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apod')
    .setDescription('Get NASA\'s Astronomy Picture of the Day'),
  async execute(interaction: CommandInteraction) {
    try {
      const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
      const apodData = response.data;

      const embed = new EmbedBuilder()
        .setTitle(apodData.title)
        .setDescription(apodData.explanation)
        .setImage(apodData.url)
        .setFooter({ text: `© ${apodData.copyright || 'NASA'}` })
        .setTimestamp(new Date(apodData.date));

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching NASA APOD:', error);
      await interaction.reply('Sorry, there was an error fetching the Astronomy Picture of the Day.');
    }
  },
};

export default module.exports;