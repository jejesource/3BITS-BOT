# 3BITS DISCORD BOT

3BITS DISCORD BOT

## Installation

```bash
npm install
```

## Setup

1. Create a bot at [Discord Developer Portal](https://discord.com/developers/applications)
2. Copy the Token, Client ID, and Guild ID
3. Edit the `.env` file:

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_server_id_here
TICKET_LOG_CHANNEL_ID=channel_id_for_ticket_logs
```

## Usage

1. Register slash commands:
```bash
npm run deploy
```

2. Start the bot:
```bash
npm start
```

3. Use `/ticket` command in Discord to create the ticket menu

## Commands

- `/ticket` - Create the support ticket menu (requires ManageChannels permission)
- `/ping` - Check bot latency
