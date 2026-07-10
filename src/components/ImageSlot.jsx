import { useState } from "react";

/**
 * Drop-in image slot. Points at a path under /public/images/.
 * Until the real file exists there, it renders a themed placeholder
 * (dashed border + label) instead of a broken image icon.
 */
export default function ImageSlot({
  src,
  alt = "",
  label,
  hint,
  aspectRatio = "3 / 4",
  radius = 0,
  accent = "#c8303c",
  fit = "cover",
  bleed = false,
  style,
  imgStyle,
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: radius,
        overflow: bleed ? "visible" : "hidden",
        background: "#0a0a0a",
        border: `2px dashed ${failed ? "rgba(231,231,226,0.3)" : "transparent"}`,
        ...style,
      }}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          style={
            bleed
              ? {
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  height: "122%",
                  width: "auto",
                  maxWidth: "none",
                  objectFit: "contain",
                  display: "block",
                  ...imgStyle,
                }
              : {
                  width: "100%",
                  height: "100%",
                  objectFit: fit,
                  display: "block",
                  ...imgStyle,
                }
          }
        />
      )}
      {failed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border: `2px solid ${accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              color: accent,
            }}
          >
            ⚄
          </div>
          <div
            style={{
              fontFamily: "'DotGothic16', sans-serif",
              fontSize: 11,
              letterSpacing: 1,
              color: "rgba(231,231,226,0.55)",
              textTransform: "uppercase",
            }}
          >
            {label || "IMAGE PLACEHOLDER"}
          </div>
          {hint && (
            <div style={{ fontSize: 10, color: "rgba(220,220,214,0.4)", letterSpacing: 0.5 }}>
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
