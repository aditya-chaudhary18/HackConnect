import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

def get_gemini_summary(text: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "⚠️ AI Error: GEMINI_API_KEY is missing in .env"

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Simple Prompt Engineering
        prompt = f"Summarize this hackathon description in 2 exciting sentences for students: {text}"
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"