import fs from "fs";
import path from "path";
import sharp from "sharp";

const DEFAULT_LOGO = "public/assets/logo-white.svg";
const DEFAULT_OPACITY = 0.18;
const DEFAULT_SCALE = 0.24;
const MIN_IMAGE_SIZE = 240;

function getWatermarkConfig() {
  return {
    enabled: process.env.WATERMARK_ENABLED !== "false",
    logoPath: path.join(
      process.cwd(),
      process.env.WATERMARK_LOGO_PATH ?? DEFAULT_LOGO,
    ),
    opacity: Number(process.env.WATERMARK_OPACITY ?? DEFAULT_OPACITY),
    scale: Number(process.env.WATERMARK_SCALE ?? DEFAULT_SCALE),
  };
}

async function buildTransparentLogo(
  logoPath: string,
  logoWidth: number,
  opacity: number,
): Promise<Buffer> {
  const { data, info } = await sharp(logoPath, { density: 300 })
    .resize({ width: logoWidth, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const clampedOpacity = Math.min(Math.max(opacity, 0.05), 0.6);

  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * clampedOpacity);
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toBuffer();
}

export async function applyImageWatermark(
  imageBuffer: Buffer,
): Promise<Buffer> {
  const config = getWatermarkConfig();

  if (!config.enabled) {
    return imageBuffer;
  }

  if (!fs.existsSync(config.logoPath)) {
    console.warn(`Watermark logo not found: ${config.logoPath}`);
    return imageBuffer;
  }

  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width < MIN_IMAGE_SIZE || height < MIN_IMAGE_SIZE) {
    return imageBuffer;
  }

  const logoWidth = Math.max(Math.round(width * config.scale), 72);
  const transparentLogo = await buildTransparentLogo(
    config.logoPath,
    logoWidth,
    config.opacity,
  );

  return sharp(imageBuffer)
    .composite([{ input: transparentLogo, gravity: "centre" }])
    .webp({ lossless: true })
    .toBuffer();
}
