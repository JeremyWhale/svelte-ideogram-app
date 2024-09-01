<script lang="ts">
	import { generateImage } from './ideogram';
	import type { ImageResponse } from './ideogram';
	import { onDestroy } from 'svelte';
  
	let prompt = '';
	let aspectRatio = 'ASPECT_10_16';
	let model = 'V_2_TURBO';
	let magicPromptOption = 'AUTO';
	let generatedImages: (ImageResponse & { generationTime: number })[] = [];
	let currentImageIndex = -1;
	let isLoading = false;
	let error = '';
	let timer = 0;
	let timerInterval: number | null = null;
  
	function startTimer() {
	  timer = 0;
	  timerInterval = setInterval(() => {
		timer += 0.1;
	  }, 100);
	}
  
	function stopTimer() {
	  if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	  }
	}
  
	onDestroy(() => {
	  stopTimer();
	});
  
	async function handleSubmit() {
	  isLoading = true;
	  error = '';
	  startTimer();
	  try {
		const newImage = await generateImage({
		  prompt,
		  aspect_ratio: aspectRatio,
		  model,
		  magic_prompt_option: magicPromptOption
		});
		stopTimer();
		generatedImages = [{ ...newImage, generationTime: parseFloat(timer.toFixed(1)) }, ...generatedImages];
		currentImageIndex = 0;
	  } catch (err) {
		if (err instanceof Error) {
		  error = `Error generating image: ${err.message}`;
		} else {
		  error = 'An unknown error occurred';
		}
		console.error(err);
	  } finally {
		isLoading = false;
		stopTimer();
	  }
	}
  
	function showPreviousImage() {
	  if (currentImageIndex < generatedImages.length - 1) {
		currentImageIndex++;
	  }
	}
  
	function showNextImage() {
	  if (currentImageIndex > 0) {
		currentImageIndex--;
	  }
	}
  </script>
  
  
  
  <main>
	<h1>Ideogram Image Generator</h1>
  
	<form on:submit|preventDefault={handleSubmit}>
	  <label>
		Prompt:
		<input type="text" bind:value={prompt} required>
	  </label>
	  <label>
		Aspect Ratio:
		<select bind:value={aspectRatio}>
		  <option value="ASPECT_10_16">10:16</option>
		  <option value="ASPECT_1_1">1:1</option>
		  <option value="ASPECT_16_10">16:10</option>
		</select>
	  </label>
	  <label>
		Model:
		<select bind:value={model}>
		  <option value="V_2_TURBO">V2 Turbo</option>
		</select>
	  </label>
	  <label>
		Magic Prompt Option:
		<select bind:value={magicPromptOption}>
		  <option value="AUTO">Auto</option>
		  <option value="NONE">None</option>
		</select>
	  </label>
	  <button type="submit" disabled={isLoading}>Generate Image</button>
	</form>
  
	{#if isLoading}
    <p>Generating image... Time elapsed: {timer.toFixed(1)} seconds</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if generatedImages.length > 0}
    <div class="image-container">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src={generatedImages[currentImageIndex].url} alt="Generated image" />
      <div class="image-details">
        <p><strong>Prompt:</strong> {generatedImages[currentImageIndex].prompt}</p>
        <p><strong>Resolution:</strong> {generatedImages[currentImageIndex].resolution}</p>
        <p><strong>Seed:</strong> {generatedImages[currentImageIndex].seed}</p>
        <p><strong>Generation Time:</strong> {generatedImages[currentImageIndex].generationTime} seconds</p>
      </div>
      <div class="navigation">
        <button on:click={showPreviousImage} disabled={currentImageIndex === generatedImages.length - 1}>Previous</button>
        <span>{currentImageIndex + 1} / {generatedImages.length}</span>
        <button on:click={showNextImage} disabled={currentImageIndex === 0}>Next</button>
      </div>
    </div>
  {/if}
</main>
  
  <style>
	main {
	  max-width: 800px;
	  margin: 0 auto;
	  padding: 20px;
	}
  
	form {
	  display: flex;
	  flex-direction: column;
	  gap: 10px;
	  margin-bottom: 20px;
	}
  
	label {
	  display: flex;
	  flex-direction: column;
	}
  
	.error {
	  color: red;
	}
  
	.image-container {
	  margin-top: 20px;
	}
  
	img {
	  max-width: 100%;
	  height: auto;
	  border: 1px solid #ddd;
	  border-radius: 4px;
	  padding: 5px;
	}
  
	.image-details {
	  margin-top: 10px;
	  background-color: #f9f9f9;
	  padding: 10px;
	  border-radius: 4px;
	}
	.navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .navigation button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }

  .navigation button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  </style>