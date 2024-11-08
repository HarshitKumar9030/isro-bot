import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { CustomClient } from '../index';
import os from 'os';
import { cpus } from 'os';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('📊 Displays information about the bot and system'),
  
  async execute(interaction: CommandInteraction) {
    await sendBotInfo(interaction.client as CustomClient, interaction);
  },

  async run(message: Message, args: string[]) {
    await sendBotInfo(message.client as CustomClient, message);
  },
};

async function sendBotInfo(client: CustomClient, target: CommandInteraction | Message) {
  const botUptime = Math.floor(client.uptime / 1000);
  const ping = client.ws.ping;
  
  const cpuUsage = os.loadavg()[0];
  const cpuCount = cpus().length;
  
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = (usedMemory / totalMemory) * 100;
  
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('🤖 Bot Information')
    .addFields(
      { name: '📡 Ping', value: `${ping}ms`, inline: true },
      { name: '⏱️ Uptime', value: `${formatUptime(botUptime)}`, inline: true },
      { name: '💻 CPU Usage', value: `${cpuUsage.toFixed(2)}% (${cpuCount} cores)`, inline: true },
      { name: '🧠 RAM Usage', value: `${memoryUsage.toFixed(2)}% (${formatBytes(usedMemory)} / ${formatBytes(totalMemory)})`, inline: true },
      { name: '🟢 Node.js Version', value: process.version, inline: true },
      { name: '🖥️ OS', value: `${os.type()} ${os.release()}`, inline: true },
      { name: '🌐 Platform', value: os.platform(), inline: true },
      { name: '🏗️ Architecture', value: os.arch(), inline: true }
    )
    .setTimestamp()
    .setFooter({ text: 'ISRO Bot', iconURL: client.user?.avatarURL() || undefined });

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
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}