// components/XFrameBypassWrapper.tsx
import React, { memo, useEffect } from "react";

const XFrameBypassWrapper: React.FC<{ src: string }> = memo(({ src }) => {
  useEffect(() => {
    // Dynamically import the custom element definition if it's not yet defined
    if (!customElements.get("x-frame-bypass")) {
      import("./xframe.js"); // Adjust the path to where x-frame-bypass.js is stored
    }
  }, []);

  return (
    // Note: `is` attribute is required to use custom elements with "extends" in Next.js
    <iframe
      key={src}
      is="x-frame-bypass"
      src={src}
      style={{ width: "100%", height: "100%" }}
    />
  );
});

export default XFrameBypassWrapper;
