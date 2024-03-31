from pathlib import Path
import io

from modal import Image, Stub, method, gpu

MAX_SEGMENT_DURATION = 30

stub = Stub("audiocraft")


def download_models():
    from audiocraft.models import AudioGen

    AudioGen.get_pretrained("facebook/audiogen-medium")


image = (
    Image.debian_slim(python_version="3.11")
    .apt_install("git", "ffmpeg")
    .pip_install("torch==2.1.1")
    .pip_install(
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
        self.model.set_generation_params(
            use_sampling=True,
            top_k=250,
            duration=5
        )

    @method()
    def generate(self, prompt: str):
        # Here we use a synthetic signal to prompt the generated audio.
        #res = self.model.generate_continuation(
         #   self.get_bip_bip(0.125).expand(2, -1, -1), 
          #  16000, prompt, progress=True)
        wav = self.model.generate(prompt)
        return wav, self.model.sample_rate


@stub.local_entrypoint()
def main(prompt: str, duration: int = 10, format: str = "wav"):
    dir = Path("./")
    if not dir.exists():
        dir.mkdir(exist_ok=True, parents=True)

    audiocraft = Audiocraft()
    wav, sample_rate = audiocraft.generate.remote(prompt)

    print("Saving the file")
    for idx, one_wav in enumerate(wav):
        # Will save under {idx}.wav, with loudness normalization at -14 db LUFS.
        audio_write(f'{idx}', one_wav.cpu(), sample_rate, strategy="loudness", loudness_compressor=True)