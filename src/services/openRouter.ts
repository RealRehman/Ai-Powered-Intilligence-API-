const OPENROUTER_API_KEY = "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";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export interface QwenRequest {
  content: string;
  type: 'analysis' | 'chat';
  context?: string;
}

export interface QwenResponse {
  analogy?: string;
  story?: string;
  explanations?: {
    beginner: string;
    intermediate: string;
    expert: string;
  };
  response?: string;
}

export class OpenRouterService {
  private async makeRequest(messages: any[], model: string = "qwen/qwen-2.5-72b-instruct") {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "AI Education Platform",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async analyzeContent(content: string): Promise<QwenResponse> {
    const systemPrompt = `You are an expert educational AI assistant. Your task is to analyze complex content and provide three types of explanations:

1. **Real-life Analogy**: Create a relatable, everyday analogy that helps understand the concept
2. **Fictional Story**: Write an engaging short story that incorporates the main concepts
3. **Multi-level Explanations**: Provide three explanations at different levels:
   - Beginner: Simple, accessible explanation
   - Intermediate: More detailed with some technical terms
   - Expert: Comprehensive, technical explanation

Please format your response as a JSON object with the following structure:
{
  "analogy": "your analogy here",
  "story": "your fictional story here",
  "explanations": {
    "beginner": "beginner explanation",
    "intermediate": "intermediate explanation", 
    "expert": "expert explanation"
  }
}`;

    const userPrompt = `Please analyze and explain this content: ${content}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const response = await this.makeRequest(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        analogy: "Analysis could not be parsed properly.",
        story: "Story generation encountered an error.",
        explanations: {
          beginner: response.substring(0, 500),
          intermediate: response.substring(500, 1000),
          expert: response.substring(1000)
        }
      };
    }
  }

  async chatQuery(question: string, context?: string): Promise<string> {
    const systemPrompt = `You are a helpful educational assistant. Answer questions clearly and concisely. If context is provided, use it to give more relevant answers.`;
    
    const userPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${question}`
      : question;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    return await this.makeRequest(messages);
  }
}

export const openRouterService = new OpenRouterService();