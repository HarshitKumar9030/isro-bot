import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';
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
    .setDescription('📰 Get the latest news about ISRO'),
  
  async execute(interaction: CommandInteraction) {
    await sendIsroNews(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendIsroNews(message.client as CustomClient, message);
  },
};

async function sendIsroNews(client: CustomClient, target: CommandInteraction | Message) {
  try {
    const response = await axios.get('https://www.isro.gov.in/rss.xml');
    parseString(response.data, async (err, result) => {
      if (err) {
        throw new Error('Error parsing RSS feed');
      }

      const newsItems = result.rss.channel[0].item.slice(0, 5) as NewsItem[];
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Latest ISRO News')
        .setDescription('Here are the latest news items from ISRO:')
        .setTimestamp()
        .setFooter({ text: 'Source: ISRO RSS Feed', iconURL: client.user?.avatarURL() || undefined });

      newsItems.forEach((item: NewsItem) => {
        embed.addFields({ 
          name: item.title[0], 
          value: `${item.description[0].slice(0, 100)}... [Read more](${item.link[0]})`
        });
      });

      if (target instanceof CommandInteraction) {
        await target.reply({ embeds: [embed] });
      } else {
        const channel = target.channel;
        if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel || channel instanceof ThreadChannel) {
          await channel.send({ embeds: [embed] });
        } else {
          console.error('Unable to send message: Invalid channel type');
        }
      }
    });
  } catch (error) {
    console.error('Error fetching ISRO news:', error);
    const errorMessage = 'Sorry, there was an error fetching the latest ISRO news. Please try again later.';
    
    if (target instanceof CommandInteraction) {
      await target.reply(errorMessage);
    } else {
      const channel = target.channel;
      if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel || channel instanceof ThreadChannel) {
        await channel.send(errorMessage);
      } else {
        console.error('Unable to send error message: Invalid channel type');
      }
    }
  }
}

export default module.exports;