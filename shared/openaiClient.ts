import OpenAI from 'openai';

const openApiToken = process.env.OPENAI_API_TOKEN as string;

export const openaiClient = new OpenAI({
  apiKey: openApiToken,
});
