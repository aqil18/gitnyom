import openai
import os
from dotenv import load_dotenv

load_dotenv('.env')
openai.api_key = os.getenv('OpenAI_APIKEY')
print(f"Password:{openai.api_key}")

def generate_description(input):
    # print(input) works
    messages = [
        {'role': 'user',
         'content':
         '''Summarize the GitHub repository, highlighting key contributions, technical skills used, and any measurable impacts 
         (e.g., performance improvements, code reduction, or user adoption). Focus on specific accomplishments, technologies, and quantifiable results.'''},
        {"role": "user", "content": input}
    ]

    messages.append({"role": "user", "content": f"{input}"})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    reply = response['choices'][0]['message']['content']
    return reply
