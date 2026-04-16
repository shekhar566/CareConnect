import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { groq } from "@ai-sdk/groq"; // <-- Using free Groq instead of OpenAI
import { generateText } from "ai";
import { NextResponse } from "next/server";

// 1. This stops the "Load failed" CORS errors
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    // 2. Safely parse JSON inside the try block
    const body = await req.json();
    const { question, content, userAnswer, patientAge, gender, urgency } = body;

    const validatedData = AIAnswerSchema.safeParse({
      question,
      content,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const systemPersona = `
      You are a Senior Chief Medical Officer and Clinical Consultant.
      Your role is to assist clinicians by providing a structured, evidence-based second opinion on patient cases.

      Formatting Rules:
      - Use Markdown.
      - Do NOT use code blocks unless specifically asked for medical data parsing.
      - Structure your response with these specific headings:
        ### 1. Differential Diagnosis
        ### 2. Clinical Assessment
        ### 3. Recommended Next Steps (Labs/Imaging)
        ### 4. Treatment Recommendations
    `;

    const medicalCasePrompt = `
      Please review the following medical case and provide a clinical consultation.

      **Case Title (Chief Complaint):** "${validatedData.data.question}"
      
      **Patient History & Details:** ${validatedData.data.content}

      **Patient Demographics (if available):**
      - Age: ${patientAge || "Not stated"}
      - Gender: ${gender || "Not stated"}
      - Urgency: ${urgency || "Standard"}

      **Clinician's Initial Thoughts (User Answer):** ${userAnswer || "None provided."}
      
      Instructions:
      - Prioritize the clinician's initial thoughts only if they are medically sound.
      - Identify any "Red Flags" or critical urgency factors immediately.
      - Keep the tone professional, concise, and objective.
    `;

    // 3. Generate text for free using Llama 3 on Groq
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: medicalCasePrompt,
      system: systemPersona,
    });

    return NextResponse.json(
      { success: true, data: text },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS
        },
      }
    );
  } catch (error) {
    return handleError(error, "api") as unknown;
  }
}
