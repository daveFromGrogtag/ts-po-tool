import { storage } from "./init.js"
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

function resizeImageToHeight(file, targetHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      canvas.height = targetHeight;
      canvas.width = targetHeight * aspectRatio;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob."));
      }, 'image/jpeg', 0.9);
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadResizedImage(file, targetHeight, pathPrefix) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error("Invalid file: must be an image.");
  }

  const resizedBlob = await resizeImageToHeight(file, targetHeight);
  const filename = `${pathPrefix}/${Date.now()}_${file.name}`;
  const imageRef = ref(storage, filename);

  await uploadBytes(imageRef, resizedBlob);
  return await getDownloadURL(imageRef);
}
