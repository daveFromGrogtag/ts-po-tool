import { storage } from "./init.js"
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

async function uploadFile(pdfData) {
  // Load PDF using PDF.js
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  
  // Fetch the first page
  const pageNumber = 1;
  const page = await pdf.getPage(pageNumber);
  
  // Set desired thumbnail size
  const thumbnailWidth = 100;  // Adjust width as needed
  const viewport = page.getViewport({ scale: 1 });
  const scale = thumbnailWidth / viewport.width;
  const scaledViewport = page.getViewport({ scale });
  
  // Create canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;
  
  // Render PDF page on canvas
  const renderContext = {
    canvasContext: context,
    viewport: scaledViewport
  };
  await page.render(renderContext).promise;
  
  // Convert canvas to Blob
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  
  // Create a reference to the file location in Firebase Storage
  const timestamp = Date.now(); // Optional: Add a timestamp to the filename for uniqueness
  const fileName = `thumbnails/pdf-thumbnail-${timestamp}.png`;
  console.log(fileName);
  const fileRef = ref(storage, fileName);
  try {
    // Upload the Blob to Firebase Storage
    await uploadBytes(fileRef, blob);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(fileRef);

    // Return the download URL
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}



export { uploadFile }