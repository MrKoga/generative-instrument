from openai import OpenAI
from dotenv import load_dotenv
import os
import argparse
import base64
load_dotenv()

# How to use
# python estimate_reverb.py -i <path_to_image>

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

def describe_image(image_path, client):    
    # Getting the base64 string
    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[
        {
        "role": "user",
        "content": [
            {"type": "text", "text": "Describe this image in one sentence"},
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}",
            },
            },
        ],
        }
    ],
    max_tokens=300,
    )
    return response.choices[0].message.content
    
def estimate_reverb(image_path):
    API_KEY = os.getenv("API_KEY")
    client = OpenAI(api_key=API_KEY)
    sentence = describe_image(image_path, client)
    
    response = client.chat.completions.create(
        model="gpt-4-0125-preview",
        response_format={ "type": "json_object" },
        messages=[
        {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
        {"role": "user", "content": "How much sonic reverberation would you expect in a room described in the following sentence. {}. Using only real numbers between 0.0 and 1.0.".format(sentence)},
        ]
    )
    return sentence, response.choices[0].message.content
    
def main():
    parser = argparse.ArgumentParser(description='image_path')
    parser.add_argument('-i', type=str, help='Path to the image file')
    args = parser.parse_args()
    sentence, reverb = estimate_reverb(args.i)
    print(f"Sentence: {sentence}")
    print(f"Reverb: {reverb}")
    
if __name__ == "__main__":
    main()