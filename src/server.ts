import Fastify from "fastify";
import formbody from "@fastify/formbody";
import {
  saveTemplate,
  getTemplate,
  fillTemplate,
  loadTemplates,
  getAllTemplates,
} from "./templateStore";

const fastify = Fastify();
fastify.register(formbody);

// Parse variables
function normalizeQuotes(str: string) {
  return str.replace(/[“”„‟❝❞＂]/g, '"').replace(/[‘’‚‛❮❯‹›＇]/g, "'");
}

function parseArgs(args: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  const argStr = normalizeQuotes(args.join(" "));
  const regex = /(\w+)=(["'])(.+?)\2|(\w+)=([^\s]+)/g;
  let match;
  while ((match = regex.exec(argStr)) !== null) {
    if (match[1] && match[3] !== undefined) {
      params[match[1]] = match[3];
    } else if (match[4] && match[5] !== undefined) {
      params[match[4]] = match[5];
    }
  }
  return params;
}

fastify.post("/slack/template", async (request, reply) => {
  const body = request.body as any;
  const { text } = body;

  if (!text) {
    return reply.send("Please enter a command.");
  }

  const [command, ...args] = text.split(" ");

  if (command === "list") {
    const all = getAllTemplates();
    if (Object.keys(all).length === 0) {
      return reply.send("No templates saved.");
    }
    const lines = Object.entries(all).map(
      ([name, content]) => `• ${name}: ${content}`
    );
    return reply.send(["Saved templates:", ...lines].join("\n"));
  }

  if (command === "save") {
    const [name, ...templateArr] = args;
    const template = templateArr.join(" ");
    await saveTemplate(name, template);
    return reply.send(`Template \"${name}\" has been saved.`);
  }

  // Template usage
  const name = command;
  const template = getTemplate(name);
  if (!template) {
    return reply.send(`Template \"${name}\" does not exist.`);
  }

  let params = parseArgs(args);

  const message = fillTemplate(template, params);
  return reply.send(message);
});

// Load templates from file before starting the server
loadTemplates().then(() => {
  fastify.listen({ port: 40363 }, (err, address) => {
    if (err) throw err;
    console.log(`Server listening at ${address}`);
  });
});
