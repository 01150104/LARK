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
  accent = "#cda86a",
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
        background: "linear-gradient(160deg, #14100f, #0a0808)",
        border: `1px dashed ${failed ? "rgba(255,255,255,0.14)" : "transparent"}`,
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
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `1px solid ${accent}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: accent,
              opacity: 0.85,
            }}
          >
            ⚄
          </div>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: 2,
              color: "rgba(230,224,222,0.5)",
              textTransform: "uppercase",
            }}
          >
            {label || "IMAGE PLACEHOLDER"}
          </div>
          {hint && (
            <div style={{ fontSize: 10, color: "rgba(200,192,190,0.36)", letterSpacing: 0.5 }}>
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
