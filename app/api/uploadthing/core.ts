import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";

const f = createUploadthing();

export const ourFileRouter = {
  // 1. Profile Picture: Relaxed (Just needs to be logged in)
  profilePicture: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile update for:", metadata.userId, "URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // 2. Product Images: Strict (Needs to be Approved)
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session || session.user.verificationStatus !== "APPROVED") {
        throw new Error("Unauthorized - Only approved plugs can drop gear");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;