import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const { messages, model, temperature, max_tokens, conversation_id } = await req.json();

        if (!messages) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 500 });
        }

        // Call OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || 'gpt-4',
                messages,
                temperature: temperature || 0.7,
                max_tokens: max_tokens || 500,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI Error:', errorText);
            throw new Error('Failed to fetch from OpenAI');
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        // Save to Database (Server-side)
        const supabase = await createClient();

        // 1. Get User
        const { data: { user } } = await supabase.auth.getUser();

        if (user && conversation_id) {
            // Save User Message
            // Note: For this to work perfectly with RLS, the schema might need user_id, 
            // but existing schema is loose. We'll proceed with current schema for now 
            // or rely on the client ensuring conversation_id uniqueness/security initially.
            // Ideally, we'd update schema to have user_id.

            const lastUserMessage = messages[messages.length - 1];

            await supabase.from('ai_messages').insert({
                conversation_id,
                role: 'user',
                content: lastUserMessage.content,
                tokens_used: data.usage.prompt_tokens,
                // user_id: user.id // Schema doesn't have it yet, strict adherence to current schema
            });

            // Save Assistant Message
            await supabase.from('ai_messages').insert({
                conversation_id,
                role: 'assistant',
                content: assistantMessage,
                tokens_used: data.usage.completion_tokens,
            });
        }

        return NextResponse.json({
            response: assistantMessage,
            usage: data.usage
        });

    } catch (error) {
        console.error('AI Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
