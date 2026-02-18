
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, VerificationStatus, ForgeryIndicator } from "../types";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      description: "Classification: GENUINE, FAKE, or SUSPICIOUS",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "Aggregate weighted authenticity score (0-100)",
    },
    extractedData: {
      type: Type.OBJECT,
      properties: {
        candidateName: { type: Type.STRING },
        institution: { type: Type.STRING },
        certificateId: { type: Type.STRING },
        issueDate: { type: Type.STRING },
        qualification: { type: Type.STRING },
      },
      required: ["candidateName", "institution", "certificateId", "issueDate", "qualification"],
    },
    indicators: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          label: { type: Type.STRING },
          weight: { type: Type.NUMBER, description: "Dynamic relevance weight (0-1)" },
          score: { type: Type.NUMBER, description: "Level-specific authenticity (0-100)" },
          explanation: { type: Type.STRING },
          detectedIssues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["type", "label", "weight", "score", "explanation", "detectedIssues"],
      },
    },
    summaryExplanation: {
      type: Type.STRING,
      description: "Technical justification for the fusion result",
    },
  },
  required: ["status", "confidenceScore", "extractedData", "indicators", "summaryExplanation"],
};

export const verifyCertificate = async (base64Image: string, mimeType: string): Promise<VerificationResult> => {
  // Ensure the API key is accessible from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-3-flash-preview for higher speed and reliability in local environments
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    ACT AS THE CORE ENGINE OF THE SMARTCERT PATENTED VERIFICATION SYSTEM.
    
    INVENTION CONTEXT:
    This system implements a Computer-Implemented Method for multi-level document forensics using a Weighted Fusion Decision Engine.
    
    YOUR TASK:
    1. INGESTION: Parse the provided certificate image.
    2. MULTI-LEVEL ANALYSIS:
       - Level 1 (Textual): Verify logical consistency of dates, names, and credentials.
       - Level 2 (Visual): Audit logos, seals, and artifacts indicating cloning/healing.
       - Level 3 (Typographic): Detect mixed font faces, inconsistent kerning, or stroke-width anomalies.
       - Level 4 (Structural): Evaluate if layout complies with claimed institutional standards.
    3. WEIGHTED FUSION:
       - Dynamically calculate 'weight' for each indicator based on document quality and anomaly severity.
       - Compute the final 'confidenceScore' as a weighted average.
    4. RISK CLASSIFICATION:
       - GENUINE: Score > 88
       - SUSPICIOUS: 45 < Score <= 88 (REQUIRES MANUAL AUDIT)
       - FAKE: Score <= 45
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(",")[1], mimeType } },
          { text: "Initiate Multi-Level Forensic Audit and provide result in JSON format strictly following the provided schema." },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (!response || !response.text) {
      throw new Error("Empty response from AI engine.");
    }

    // Clean the response text in case of markdown wrapping
    let cleanJson = response.text.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const result = JSON.parse(cleanJson);
    
    return {
      id: `VC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      imageUrl: base64Image,
      ...result,
    };
  } catch (error) {
    console.error("Forensic engine error detail:", error);
    // Rethrow a more descriptive error for the UI
    throw new Error("Weighted Fusion Engine failed to reach consensus. This can happen due to API limits or poor image clarity. Please try again.");
  }
};
