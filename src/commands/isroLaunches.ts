import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isrolaunches')
    .setDescription('🚀 Get information about upcoming ISRO launches'),
  
  async execute(interaction: CommandInteraction) {
    await sendIsroLaunches(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendIsroLaunches(message.client as CustomClient, message);
  },
};

async function sendIsroLaunches(client: CustomClient, target: CommandInteraction | Message) {
  try {
    const mockLaunches = [
      { mission: 'PSLV-C53', date: '2023-06-30', payload: 'Earth Observation Satellite' },
      { mission: 'GSLV-F12', date: '2023-08-15', payload: 'Communication Satellite' },
      { mission: 'SSLV-D2', date: '2023-09-02', payload: 'Small Satellite' },
    ];

    const embed = new EmbedBuilder()
      .setTitle('🇮🇳 Upcoming ISRO Launches')
      .setColor(0xFF9933) 
      .setDescription('Here are the upcoming launches by the Indian Space Research Organisation (ISRO):')
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
      iconURL: client.user?.avatarURL() || undefined 
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
  } catch (error) {
    console.error('Error fetching ISRO launches:', error);
    const errorMessage = 'Sorry, there was an error fetching information about upcoming ISRO launches. Please try again later.';
    
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