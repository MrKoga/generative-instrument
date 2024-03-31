"""
Official documentation: https://github.com/facebookresearch/audiocraft/tree/main
"""


from pathlib import Path
from modal import Image, Stub, method, gpu

stub = Stub("text2audio")

# How to use 
# modal run text2audio_modal.py --prompt "<prompt>"

def download_models():
    from audiocraft.models import AudioGen

    AudioGen.get_pretrained("facebook/audiogen-medium")


image = (
    Image.debian_slim(python_version="3.10.4")
    .apt_install("git", "ffmpeg")
    .pip_install("torch==2.1.0")
    .pip_install(
        "torchvision==0.16.0",
        "pynacl==1.5.0",
        "soundfile==0.12.1",
        "pydub==0.25.1",
        "git+https://git@github.com/facebookresearch/audiocraft#egg=audiocraft",
        "audiocraft",
        "setuptools",
        "wheel",
    )
    .run_function(download_models, gpu=gpu.A10G())
)
stub.image = image

with image.imports():
    import torch
    import torchaudio
    from audiocraft.data.audio import audio_write


@stub.cls(gpu=gpu.A10G())
class Audiocraft:
    def __enter__(self):
        from audiocraft.models import AudioGen

        self.model = AudioGen.get_pretrained("facebook/audiogen-medium")
        self.model.set_generation_params(duration=5) #TODO Specify how many seconds to divide into

    @method()
    def generate(self, prompt: str):
        wav = self.model.generate(prompt) # output: list of torch.Tensor as wav
    
        for idx, one_wav in enumerate(wav):
            # Will save under {idx}.wav, with loudness normalization at -14 db LUFS.
            #TODO Chage file path to save the audio file
            audio_write(f'{idx}', one_wav.cpu(), self.model.sample_rate, strategy="loudness", loudness_compressor=True)


@stub.local_entrypoint()
def main(prompt: str):
    audiocraft = Audiocraft()
    audiocraft.generate.remote(prompt)
    print("Audio file saved successfully")
