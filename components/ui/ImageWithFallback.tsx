'use client';

import React, { useState } from 'react'

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbcOhZ2VuZSBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt: string
  fallback?: string
}

export function ImageWithFallback({
  src,
  alt,
  fallback = FALLBACK_IMG,
  className = '',
  ...rest
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src)

  return (
    <img
      {...rest}
      src={imageSrc || fallback}
      alt={alt}
      className={className}
      onError={() => setImageSrc(fallback)}
    />
  )
}
