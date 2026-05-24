import { useState } from 'react';

const ProductImage = ({ src, alt, className = '' }) => {
  const fallback = `https://placehold.co/400x500/e0e7ff/4f46e5?text=${encodeURIComponent(
    (alt || 'Product').slice(0, 20)
  )}`;
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt || 'Product'}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
    />
  );
};

export default ProductImage;
