
import { GoogleGenAI, Type } from "@google/genai";
import { Geography, MarketData, ProjectLaunch, GroundingSource, SharePrice, NewsArticle } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const marketIntelligenceSchema = {
    type: Type.OBJECT,
    properties: {
        marketOverview: { type: Type.STRING },
        swot: {
            type: Type.OBJECT,
            properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        kpis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.STRING },
                    change: { type: Type.STRING },
                    changeType: { type: Type.STRING, enum: ["increase", "decrease", "neutral"] }
                },
            }
        },
        trends: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    quarter: { type: Type.STRING },
                    averagePrice: { type: Type.NUMBER },
                    unitsSold: { type: Type.NUMBER }
                },
            }
        },
        demandProfile: {
            type: Type.OBJECT,
            properties: {
                byConfiguration: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, percentage: { type: Type.NUMBER } } } },
                byTicketSize: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, percentage: { type: Type.NUMBER } } } }
            },
        }
    },
};

const competitiveIntelligenceSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            developerName: { type: Type.STRING },
            projectName: { type: Type.STRING },
            location: { type: Type.STRING },
            priceBracket: { type: Type.STRING },
            configuration: { type: Type.STRING },
            usp: { type: Type.STRING },
            launchDate: { type: Type.STRING },
        },
    }
};

const sharePriceSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            companyName: { type: Type.STRING },
            stockSymbol: { type: Type.STRING },
            currentPrice: { type: Type.STRING, description: "e.g., '₹1,234.56'" },
            dayChange: { type: Type.STRING, description: "e.g., '+12.34' or '-5.67'" },
            dayChangePercent: { type: Type.STRING, description: "e.g., '(+1.01%)' or '(-0.50%)'" },
            changeType: { type: Type.STRING, enum: ["increase", "decrease", "neutral"] }
        },
        required: ["companyName", "stockSymbol", "currentPrice", "dayChange", "dayChangePercent", "changeType"]
    }
};

const newsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            source: { type: Type.STRING, description: "Name of the publication" },
            url: { type: Type.STRING, description: "Direct URL to the article" },
            publishedDate: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
            snippet: { type: Type.STRING, description: "A one or two-sentence summary of the article." }
        },
        required: ["title", "source", "url", "publishedDate", "snippet"]
    }
};

export const fetchMarketIntelligence = async (geography: Geography): Promise<{ data: MarketData, sources: GroundingSource[] }> => {
    const prompt = `
        Generate a comprehensive market intelligence report for the residential real estate market in ${geography}.
        The report must include: KPIs, Trends, Demand Profile, Market Synopsis, and SWOT Analysis.
        Highlight important statistics using markdown bold syntax (**statistic** or **123**).
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: marketIntelligenceSchema, temperature: 0.2, tools: [{googleSearch: {}}] }
    });
    return { data: JSON.parse(response.text.trim()), sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []) };
};

export const fetchCompetitiveIntelligence = async (geography: Geography): Promise<{ launches: ProjectLaunch[], sources: GroundingSource[] }> => {
    const prompt = `
        Generate a list of 5 to 7 new residential project launches in ${geography} within the last 90 days.
        Strictly use authentic, credible sources (news, research firms, regulatory filings).
        EXCLUDE data from broker portals, listings, influencers, and promotional sites.
        IMPORTANT: Do not include any projects developed by DLF or DLF Limited. Focus only on competitor projects.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: competitiveIntelligenceSchema, temperature: 0.3, tools: [{googleSearch: {}}] }
    });
    return { launches: JSON.parse(response.text.trim()), sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []) };
};

export const fetchSharePrices = async (): Promise<{ data: SharePrice[], sources: GroundingSource[] }> => {
    const prompt = `
        Fetch the latest stock market data for the top 10 largest listed real estate companies in India by market capitalization.
        For each company, provide the full company name, its NSE stock symbol, the current price, the day's change in value, and the day's change in percentage.
        Determine if the change is an increase, decrease, or neutral for the changeType.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: sharePriceSchema, temperature: 0.1, tools: [{googleSearch: {}}] }
    });
    return { data: JSON.parse(response.text.trim()), sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []) };
};

export const fetchIndiaNews = async (): Promise<{ data: NewsArticle[], sources: GroundingSource[] }> => {
    const prompt = `
        Fetch the top 5 most recent and relevant news articles about the Indian real estate market.
        Source these articles from major Indian publications such as The Economic Times, Business Standard, Livemint, The Hindu BusinessLine, and Moneycontrol.
        For each article, provide a title, source name, URL, publication date (YYYY-MM-DD), and a concise one or two-sentence snippet.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: newsSchema, temperature: 0.3, tools: [{googleSearch: {}}] }
    });
    return { data: JSON.parse(response.text.trim()), sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []) };
};

export const fetchInternationalNews = async (): Promise<{ data: NewsArticle[], sources: GroundingSource[] }> => {
    const prompt = `
        Fetch the top 5 most recent and relevant news articles about the international/global real estate market.
        Source these articles from major international publications such as The Wall Street Journal, Financial Times, Bloomberg, Reuters, and The Economist.
        For each article, provide a title, source name, URL, publication date (YYYY-MM-DD), and a concise one or two-sentence snippet.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: newsSchema, temperature: 0.3, tools: [{googleSearch: {}}] }
    });
    return { data: JSON.parse(response.text.trim()), sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []) };
};