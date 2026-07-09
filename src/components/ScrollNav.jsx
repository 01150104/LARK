import { useEffect, useState } from "react";

export default function ScrollNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
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
                fontFamily: "'Cinzel', serif",
                fontSize: 10,
                letterSpacing: 2,
                color: isActive ? "#cda86a" : "rgba(220,212,208,0.32)",
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
                width: isActive ? 6 : 4,
                height: isActive ? 6 : 4,
                borderRadius: "50%",
                background: isActive ? "#cda86a" : "transparent",
                border: `1px solid ${isActive ? "#cda86a" : "rgba(220,212,208,0.4)"}`,
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
