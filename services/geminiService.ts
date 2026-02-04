import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ICPData } from '../types';

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please add VITE_GEMINI_API_KEY to your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const icpSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    serviceName: { type: Type.STRING },
    companyProfile: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "Company structure type (e.g. SMB, Enterprise)" },
        size: { type: Type.STRING, description: "Employees count and Revenue range" },
        geography: { type: Type.STRING },
        industry: { type: Type.STRING }
      },
      required: ["type", "size", "geography", "industry"]
    },
    decisionMaker: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.ARRAY, items: { type: Type.STRING } },
        secondary: { type: Type.ARRAY, items: { type: Type.STRING } },
        role: { type: Type.STRING, description: "Key department and role focus" }
      },
      required: ["primary", "secondary", "role"]
    },
    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    businessGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
    buyingTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
    commercialReadiness: {
      type: Type.OBJECT,
      properties: {
        budgetRange: { type: Type.STRING },
        buyingModel: { type: Type.STRING },
        approvalComplexity: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
      },
      required: ["budgetRange", "buyingModel", "approvalComplexity"]
    },
    technicalMaturity: {
      type: Type.OBJECT,
      properties: {
        techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
        teamStatus: { type: Type.STRING, enum: ["None", "Limited", "Mature"] },
        dataReadiness: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
      },
      required: ["techStack", "teamStatus", "dataReadiness"]
    },
    successCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
    objectionsAndRisks: {
      type: Type.OBJECT,
      properties: {
        commonObjections: { type: Type.ARRAY, items: { type: Type.STRING } },
        riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["commonObjections", "riskFactors"]
    },
    whyUs: { type: Type.STRING },
    qualificationChecklist: {
      type: Type.OBJECT,
      properties: {
        problemClarity: { type: Type.BOOLEAN },
        budgetClarity: { type: Type.BOOLEAN },
        decisionMakerAccess: { type: Type.BOOLEAN },
        timelineDefined: { type: Type.BOOLEAN },
        strategicFit: { type: Type.BOOLEAN }
      },
      required: ["problemClarity", "budgetClarity", "decisionMakerAccess", "timelineDefined", "strategicFit"]
    },
    engagementModel: { type: Type.STRING },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    upsellPotential: { type: Type.ARRAY, items: { type: Type.STRING } },
    potentialClients: {
      type: Type.ARRAY,
      description: "List of 5-8 specific, real companies in the target market.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          website: { type: Type.STRING },
          description: { type: Type.STRING },
          contactEmail: { type: Type.STRING, description: "A plausible general contact email (e.g. info@, partnerships@)" }
        },
        required: ["name", "website", "description", "contactEmail"]
      }
    },
    outreachTemplate: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING }
      },
      required: ["subject", "body"]
    }
  },
  required: [
    "serviceName", "companyProfile", "decisionMaker", "painPoints", "businessGoals",
    "buyingTriggers", "commercialReadiness", "technicalMaturity", "successCriteria",
    "objectionsAndRisks", "whyUs", "qualificationChecklist", "engagementModel",
    "redFlags", "upsellPotential", "potentialClients", "outreachTemplate"
  ]
};

const refinementSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING },
    body: { type: Type.STRING }
  },
  required: ["subject", "body"]
};

export const generateICP = async (companyData: string, region: string, industry: string): Promise<ICPData> => {
  const ai = getClient();

  const prompt = `
    You are a World-Class Executive Strategy Consultant & Copywriter for 'Cehpoint'.
    
    OBJECTIVE:
    Analyze Cehpoint's service catalog to identify high-value opportunities and generate a "Masterpiece" proposal.
    
    PARAMETERS:
    - Target Market: ${region}
    - Target Industry: ${industry}
    - Context: Cehpoint is a Digital Sovereign entity with global payment capabilities and virtual presence.
    
    TASKS:
    1. Service Name (Best fit service from catalog)
    2. Target Company Profile (Type, Size, Geography: ${region}, Industry: ${industry})
    3. Decision-Maker Profile (Primary & Secondary stakeholders, Department)
    4. Client Pain Points (Deep rooted operational/financial pains)
    5. Business Goals of the Client
    6. Buying Triggers (Events causing the need)
    7. Budget & Commercial Readiness (Est. Range, Buying Model, Approval Complexity)
    8. Technical Maturity (Likely Stack, Internal Team capability, Data readiness)
    9. Success Criteria (How they measure ROI)
    10. Objections & Risks
    11. Why This Client Chooses Us (USP match)
    12. Deal Qualification Checklist (Estimate typical likelihood booleans for an IDEAL client)
    13. Ideal Engagement Model (e.g. Pilot -> Scale)
    14. Red Flags (Disqualifiers)
    15. Upsell / Cross-Sell Potential
    
    PLUS:
    - **Leads List**: Generate a list of 5-8 REAL, SPECIFIC companies in ${region} that fit this profile. Include Name, Website, Contact Email (plausible corporate format like hello@ domain.com, MUST NOT BE BLANK), and a brief description.
    - **Outreach**: Generate a "Masterpiece" outreach email TEMPLATE.
        - Use placeholders like [Client Name] so it can be personalized.
        - Format: Standard Subject Line, Greetings, Body, CTA, Sign-off.
        - Sign-off must be: "Regards, Cehpoint Team".
        - Tone: Experienced, Value-First, not "Salesy".
        - **STRICTY NO EMOJIS OR ICONS IN THE TEXT.**
    
    Return strictly valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: icpSchema,
        temperature: 0.3,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as ICPData;
  } catch (error) {
    console.error("Error generating ICP:", error);
    throw error;
  }
};

export const refineProposal = async (
  currentSubject: string,
  currentBody: string,
  feedback: string,
  companyData: string
): Promise<{ subject: string; body: string }> => {
  const ai = getClient();
  const prompt = `
    You are a World-Class Executive Copywriter.
    
    TASK: Refine/Rewrite an existing B2B Proposal Email based on specific user feedback to create a "Masterpiece".
    
    CONTEXT (Company Services):
    "${companyData}"
    
    CURRENT DRAFT:
    Subject: ${currentSubject}
    Body:
    ${currentBody}
    
    USER FEEDBACK / INSTRUCTIONS:
    "${feedback}"
    
    REQUIREMENTS:
    - Strictly follow the user's feedback (e.g., "make it shorter", "focus on robotics", "change the tone").
    - Maintain perfect corporate formatting (Salutations, Spacing, Bullet Points, Sign-off).
    - Ensure the tone is top-tier professional.
    
    Return JSON: { "subject": string, "body": string }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: refinementSchema,
        temperature: 0.4,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as { subject: string, body: string };
  } catch (error) {
    console.error("Error refining proposal:", error);
    throw error;
  }
};