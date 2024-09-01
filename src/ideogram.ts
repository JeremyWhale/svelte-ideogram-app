export interface ImageRequest {
  prompt: string;
  aspect_ratio: string;
  model: string;
  magic_prompt_option: string;
}

export interface ImageResponse {
  is_image_safe: boolean;
  prompt: string;
  resolution: string;
  seed: number;
  url: string;
}

export async function generateImage(imageRequest: ImageRequest): Promise<ImageResponse> {
  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image_request: imageRequest }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();
    console.log('Response from server:', JSON.stringify(body, null, 2));

    if (!body.data || !Array.isArray(body.data) || body.data.length === 0) {
      throw new Error('Unexpected response structure from server');
    }

    return body.data[0];
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
}