import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mangalyaan')
    .setDescription('Get information about India\'s Mars Orbiter Mission (Mangalyaan)'),
  async execute(interaction: CommandInteraction) {
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
      .setFooter({ text: 'Source: ISRO', iconURL: interaction.client.user?.avatarURL() || undefined });

    await interaction.reply({ embeds: [embed] });
  },
};