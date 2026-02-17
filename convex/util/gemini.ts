import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini 集成
export async function chatCompletionGemini(messages: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found, using fallback responses');
    const fallbacks = [
      "真是个好天气呢！",
      "我在思考人生的意义...",
      "你好啊，很高兴见到你！",
      "今天过得怎么样？",
      "让我想想..."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    // 转换消息格式为 Gemini 格式
    const lastMessage = messages[messages.length - 1];
    const prompt = typeof lastMessage === 'string'
      ? lastMessage
      : lastMessage.content || lastMessage.text || '';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    // 降级到随机回复
    const fallbacks = [
      "真是个好天气呢！",
      "我在思考人生...",
      "你好啊！",
      "让我想想..."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

// Gemini 暂不支持 embedding，返回模拟数据
export async function fetchEmbeddingGemini(text: string): Promise<number[]> {
  // 使用简单的哈希函数生成确定性的伪向量
  const vector: number[] = [];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash;
  }

  for (let i = 0; i < 1024; i++) {
    const seed = hash + i;
    const x = Math.sin(seed) * 10000;
    vector.push(x - Math.floor(x));
  }

  return vector;
}
