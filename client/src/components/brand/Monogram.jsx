import { memo } from "react";

/**
 * The Ronak Dutta (R) brand monogram mark.
 * Renders the cropped bespoke R logo.
 */
function Monogram({ className = "h-9 w-9", title = "Ronak Dutta" }) {
  return (
    <img
      src="/logo.webp"
      alt={title}
      width="36"
      height="36"
      className={`aspect-square shrink-0 object-contain transition-transform duration-500 ${className}`}
    />
  );
}

export default memo(Monogram);
