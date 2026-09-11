/**
 * File & image processing utilities for SAHAAYA Multimodal Engine
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
export const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
export const SUPPORTED_DOC_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function compressImageClient(file: File, maxWidth = 1200, quality = 0.82): Promise<{ base64: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          const rawBase64 = e.target?.result as string;
          resolve({ base64: rawBase64, previewUrl: rawBase64 });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL(file.type || "image/jpeg", quality);
        resolve({
          base64: compressedBase64,
          previewUrl: compressedBase64,
        });
      };
      img.onerror = () => {
        const raw = e.target?.result as string;
        resolve({ base64: raw, previewUrl: raw });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function readFileAsBase64(file: File): Promise<{ base64: string; textContent?: string }> {
  return new Promise((resolve, reject) => {
    // If it's a plain text file, also extract readable text
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const textReader = new FileReader();
      textReader.onload = (te) => {
        const textContent = te.target?.result as string;
        const b64Reader = new FileReader();
        b64Reader.onload = (be) => {
          resolve({
            base64: be.target?.result as string,
            textContent: textContent.slice(0, 5000), // first 5k characters
          });
        };
        b64Reader.readAsDataURL(file);
      };
      textReader.readAsText(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        base64: e.target?.result as string,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

