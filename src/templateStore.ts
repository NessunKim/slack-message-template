import { promises as fs } from "fs";
import path from "path";

type TemplateMap = Record<string, string>;

const TEMPLATE_FILE = path.resolve(__dirname, "../templates.json");
let templates: TemplateMap = {};

// Load templates from file on startup
export const loadTemplates = async () => {
  try {
    const data = await fs.readFile(TEMPLATE_FILE, "utf-8");
    templates = JSON.parse(data);
  } catch (err) {
    // If file does not exist, start with empty templates
    templates = {};
  }
};

// Save templates to file
const saveTemplatesToFile = async () => {
  await fs.writeFile(
    TEMPLATE_FILE,
    JSON.stringify(templates, null, 2),
    "utf-8"
  );
};

export const saveTemplate = async (name: string, content: string) => {
  templates[name] = content;
  await saveTemplatesToFile();
};

export const getTemplate = (name: string) => templates[name];

export const getAllTemplates = () => ({ ...templates });

export const fillTemplate = (
  template: string,
  params: Record<string, string>
) => template.replace(/{{(.*?)}}/g, (_, key) => params[key.trim()] || "");
