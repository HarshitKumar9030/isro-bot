import { REST, Routes, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') && file !== 'deployCommands.ts');

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  throw new Error('Missing DISCORD_TOKEN or CLIENT_ID in environment variables');
}

const rest = new REST({ version: '10' }).setToken(token);

async function deployCommands() {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(clientId as string),
      { body: commands },
    ) as RESTPostAPIApplicationCommandsJSONBody[];

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    
    data.forEach(cmd => {
      console.log(`Deployed: /${cmd.name}`);
    });

  } catch (error) {
    console.error('Error deploying commands:', error);
  }
}

// Execute deployment
deployCommands();