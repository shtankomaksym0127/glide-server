import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

console.log("openai Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY)

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  const prompt = request.nextUrl.searchParams.get('prompt') as string;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    stream: true,
    temperature: 0.8,
    frequency_penalty: 1.2,
    max_tokens: 4096,
    messages: [
      // Preceding message to set the context for expertise
      {
        role: "system",
        content: "You are an expert at writing marketing copy.",
      },
      {
        role: "user",
        content: `${prompt}`,
      },
    ]
  });
  
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}