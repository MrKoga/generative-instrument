const id = "abcd";

/**
 * Request server to generate an image based on input data
 *
 * [Cog Reference](https://cog.run/http/#post-predictions-synchronous)
 *
 * @param input {object}
 * @param input.prompt {string}
 * @param input.image {string}  image/jpeg
 * @param input.width {number}
 * @param input.height {number}
 * @param input.steps {number|undefined}  1..4
 * @param input.strength {number|undefined}  0..1
 * @param input.seed {number|undefined} any random integer
 * @param input.outdir {string|undefined}  output folder to save images to. it is relative to `backend` directory
 * @returns { Promise<HTMLImageElement> } generated image element
 */
export async function generate(input) {
  console.log("generating image..");

  const img = new Image();

  try {
    const response = await fetch(`http://localhost:5001/predictions/${id}`, {
      method: "PUT",
      Prefer: "respond-async",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, input }),
    });
    const data = await response.json();
    console.log("generation complete..");

    img.src = data.output;
    await img.decode();
  } catch (e) {
    console.error(e);
  }

  return img;
}

export async function cancelRequest() {
  try {
    const response = await fetch(
      `http://localhost:5001/predictions/${id}/cancel`,
      {
        method: "POST",
      },
    );
    if (response.status === 200) console.log("request canceled..");
  } catch (e) {
    //
  }
}
