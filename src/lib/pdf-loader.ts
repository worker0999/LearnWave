// Custom PDF loading utility for authenticated PDFs
export async function loadAuthenticatedPDF(url: string, token: string): Promise<Uint8Array> {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error loading authenticated PDF:', error);
    throw error;
  }
}