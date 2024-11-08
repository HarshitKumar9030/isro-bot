import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import axios from 'axios';
import { parseString } from 'xml2js';

interface NewsItem {
  title: string[];
  description: string[];
  link: string[];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isronews')
    .setDescription('Get the latest news about ISRO'),
  async execute(interaction: CommandInteraction) {
    try {
      const response = await axios.get('https://www.isro.gov.in/rss.xml');
      parseString(response.data, (err, result) => {
        if (err) {
          console.error('Error parsing RSS feed:', err);
          interaction.reply('Sorry, there was an error fetching the latest ISRO news.');
          return;
        }

        const newsItems = result.rss.channel[0].item.slice(0, 5) as NewsItem[];
        const embed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle('Latest ISRO News')
          .setDescription('Here are the latest news items from ISRO:')
          .setTimestamp();

        newsItems.forEach((item: NewsItem) => {
          embed.addFields({ 
            name: item.title[0], 
            value: `${item.description[0].slice(0, 100)}... [Read more](${item.link[0]})`
          });
        });

        interaction.reply({ embeds: [embed] });
      });
    } catch (error) {
      console.error('Error fetching ISRO news:', error);
      await interaction.reply('Sorry, there was an error fetching the latest ISRO news.');
    }
  },
};