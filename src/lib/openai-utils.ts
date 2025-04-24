import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interface for message format
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Call OpenAI API with a prompt and get a completion response
 * @param messages Array of messages to send to OpenAI
 * @param type Type of conversation (chat, structured, etc.)
 * @param schema Optional JSON schema for structured outputs
 * @returns Raw string response from OpenAI
 */
export async function callOpenAI(
  messages: ChatMessage[],
  type: string,
  schema?: object
): Promise<string> {
  try {
    // Basic validation
    if (!messages || messages.length === 0) {
      throw new Error('No messages provided');
    }

    // Configure API call based on type
    let response;
    
    if (type === 'chat') {
      const params: any = {
        model: process.env.OPENAI_MODEL,
        messages: messages,
        // temperature: 0.7,
        max_completion_tokens: 1500,
      };

      // Add function calling for structured output if schema is provided
      if (schema) {
        params.tools = [
          {
            type: "function",
            function: {
              name: "structured_response",
              description: "Return a structured response according to the schema",
              parameters: schema,
            },
          },
        ];
        params.tool_choice = { type: "function", function: { name: "structured_response" } };
      }

      const completion = await openai.chat.completions.create(params);
      
      // Handle different response types
      const functionCall = completion.choices[0]?.message?.tool_calls?.[0]?.function;
      if (functionCall) {
        // Extract JSON from function call arguments
        return functionCall.arguments;
      } else {
        // Return regular message content
        return completion.choices[0]?.message?.content || '';
      }
    } else {
      throw new Error(`Unsupported type: ${type}`);
    }
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to get response from OpenAI: ${error.message}`);
  }
}