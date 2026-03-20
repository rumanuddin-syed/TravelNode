/**
 * Fetch images from Unsplash for a given query
 * @param {string} query - The search term (e.g., "Manali")
 * @param {number} perPage - Number of images to fetch (default 4)
 * @returns {Promise<Array>} Array of image URLs (raw URLs)
 */
async function fetchDestinationImages(query, perPage = 4) {
  if (!query) return [];

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn("Unsplash access key not configured. Skipping image fetch.");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    // Extract the raw image URLs (or use regular URLs)
    const images = data.results.map((img) => img.urls.regular);
    return images;
  } catch (err) {
    console.error("Failed to fetch Unsplash images:", err.message);
    return [];
  }
}

export {fetchDestinationImages};