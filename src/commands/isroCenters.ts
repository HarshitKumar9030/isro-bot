import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isrocenters')
    .setDescription('🏢 Get information about ISRO centers'),
  
  async execute(interaction: CommandInteraction) {
    await sendIsroCenters(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendIsroCenters(message.client as CustomClient, message);
  },
};

async function sendIsroCenters(client: CustomClient, target: CommandInteraction | Message) {
  try {
    const response = await axios.get('https://isro.vercel.app/api/centres');
    const centers = response.data.centres;

    const embeds: any = [];
    let currentEmbed = new EmbedBuilder()
      .setTitle('🇮🇳 ISRO Centers')
      .setDescription('Here are the centers of the Indian Space Research Organisation (ISRO):')
      .setColor(0x138808) 
      .setTimestamp();

    let fieldCount = 0;
    centers.forEach((center: { name: string, Place: string }, index: number) => {
      if (fieldCount === 25) {
        embeds.push(currentEmbed);
        currentEmbed = new EmbedBuilder()
          .setTitle(`🇮🇳 ISRO Centers (Continued ${embeds.length + 1})`)
          .setColor(0x138808)
          .setTimestamp();
        fieldCount = 0;
      }
      currentEmbed.addFields({ name: center.name, value: center.Place });
      fieldCount++;

      if (index === centers.length - 1) {
        embeds.push(currentEmbed);
      }
    });

    embeds[embeds.length - 1].setFooter({ 
      text: 'Source: ISRO API', 
      iconURL: client.user?.avatarURL() || undefined 
    });

    if (target instanceof CommandInteraction) {
      await target.reply({ embeds: [embeds[0]] });
      for (let i = 1; i < embeds.length; i++) {
        await target.followUp({ embeds: [embeds[i]] });
      }
    } else {
      const channel = target.channel;
      if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel || channel instanceof ThreadChannel) {
        for (const embed of embeds) {
          await channel.send({ embeds: [embed] });
        }
      } else {
        console.error('Unable to send message: Invalid channel type');
      }
    }
  } catch (error) {
    console.error('Error fetching ISRO centers:', error);
    const errorMessage = 'Sorry, there was an error fetching ISRO centers information. Please try again later.';
    
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