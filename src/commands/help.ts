import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📚 List all available commands'),
  
  async execute(interaction: CommandInteraction) {
    await sendHelpInfo(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendHelpInfo(message.client as CustomClient, message);
  },
};

async function sendHelpInfo(client: CustomClient, target: CommandInteraction | Message) {
  try {
    const commands = client.commands;
    
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('ISRO Bot Commands')
      .setDescription('Here are all the available commands:')
      .setTimestamp()
      .setFooter({ text: 'ISRO Bot', iconURL: client.user?.avatarURL() || undefined });

    commands.forEach((command) => {
      helpEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description });
    });

    if (target instanceof CommandInteraction) {
      await target.reply({ embeds: [helpEmbed] });
    } else {
      const channel = target.channel;
      if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel || channel instanceof ThreadChannel) {
        await channel.send({ embeds: [helpEmbed] });
      } else {
        console.error('Unable to send message: Invalid channel type');
      }
    }
  } catch (error) {
    console.error('Error sending help information:', error);
    const errorMessage = 'Sorry, there was an error fetching the command list. Please try again later.';
    
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