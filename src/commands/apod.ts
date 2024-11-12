import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apod')
    .setDescription('🌌 Get NASA\'s Astronomy Picture of the Day'),
  
  async execute(interaction: CommandInteraction) {
    await sendApod(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendApod(message.client as CustomClient, message);
  },
};

async function sendApod(client: CustomClient, target: CommandInteraction | Message) {
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
    const apodData = response.data;

    const embed = new EmbedBuilder()
      .setColor(0x0B3D91) // NASA blue
      .setTitle(`🔭 ${apodData.title}`)
      .setDescription(apodData.explanation)
      .setImage(apodData.url)
      .setFooter({ text: `© ${apodData.copyright || 'NASA'}`, iconURL: client.user?.avatarURL() || undefined })
      .setTimestamp(new Date(apodData.date));

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
  } catch (error) {
    console.error('Error fetching NASA APOD:', error);
    const errorMessage = 'Sorry, there was an error fetching the Astronomy Picture of the Day.';
    
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