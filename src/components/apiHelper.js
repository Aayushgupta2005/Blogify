import Groq from "groq-sdk";

const SYSTEM_PROMPT = `
You are a professional chef and recipe assistant. Your task is to suggest a delicious indian recipe based on the ingredients provided by the user. 
Please respond in an enthusiastic and engaging manner, and end with a statement like but not limitted to "Enjoy your meal! "

Respond ONLY with the recipe in clean markdown format WITHOUT:
- Code blocks (no \\\markdown or \\\)
- Any text before/after the recipe
- Extra punctuation at the end

Format like this:
### [Recipe Name]
#### Ingredients
- Item 1
- Item 2

#### Detailed Instructions
1. Step 1
2. Step 2

### End Statement
`;

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function getRecipeFromGroq(ingredArr) {
    const ingredString = ingredArr.join(", ");
    
    try {
        console.log("Making Groq API request...");
        const response = await groq.chat.completions.create({
            // model: "mixtral-8x7b-32768", // or "llama3-8b-8192"
            model: "llama3-8b-8192", // or "llama3-8b-8192"
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: I have ${ingredString}. Please give me a recipe! }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stream: false
        });
        
        console.log("Groq API success!")
        return response.choices[0].message.content
            .replace(/markdown/g, '') // Remove markdown code block markers
            .replace(//g, '')        // Remove any remaining backticks
            .replace(/^\\/gm, '')     // Remove leading **
            .replace(/\\$/gm, '')     // Remove trailing **
            .trim();
    } catch (err) {
        console.error("Groq API error:", err);
        if (err.status === 429) {
            throw new Error("Too many requests. Please wait a minute.");
        }
        throw new Error(Recipe failed: ${err.message});
    }
}