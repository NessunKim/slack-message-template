# Slack Message Template Bot

A Slack bot to save, manage, and send frequently used message templates with variables using slash commands.

## Features

- Save message templates with variables (e.g., `{{name}}`)
- Send messages by filling in variables
- List all saved templates
- Persistent storage (templates are saved to a file)
- **Auto-convert @username to Slack mention** (see Mentions section)

## Commands

- `/template save [name] [template text with {{variables}}]`  
  Save a template.  
  Example: `/template save celebrate Today is {{name}}'s birthday!`
- `/template [name] [var1=value ...]`  
  Send a message using a template.  
  Example: `/template celebrate name=John`
- `/template list`  
  List all saved templates.

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Run the server (development)

```bash
yarn tsx src/server.ts
```

### 3. Run with Docker

```bash
docker-compose up --build
```

The server will run on port `40363` by default.

## Slack Integration

1. **Create a Slack App** at https://api.slack.com/apps
2. Add a **Slash Command**:
   - Command: `/template`
   - Request URL: `http://YOUR_SERVER_URL:40363/slack/template`
   - Short Description: `Manage and send message templates with variables.`
   - Usage Hint: `save [name] [template text with {{variables}}] | list | [name] [var1=value ...]`
3. Install the app to your workspace
4. (If running locally, use [ngrok](https://ngrok.com/) to expose your port)

## Template Persistence

- Templates are saved in `templates.json` in the project root.
- The file is updated automatically when you save a template.

## License

MIT
