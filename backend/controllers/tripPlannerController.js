import { GoogleGenAI } from "@google/genai";
import { fetchDestinationImages } from "../utils/unsplash.js";

// ✅ Extract JSON safely
function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

// ✅ Retry wrapper for new SDK
async function generateWithRetry(ai, prompt, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");

      const jsonString = extractJSON(text);
      if (!jsonString) throw new Error("No JSON found");

      return JSON.parse(jsonString);
    } catch (err) {
      if (i === retries) throw err;
    }
  }
}

const generatePlan = async (req, res) => {
  try {
    const { destination, startDate, endDate, people, travelStyle, budget } = req.body;

    // Validation
    if (!destination || !startDate || !endDate || !people || !travelStyle || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(days) || days < 1) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // ✅ Enhanced prompt with detailed instructions
    const prompt = `
You are an expert travel planner. Create a detailed, realistic travel itinerary for a ${days}-day trip to **${destination}** for **${people} ${travelStyle} traveler(s)** with a total budget of **₹${budget}**.

### Requirements:
- **Destination:** ${destination}
- **Travel Style:** ${travelStyle} (solo, couple, family, friends)
- **Number of People:** ${people}
- **Total Budget:** ₹${budget} (all costs in INR)
- **Dates:** ${startDate} to ${endDate}

### Instructions:
1. **Basecamp:** Suggest a suitable accommodation (name, rating, description, price per night) that fits the budget and travel style.
2. **Daily Itinerary:** For each day, provide:
   - Title (e.g., "Day 1: Arrival & Fort Exploration")
   - Average temperature (°C) and weather condition (realistic for the destination and dates)
   - Morning, Afternoon, Evening activities with titles, descriptions, and costs.
   - Include at least 2–3 famous tourist spots per day (e.g., specific forts, viewpoints, temples, beaches, markets).
3. **Budget Breakdown:** Distribute the total budget across:
   - Transit (transport within destination + to/from)
   - Accommodation (total for all days)
   - Food & Drinks
   - Activities (entry fees, guided tours, adventure activities)
   - Contingency (5–10% of total)
   The sum must equal the grand total.
4. **Places List:** Include a separate array "places" with the names of all major tourist spots mentioned in the itinerary (e.g., "Lohagad Fort", "Tiger's Point", "Khandala Ghats"). This will be used for image fetching.
5. **Summary:** A one-sentence overview of the trip.

### Output Format (strict JSON, no markdown, no extra text):
{
  "basecamp": {
    "name": "string",
    "rating": number (0–10),
    "description": "string",
    "price": number (per night)
  },
  "days": [
    {
      "title": "string",
      "temperature": number,
      "condition": "string",
      "morning": { "title": "string", "description": "string", "cost": number },
      "afternoon": { "title": "string", "description": "string", "cost": number },
      "evening": { "title": "string", "description": "string", "cost": number } // evening can be omitted on last day
    }
  ],
  "budgetBreakdown": {
    "Transit": number,
    "Accommodation": number,
    "Food & Drinks": number,
    "Activities": number,
    "Contingency": number
  },
  "grandTotal": ${budget},
  "summary": "string",
  "duration": ${days},
  "places": ["Place1", "Place2", "Place3"]
}

### Important:
- All costs must be realistic for India (in INR).
- Include popular tourist spots and experiences specific to ${destination}.
- The itinerary should be practical and fun, respecting the budget.
- Ensure the total of budgetBreakdown = grandTotal.
- The number of days in "days" must equal ${days}.
- If the trip is longer than 5 days, you may group similar days or provide a pattern (e.g., "Day 3–4: Similar to Day 2 with different spots").
- Return only the JSON object.
`;

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Generate plan
    const plan = await generateWithRetry(ai, prompt);

    // Validate required fields
    if (!plan.basecamp || !plan.days || !plan.budgetBreakdown || !plan.places) {
      throw new Error("Invalid AI response: missing required fields");
    }

    // Fetch images for the destination (or could fetch per place if desired)
    const images = await fetchDestinationImages(destination, 5);
    plan.images = images;

    // Optional: For better matching, you could fetch images for each place and store as separate field
    // For simplicity, we keep images for the destination.

    res.status(200).json(plan);
  } catch (error) {
    console.error("Plan generation error:", error.message);
    res.status(500).json({
      message: "Failed to generate trip plan",
      error: error.message,
    });
  }
};

export { generatePlan };