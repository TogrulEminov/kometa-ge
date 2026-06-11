import Image, { StaticImageData } from "next/image";
import { FC } from "react";
interface ImageProps {
  src?: string | StaticImageData;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  title: string | undefined;
  unoptimized?: boolean;
  className?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  fill?: boolean;
}

const CustomImage: FC<ImageProps> = ({
  src,
  className,
  width,
  height,
  loading,
  unoptimized = false,
  title,
  fetchPriority,
  priority,
  sizes,
  fill,
}) => {
  const imageLoading = priority ? undefined : loading;

  return (
    <Image
      className={className}
      title={title}
      src={src!}
      priority={priority}
      alt={title ?? "custom"}
      quality={80}
      loading={imageLoading}
      unoptimized={unoptimized}
      fetchPriority={fetchPriority}
      sizes={sizes}
      {...(fill ? { fill: true } : { width, height })}
    />
  );
};

export default CustomImage;
