import {storage} from "./init.js"
import { ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';

// Function to upload file to Firebase Storage
function uploadFile(file) {
    // Create a storage reference from our storage service
    const storageRef = ref(storage, `uploads/${new Date().getTime()}_${file.name}`);
  
    // Upload file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Error uploading file:', error);
      },
      () => {
        // Handle successful uploads on complete
        console.log('File uploaded successfully');
        
        // Get the download URL for the uploaded file
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          // Here you can do something with the download URL, like saving it to a database
        });
      }
    );
}


export {uploadFile}