"use client";

import { useState } from "react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect fill='%230c0c12'/%3E%3Ctext x='400' y='380' text-anchor='middle' fill='%2327272a' font-size='80' font-family='system-ui'%3EFAMILY%3C/text%3E%3Ctext x='400' y='440' text-anchor='middle' fill='%2318181b' font-size='24' font-family='system-ui'%3EНет изображения%3C/text%3E%3C/svg%3E";

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function EventImage({ src, alt, className = "" }: EventImageProps) {
  const [error, setError] = useState(false);

  const imgSrc = (!src || error) ? PLACEHOLDER : src;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
