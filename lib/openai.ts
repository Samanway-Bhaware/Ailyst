import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

export async function analyzeData(data: any, query: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a data analysis expert. Analyze the provided data and answer questions about it."
      },
      {
        role: "user",
        content: `Data: ${JSON.stringify(data)}\n\nQuestion: ${query}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  return response.choices[0].message.content;
}