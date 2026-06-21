import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export default function PlaceholderImage({
  alt,
  className = '',
  dataSlot,
  fallbackIcon,
  src = '/assets/placeholder.png',
  style = {},
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={className} data-slot={dataSlot} style={{ ...styles.fallback, ...style }}>
        {fallbackIcon || <ImageOff size={20} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      data-slot={dataSlot}
      onError={() => setFailed(true)}
      style={style}
    />
  );
}

const styles = {
  fallback: {
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
  },
};
