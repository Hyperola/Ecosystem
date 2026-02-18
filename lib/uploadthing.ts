import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// Replace 'OurFileRouter' with the type from your actual backend route
// We will define this in the next step
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();