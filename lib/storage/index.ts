import { v2 as cloudinary } from "cloudinary";
import { hasCloudinary, env } from "@/lib/env";
import { logWarn } from "@/lib/logging";

/**
 * Media storage abstraction.
 * Uploads to Cloudinary when the Cloudinary env vars are set; otherwise it is
 * a safe no-op that lets images be stored as plain URLs/references. Never
 * blocks a write when media is not configured.
 */

let configured = false;
function ensureConfigured() {
  if (configured) return;
  if (hasCloudinary) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }
  configured = true;
}

export async function uploadImage(input: {
  buffer?: Buffer;
  dataUrl?: string;
  folder?: string;
  publicId?: string;
}) {
  ensureConfigured();
  if (!hasCloudinary) {
    logWarn("Cloudinary not configured; skipping upload.");
    return { url: input.dataUrl ?? "", publicId: input.publicId ?? "" };
  }

  const uploadTarget =
    input.buffer ??
    (input.dataUrl ? { dataURI: input.dataUrl } as never : null);

  if (!uploadTarget) {
    throw new Error("uploadImage requires a buffer or dataUrl");
  }

  const result = await cloudinary.uploader.upload(uploadTarget as never, {
    folder: input.folder || "noire",
    public_id: input.publicId?.replace(/[/\\]/g, "_"),
    resource_type: "image",
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string) {
  ensureConfigured();
  if (!hasCloudinary) return;
  await cloudinary.uploader.destroy(publicId);
}