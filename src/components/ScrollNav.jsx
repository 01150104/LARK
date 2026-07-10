import { useEffect, useState } from "react";
import { THEME } from "../data/larkData";

export default function ScrollNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    // scroll-position based instead of IntersectionObserver — the hero
    // section is position:fixed, so its intersection state never changes
    // once observed, meaning an observer-based approach can never
    // re-activate "HOME" after you scroll away from it and back
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let current = sections[0]?.id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) {
          current = id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <nav
      style={{
        position: "fixed",
        right: "clamp(14px, 2.4vw, 40px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 18,
      }}
    >
      {sections.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: "'DotGothic16', sans-serif",
                fontSize: 10,
                letterSpacing: 1,
                color: isActive ? THEME.accent : "rgba(231,231,226,0.32)",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(0)" : "translateX(6px)",
                transition: "opacity 0.3s ease, transform 0.3s ease, color 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
            <span
              style={{
                width: isActive ? 8 : 6,
                height: isActive ? 8 : 6,
                borderRadius: 0,
                background: isActive ? THEME.accent : "rgba(231,231,226,0.35)",
                border: `2px solid ${isActive ? THEME.accent : "rgba(231,231,226,0.4)"}`,
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            />
          </a>
        );
      })}
    </nav>
  );
}
