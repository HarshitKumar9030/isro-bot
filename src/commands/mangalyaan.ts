import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mangalyaan')
    .setDescription('🔴 Get information about India\'s Mars Orbiter Mission (Mangalyaan)'),
  
  async execute(interaction: CommandInteraction) {
    await sendMangalyaanInfo(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendMangalyaanInfo(message.client as CustomClient, message);
  },
};

async function sendMangalyaanInfo(client: CustomClient, target: CommandInteraction | Message) {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Mars Orbiter Mission (Mangalyaan)')
    .setDescription('India\'s first interplanetary mission.')
    .addFields(
      { name: 'Launch Date', value: 'November 5, 2013' },
      { name: 'Arrival at Mars', value: 'September 24, 2014' },
      { name: 'Mission Duration', value: 'Designed for 6 months, but operated for over 7 years' },
      { name: 'Objectives', value: 'Explore Mars surface features, morphology, mineralogy and Martian atmosphere' },
      { name: 'Key Achievements', value: 'First nation to reach Mars orbit on its first attempt\nLeast expensive Mars mission to date' },
      { name: 'Status', value: 'Mission concluded on October 2, 2022' }
    )
    .setImage('https://www.isro.gov.in/media_isro/image/MOM/mom_latest-v2.jpg')
    .setTimestamp()
    .setFooter({ text: 'Source: ISRO', iconURL: client.user?.avatarURL() || undefined });

  try {
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
    console.error('Error sending Mangalyaan information:', error);
    const errorMessage = 'Sorry, there was an error fetching information about Mangalyaan. Please try again later.';
    
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