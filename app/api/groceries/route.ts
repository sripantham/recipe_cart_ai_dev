import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { recipe } = await request.json();
    
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      Extract the ingredients list from this recipe and return them in the following JSON format:
      {
        "groceries": [
          {
            "item": "ingredient name",
            "quantity": "amount with unit"
          }
        ]
      }
      
      Only include the JSON output, no additional text.
      
      Recipe: ${recipe}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(text);
      
      // Validate the response structure
      if (!parsedResponse.groceries || !Array.isArray(parsedResponse.groceries)) {
        throw new Error('Invalid response format');
      }

      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      // If JSON parsing fails, try to extract ingredients manually
      const lines = text.split('\n').filter(line => line.trim());
      const groceries = lines.map(line => {
        const [item, quantity] = line.split(':').map(s => s.trim());
        return { item, quantity: quantity || 'as needed' };
      });

      return NextResponse.json({ groceries });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process recipe. Please check your recipe text and try again.' },
      { status: 500 }
    );
  }
}