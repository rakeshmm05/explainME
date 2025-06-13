import os
import google.generativeai as genai
from dotenv import load_dotenv
import re

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def get_explanations(topic: str) -> dict:
    prompt = (
        f'Explain the topic "{topic}" in a simple and clear way for three different age groups. '
        'Use short bullet points for each explanation.\n\n'
        '1. For a 5-year-old:\n'
        '- Use very simple words.\n'
        '- Imagine you are telling a fun story or explaining it with toys.\n\n'
        '2. For a 15-year-old:\n'
        '- Use slightly more detailed points.\n'
        '- Imagine you are helping a teenager understand it for a school project.\n\n'
        '3. For a 25-year-old:\n'
        '- Be concise but insightful.\n'
        '- Imagine you are explaining it to a curious young adult who wants a quick, smart summary.\n\n'
        'Keep each explanation clear and easy to read. Avoid long paragraphs. Avoid asterisks or bullet points in the output.\n'
        'Provide the explanations in a numbered format:\n'
    )   

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    full_text = response.text

    return parse_response(full_text)

def parse_response(text: str) -> dict:
    """
    Parses the AI response which contains three sections marked with:
    'For a 5-year-old:', 'For a 15-year-old:', and 'For a 25-year-old:'
    Each section has bullet points starting with '*'.
    """
    # Define regex patterns for each age group
    patterns = {
        "age_5": r"For a 5-year-old:([\s\S]*?)For a 15-year-old:",
        "age_15": r"For a 15-year-old:([\s\S]*?)For a 25-year-old:",
        "age_25": r"For a 25-year-old:([\s\S]*)"
    }

    result = {}

    for key, pattern in patterns.items():
        match = re.search(pattern, text)
        if match:
            section_text = match.group(1).strip()
            # Split by bullet points
            bullet_points = [
                line.strip(" *") for line in section_text.split("\n") if line.strip().startswith("*")
            ]
            result[key] = bullet_points
        else:
            result[key] = ["Explanation not found."]

    return result

# def parse_response(text: str) -> dict:
#     """
#     Parses the AI response into a dictionary of bullet points for 3 age groups.
#     Also returns a Markdown-formatted version.
#     """
#     patterns = {
#         "age_5": r"For a 5-year-old:([\s\S]*?)For a 15-year-old:",
#         "age_15": r"For a 15-year-old:([\s\S]*?)For a 25-year-old:",
#         "age_25": r"For a 25-year-old:([\s\S]*)"
#     }

#     explanations = {}
#     markdown = ""

#     age_labels = {
#         "age_5": "🧒 Explained to a 5-year-old",
#         "age_15": "👦 Explained to a 15-year-old",
#         "age_25": "🧑 Explained to a 25-year-old"
#     }

#     for key, pattern in patterns.items():
#         match = re.search(pattern, text)
#         if match:
#             section_text = match.group(1).strip()
#             bullet_points = [
#                 line.strip(" *") for line in section_text.split("\n") if line.strip().startswith("*")
#             ]
#             explanations[key] = bullet_points

#             # Add to markdown
#             markdown += f"### {age_labels[key]}\n"
#             for point in bullet_points:
#                 markdown += f"- {point}\n"
#             markdown += "\n"
#         else:
#             explanations[key] = ["Explanation not found."]
#             markdown += f"### {age_labels[key]}\n- Explanation not found.\n\n"

#     return {
#         "bullets": explanations,
#         "markdown": markdown.strip()
#     }