# Run Latent Consistency Models locally

Latent Consistency Models (LCMs) are based on Stable Diffusion, but they can generate images much faster, needing only 4 to 8 steps for a good image (compared to 25 to 50 steps). [Simian Luo et al](https://arxiv.org/abs/2310.04378) released the first Stable Diffusion distilled model. It’s distilled from the Dreamshaper fine-tune by incorporating classifier-free guidance into the model’s input.

You can [run Latent Consistency Models in the cloud on Replicate](https://replicate.com/luosiallen/latent-consistency-model), but it's also possible to run it locally.

## Prerequisites

You need Python 3.10 or above.

## Install

Run this to clone the repo:

    git clone https://github.com/replicate/latent-consistency-model.git
    cd latent-consistency-model

Set up a virtualenv to install the dependencies:

    python3 -m pip install virtualenv
    python3 -m virtualenv venv

Activate the virtualenv:

    source venv/bin/activate

(You'll need to run this command again any time you want to run the script.)

Then, install the dependencies:

    pip install -r requirements.txt

## Run

The script will automatically download the [`SimianLuo/LCM_Dreamshaper_v7`](https://huggingface.co/SimianLuo/LCM_Dreamshaper_v7) (3.44 GB) and [safety checker](https://huggingface.co/CompVis/stable-diffusion-safety-checker) (1.22 GB) models from HuggingFace.

```sh
python main.py \
  "a beautiful apple floating in outer space, like a planet" \
  --steps 4 --width 768
```

You’ll see an output like this:

```sh
Output image saved to: out-20231026-144506.png
Using seed: 48404
100%|███████████████████████████| 4/4 [00:00<00:00,  5.54it/s]
```

## Options

| Parameter     | Type  | Default | Description                                                   |
|---------------|-------|---------|---------------------------------------------------------------|
| prompt        | str   | N/A     | A text string for image generation.                           |
| --width       | int   | 512     | The width of the generated image.                             |
| --height      | int   | 512     | The height of the generated image.                            |
| --steps       | int   | 8       | The number of inference steps.                                |
| --seed        | int   | None    | Seed for random number generation.                            |
| --continuous  | flag  | False   | Enable continuous generation.                                 |

## Usage Text to Audio
### Installation
#### If run locally
Official repo: https://github.com/facebookresearch/audiocraft/tree/main
```
# In order to install torch 2.1.0, use pyenv etc. to change the python version to 3.10.4!
python -m pip install 'torch==2.1.0'
pip install torchvision==0.16.0

# You might need the following before trying to install the packages
python -m pip install setuptools wheel
# Then proceed to one of the following
python -m pip install -U audiocraft  # stable release
python -m pip install -U git+https://git@github.com/facebookresearch/audiocraft#egg=audiocraft  # bleeding edge
python -m pip install -e .  # or if you cloned the repo locally (mandatory if you want to train).
```
#### If run with modal
```
pip install modal
python3 -m modal setup
```
### Usage
#### If run locally
```
python3 -m venv venv
source ./venv/bin/activate
# Do the above installation
python text2audio.py -p "<Prompt to convert to audio>" 
```
#### If run with modal
```
modal run text2audio_modal.py --prompt "<prompt>"
```
