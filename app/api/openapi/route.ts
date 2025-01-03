import OpenAI from 'openai';

const openApiToken = process.env.OPENAI_API_TOKEN as string;
const openai = new OpenAI({
  apiKey: openApiToken,
});

export async function POST(request: Request) {
  const { text } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: text }],
    });
    const output = completion.choices[0].message;
    return Response.json({ completion: output });
  } catch (error: unknown) {
    return Response.json(error, { status: 500 });
  }
}
