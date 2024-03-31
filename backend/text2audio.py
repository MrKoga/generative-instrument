"""
Official documentation: https://github.com/facebookresearch/audiocraft/tree/main

Installations

In order to install torch 2.1.0, use pyenv etc. to change the python version to 3.10.4!
$python -m pip install 'torch==2.1.0'
$pip install torchvision==0.16.0

# You might need the following before trying to install the packages
python -m pip install setuptools wheel
# Then proceed to one of the following
python -m pip install -U audiocraft  # stable release
python -m pip install -U git+https://git@github.com/facebookresearch/audiocraft#egg=audiocraft  # bleeding edge
python -m pip install -e .  # or if you cloned the repo locally (mandatory if you want to train).
"""

# How to use
# python text2audio.py -p "<Prompt to convert to audio>"

import torchaudio
from audiocraft.models import AudioGen
from audiocraft.data.audio import audio_write
import argparse


""" Input prompt and convert text to audio """
def text2audio(prompt: str):
    model = AudioGen.get_pretrained('facebook/audiogen-medium')
    model.set_generation_params(duration=5)  #TODO Specify how many seconds to divide into
<<<<<<< HEAD
    wav = model.generate(prompt) # output: list of torch.Tensor as wav
=======
    descriptions = prompt
    wav = model.generate(descriptions)  
>>>>>>> 4803fde (note TODO)

    for idx, one_wav in enumerate(wav):
        # Will save under {idx}.wav, with loudness normalization at -14 db LUFS.
        #TODO Chage file path to save the audio file
        audio_write(f'{idx}', one_wav.cpu(), model.sample_rate, strategy="loudness", loudness_compressor=True)
        
def main():
    parser = argparse.ArgumentParser(description='prompt')
    parser.add_argument('-p', type=str, help='Prompt to convert to audio')
    args = parser.parse_args()
    text2audio(args.p)
    print("Audio file saved successfully")
    
if __name__ == "__main__":
    main()
