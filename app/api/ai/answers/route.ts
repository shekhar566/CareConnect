// import handleError from "@/lib/handlers/error";
// import { ValidationError } from "@/lib/http-errors";
// import { AIAnswerSchema } from "@/lib/validations";
// import { openai } from "@ai-sdk/openai";
// import { generateText } from "ai";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { question, content, userAnswer } = await req.json();

//   try {
//     const validatedData = AIAnswerSchema.safeParse({
//       question,
//       content,
//     });

//     if (!validatedData.success) {
//       throw new ValidationError(validatedData.error.flatten().fieldErrors);
//     }

//     const { text } = await generateText({
//       model: openai("gpt-4o-mini"),
//       prompt: `Generate a markdown-formatted response to the following question: "${question}".

//       Consider the provided context:
//       **Context:** ${content}

//       Also, prioritize and incorporate the user's answer when formulating your response:
//       **User's Answer:** ${userAnswer}

//       Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
//       Provide the final answer in markdown format.`,
//       system:
//         "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.",
//     });

//     return NextResponse.json({ success: true, data: text }, { status: 200 });
//   } catch (error) {
//     return handleError(error, "api") as APIErrorResponse;
//   }
// }

// import handleError from "@/lib/handlers/error";
// import { ValidationError } from "@/lib/http-errors";
// import { AIAnswerSchema } from "@/lib/validations";
// import { openai } from "@ai-sdk/openai";
// import { generateText } from "ai";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   // 1. Destructure the new Medical Fields
//   // Note: Ensure your client-side fetch sends these extra fields!
//   const { question, content, userAnswer, patientAge, gender, urgency } =
//     await req.json();

//   try {
//     const validatedData = AIAnswerSchema.safeParse({
//       question,
//       content,
//     });

//     if (!validatedData.success) {
//       throw new ValidationError(validatedData.error.flatten().fieldErrors);
//     }

//     // 2. Define the Medical Persona
//     const systemPersona = `
//       You are a Senior Chief Medical Officer and Clinical Consultant.
//       Your role is to assist clinicians by providing a structured, evidence-based second opinion on patient cases.

//       Formatting Rules:
//       - Use Markdown.
//       - Do NOT use code blocks unless specifically asked for medical data parsing.
//       - Structure your response with these specific headings:
//         ### 1. Differential Diagnosis
//         ### 2. Clinical Assessment
//         ### 3. Recommended Next Steps (Labs/Imaging)
//         ### 4. Treatment Recommendations
//     `;

//     // 3. Construct the Patient Case Prompt
//     const medicalCasePrompt = `
//       Please review the following medical case and provide a clinical consultation.

//       **Case Title (Chief Complaint):** "${question}"

//       **Patient History & Details:** ${content}

//       **Patient Demographics (if available):**
//       - Age: ${patientAge || "Not stated"}
//       - Gender: ${gender || "Not stated"}
//       - Urgency: ${urgency || "Standard"}

//       **Clinician's Initial Thoughts (User Answer):** ${userAnswer || "None provided."}

//       Instructions:
//       - Prioritize the clinician's initial thoughts only if they are medically sound.
//       - Identify any "Red Flags" or critical urgency factors immediately.
//       - Keep the tone professional, concise, and objective.
//     `;

//     const { text } = await generateText({
//       model: openai("gpt-4o-mini"),
//       prompt: medicalCasePrompt,
//       system: systemPersona,
//     });

//     return NextResponse.json({ success: true, data: text }, { status: 200 });
//   } catch (error) {
//     return handleError(error, "api") as APIErrorResponse;
//   }
// }

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// 1. Add OPTIONS handler to resolve the CORS preflight "Load failed" network error
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Note: Change '*' to your specific frontend URL in production for security
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    // 2. Parse the body INSIDE the try block to catch malformed JSON and prevent unhandled 500 errors
    const body = await req.json();
    const { question, content, userAnswer, patientAge, gender, urgency } = body;

    // 3. Validate the core data.
    // (Note: You should ideally update AIAnswerSchema to validate the demographics too)
    const validatedData = AIAnswerSchema.safeParse({
      question,
      content,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    // 4. Define the Medical Persona
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

    // 5. Construct the Patient Case Prompt using the validated data
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

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: medicalCasePrompt,
      system: systemPersona,
    });

    // 6. Return response with the required CORS headers
    return NextResponse.json(
      { success: true, data: text },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    // Make absolutely sure your handleError utility returns a valid NextResponse object
    return handleError(error, "api") as unknown;
  }
}
