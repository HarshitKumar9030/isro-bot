import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isrospacecraft')
    .setDescription('🛰️ Get information about ISRO spacecraft'),
  
  async execute(interaction: CommandInteraction) {
    await sendIsroSpacecraft(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendIsroSpacecraft(message.client as CustomClient, message);
  },
};

async function sendIsroSpacecraft(client: CustomClient, target: CommandInteraction | Message) {
  try {
    const response = await axios.get('https://isro.vercel.app/api/spacecrafts');
    const spacecraft = response.data.spacecrafts;

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('ISRO Spacecraft')
      .setDescription('Here is a list of ISRO spacecraft:')
      .setTimestamp()
      .setFooter({ text: 'Source: ISRO API', iconURL: client.user?.avatarURL() || undefined });

    spacecraft.forEach((craft: { name: string }, index: number) => {
      if (index % 25 === 0 && index !== 0) {
        if (target instanceof CommandInteraction) {
          target.followUp({ embeds: [embed] });
        } else {
          const channel = target.channel;
          if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel || channel instanceof ThreadChannel) {
            channel.send({ embeds: [embed] });
          }
        }
        embed.setFields([]);
      }
      embed.addFields({ name: `Spacecraft ${index + 1}`, value: craft.name });
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
    console.error('Error fetching ISRO spacecraft:', error);
    const errorMessage = 'Sorry, there was an error fetching ISRO spacecraft information. Please try again later.';
    
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