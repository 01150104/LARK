import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ImageSlot from "./components/ImageSlot";
import ScrollNav from "./components/ScrollNav";
import { THEME, HERO_IMG, CHAR_DATA, IN_GAME_SHOTS } from "./data/larkData";

const SECTIONS = [
  { id: "hero", label: "HOME" },
  { id: "characters", label: "CHARACTERS" },
  { id: "ingame", label: "IN-GAME" },
];

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function LarkLanding() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = CHAR_DATA[selectedIdx];
  const heroRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [shotIdx, setShotIdx] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  useEffect(() => {
    const t = setTimeout(() => {
      setShotIdx((i) => (i + 1) % IN_GAME_SHOTS.length);
    }, 5000);
    return () => clearTimeout(t);
  }, [shotIdx]);

  const { scrollYProgress: pageProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroVisualY = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroVisualScale = useTransform(heroProgress, [0, 1], [1, 1.06]);
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: THEME.bg,
        color: THEME.ink,
        fontFamily: "'Noto Serif JP', serif",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <GlobalStyle />

      <AnimatePresence>{showIntro && <Opening onDone={() => setShowIntro(false)} />}</AnimatePresence>

      {/* scroll progress — single hairline, no gradient */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          transformOrigin: "0% 50%",
          scaleX: pageProgress,
          background: THEME.gold,
          zIndex: 100,
          opacity: 0.85,
        }}
      />

      {/* sticky header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 64px)",
          height: scrolled ? 64 : 92,
          background: scrolled ? "rgba(7,5,5,0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: `1px solid ${scrolled ? THEME.hairline : "transparent"}`,
          transition: "all 0.45s ease",
        }}
      >
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: 5,
              color: THEME.ink,
            }}
          >
            LARK
          </span>
        </a>
        <nav style={{ display: "flex", gap: "clamp(20px, 3vw, 44px)" }}>
          {SECTIONS.map((s) => (
            <NavLink key={s.id} href={`#${s.id}`} label={s.label} />
          ))}
        </nav>
      </header>

      <ScrollNav sections={SECTIONS} />

      {/* ================= SECTION 1: HERO ================= */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "140px 24px 90px",
          background: `radial-gradient(ellipse 60% 50% at 50% 8%, rgba(205,168,106,0.10), transparent 65%), linear-gradient(180deg, ${THEME.bgDeep} 0%, ${THEME.bg} 55%, ${THEME.bgDeep} 100%)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            background: "radial-gradient(ellipse 45% 35% at 25% 25%, rgba(205,168,106,0.08), transparent 70%)",
            animation: "driftGlow 26s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage: "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 2px, #000 3px)",
            pointerEvents: "none",
          }}
        />
        <EmberParticles />

        <motion.div style={{ opacity: heroFade, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: 6,
              color: THEME.gold,
              textTransform: "uppercase",
            }}
          >
A World Ruled by Probability
          </motion.div>

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginTop: 22, width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
              style={{
                fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
                fontWeight: 900,
                fontSize: "clamp(64px, 13vw, 176px)",
                lineHeight: 0.92,
                letterSpacing: 4,
                background: `linear-gradient(180deg, #fbf6ec 0%, ${THEME.gold} 55%, #7a5f34 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "flicker 8s ease-in-out infinite",
              }}
            >
              LARK
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(11px,1.6vw,14px)",
                letterSpacing: 6,
                color: THEME.muted,
                marginTop: 16,
              }}
            >
確率と運命の国フォルトゥナ — A Roguelike Roulette &amp; Dice Battle
            </motion.div>
          </div>

          {/* main visual */}
          <motion.div
            style={{
              y: heroVisualY,
              scale: heroVisualScale,
              position: "relative",
              zIndex: 2,
              width: "min(74vw, 1020px)",
              maxWidth: "94vw",
              marginTop: "clamp(40px, 5vw, 64px)",
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
          >
            <div style={{ position: "relative" }}>
              <ImageSlot
                src={HERO_IMG}
                alt="LARK main visual"
                label="MAIN VISUAL"
                hint="主人公 七野七海 イラスト · 1920×1200 권장"
                aspectRatio="16 / 9"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(180deg, transparent 55%, ${THEME.bgDeep} 100%)`,
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {/* catchphrase */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            style={{ position: "relative", zIndex: 2, maxWidth: 640, textAlign: "center", marginTop: "clamp(36px,5vw,56px)" }}
          >
            <motion.div
              variants={fadeUp}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(17px,2.2vw,22px)",
                letterSpacing: 1,
                color: THEME.ink,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              「賭けるべき時、降りるべき時——それを見極めよ。」
            </motion.div>
            <motion.div variants={fadeUp} style={{ fontSize: "clamp(13.5px,1.4vw,15px)", lineHeight: 2, color: THEME.muted, fontWeight: 300 }}>
              すべての力が「確率」によって動く世界、フォルトゥナ。
              「必然の魔王」が現れて確率を書き換え、住民たちは悪い結果しか出ない呪いにかかり、村は魔王の部下に侵略された。
              <br />
              運命がすでに固定されたこの世界で、ただ一人——異邦人<b style={{ color: THEME.ink, fontWeight: 500 }}>七野七海</b>の運命だけがまだ定まっていない。
              魔王を討伐できる資格を持つのは、彼女だけだ。
              <br />
              ルーレットとダイスを手に、七海は村を一つずつ解放していく——死線の戦場で、本物のギャンブルを学びながら。
            </motion.div>
          </motion.div>

          <motion.a
            href="#characters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{
              position: "relative",
              zIndex: 2,
              marginTop: "clamp(40px,5vw,56px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: THEME.muted,
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3 }}>SCROLL</span>
            <span style={{ position: "relative", width: 1, height: 30, background: THEME.hairline, overflow: "hidden" }}>
              <motion.span
                animate={{ y: [-30, 30] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", left: -1, width: 3, height: 12, background: THEME.gold }}
              />
            </span>
          </motion.a>
        </motion.div>
      </section>

      {/* ================= SECTION 2: CHARACTERS ================= */}
      <section
        id="characters"
        style={{
          position: "relative",
          minHeight: "100dvh",
          background: THEME.bgDeep,
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={selected.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} style={{ position: "absolute", inset: 0 }}>
            {/* big character render, right-biased — cropping the sides/legs is fine,
                the point is scale: this is the dominant visual of the section */}
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(70%, 1400px)" }}
            >
              <ImageSlot
                src={selected.img}
                alt={selected.name}
                label={`FILE No. ${selected.fileNo}`}
                accent={selected.accent}
                fit={selected.stageFit || "cover"}
                aspectRatio="auto"
                radius={0}
                style={{ height: "100%" }}
                imgStyle={{
                  objectPosition: selected.stagePosition || "center 12%",
                  transform: selected.stageTransform,
                }}
              />
            </motion.div>

            {/* blend the art's left edge into the panel side */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, ${THEME.bgDeep} 0%, ${THEME.bgDeep}aa 24%, transparent 46%)`,
                pointerEvents: "none",
              }}
            />

            {/* single glass panel: header + story + avatar row, centered on the screen */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              style={{
                position: "absolute",
                left: "clamp(20px, 4vw, 64px)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "min(880px, 84vw)",
                maxHeight: "calc(100dvh - 120px)",
                overflowY: "auto",
                zIndex: 2,
                border: `1px solid ${THEME.hairline}`,
                background: "rgba(9,7,7,0.55)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 32px", background: "rgba(255,255,255,0.04)" }}>
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    border: `1px solid ${selected.accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Cinzel',serif",
                    fontSize: 13,
                    color: selected.accent,
                    flexShrink: 0,
                  }}
                >
                  {selected.fileNo}
                </span>
                <div>
                  <div style={{ fontFamily: "'Cinzel Decorative','Cinzel',serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: THEME.ink, lineHeight: 1.15 }}>
                    {selected.name}
                  </div>
                  <div style={{ fontSize: 13, color: THEME.muted, marginTop: 3 }}>{selected.role}</div>
                </div>
              </div>

              {/* story */}
              <div style={{ padding: "22px 32px", background: "rgba(0,0,0,0.18)" }}>
                <div style={{ fontFamily: "'Cinzel Decorative','Cinzel',serif", fontSize: "clamp(19px,2.4vw,23px)", letterSpacing: 2, color: selected.accent, opacity: 0.9, marginBottom: 12 }}>
                  Story
                </div>
                <div style={{ fontSize: "clamp(13.5px,1.5vw,15px)", lineHeight: 1.85, color: THEME.muted, fontWeight: 300, marginBottom: 16 }}>{selected.desc}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selected.tags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 10,
                        letterSpacing: 1,
                        color: THEME.muted,
                        border: `1px solid ${THEME.hairline}`,
                        padding: "6px 14px",
                        textTransform: "uppercase",
                      }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* avatar row + prev/next, anchored to the bottom of the same panel */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 32px", borderTop: `1px solid ${THEME.hairline}` }}>
                <button
                  onClick={() => setSelectedIdx((selectedIdx - 1 + CHAR_DATA.length) % CHAR_DATA.length)}
                  style={{ background: "none", border: "none", color: THEME.muted, fontSize: 20, cursor: "pointer", padding: 4, flexShrink: 0 }}
                  aria-label="previous character"
                >
                  ‹
                </button>
                <div style={{ display: "flex", gap: 10, flex: 1 }}>
                  {CHAR_DATA.map((char, idx) => {
                    const isActive = idx === selectedIdx;
                    return (
                      <motion.button
                        key={char.name}
                        layout
                        onClick={() => setSelectedIdx(idx)}
                        style={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${isActive ? char.accent : THEME.hairline}`,
                          padding: 0,
                          cursor: "pointer",
                          background: "transparent",
                          overflow: "hidden",
                          flexShrink: 0,
                          transition: "border-color 0.3s ease",
                        }}
                      >
                        <ImageSlot
                          src={char.img}
                          alt={char.name}
                          label={char.fileNo}
                          accent={char.accent}
                          fit="cover"
                          aspectRatio="1 / 1"
                          radius={0}
                          imgStyle={{
                            objectPosition: "center 15%",
                            filter: isActive ? "none" : "grayscale(0.5) brightness(0.7)",
                            transition: "filter 0.3s ease",
                          }}
                        />
                      </motion.button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setSelectedIdx((selectedIdx + 1) % CHAR_DATA.length)}
                  style={{ background: "none", border: "none", color: THEME.muted, fontSize: 20, cursor: "pointer", padding: 4, flexShrink: 0 }}
                  aria-label="next character"
                >
                  ›
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ================= SECTION 3: IN-GAME SCREENS ================= */}
      <section
        id="ingame"
        style={{
          position: "relative",
          padding: "clamp(90px,10vw,150px) clamp(20px,4vw,64px) 100px",
          background: THEME.bgDeep,
        }}
      >
        <SectionHeading eyebrow="IN-GAME" title="実際の画面より" />

        <div style={{ position: "relative", maxWidth: 1160, margin: "clamp(56px,6vw,80px) auto 0" }}>
          <div style={{ position: "relative", border: `1px solid ${THEME.hairline}` }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={IN_GAME_SHOTS[shotIdx].no}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <ImageSlot
                  src={IN_GAME_SHOTS[shotIdx].img}
                  alt={IN_GAME_SHOTS[shotIdx].caption}
                  label={`SCREEN ${IN_GAME_SHOTS[shotIdx].no}`}
                  aspectRatio="16 / 9"
                  radius={0}
                />
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => setShotIdx((shotIdx - 1 + IN_GAME_SHOTS.length) % IN_GAME_SHOTS.length)}
              aria-label="previous screen"
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${THEME.hairline}`,
                background: "rgba(9,7,7,0.55)",
                backdropFilter: "blur(8px)",
                color: THEME.ink,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ‹
            </button>
            <button
              onClick={() => setShotIdx((shotIdx + 1) % IN_GAME_SHOTS.length)}
              aria-label="next screen"
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${THEME.hairline}`,
                background: "rgba(9,7,7,0.55)",
                backdropFilter: "blur(8px)",
                color: THEME.ink,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={IN_GAME_SHOTS[shotIdx].no}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: 13, color: THEME.muted, marginTop: 18, textAlign: "center" }}
            >
              {IN_GAME_SHOTS[shotIdx].caption}
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
            {IN_GAME_SHOTS.map((shot, idx) => (
              <button
                key={shot.no}
                onClick={() => setShotIdx(idx)}
                aria-label={`go to screen ${shot.no}`}
                style={{
                  width: idx === shotIdx ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: idx === shotIdx ? THEME.gold : THEME.hairline,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ textAlign: "center", marginTop: "clamp(80px,10vw,120px)" }}
        >
          <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: 5, fontSize: 11, color: THEME.gold, opacity: 0.8 }}>
            ── LARK ──
          </div>
          <div style={{ marginTop: 16, fontSize: 11.5, color: THEME.muted, opacity: 0.6 }}>
            © LARK Portfolio Project — ファンポートフォリオ用オリジナル作品
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function Opening({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.8, times: [0, 0.82, 1], ease: EASE }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: THEME.bgDeep,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 1] }}
        transition={{ duration: 1.6, times: [0, 0.3, 0.75, 1], ease: EASE }}
        style={{
          position: "absolute",
          fontFamily: "'Cinzel Decorative','Cinzel',serif",
          fontWeight: 900,
          fontSize: "clamp(56px, 10vw, 140px)",
          letterSpacing: 4,
          background: `linear-gradient(180deg, #fbf6ec 0%, ${THEME.gold} 55%, #7a5f34 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        LARK
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 32] }}
        transition={{ duration: 1.4, delay: 1.2, times: [0, 0.15, 0.75, 1], ease: EASE }}
        style={{
          position: "absolute",
          fontSize: 120,
          color: "#ffd75e",
          textShadow: "0 0 60px rgba(255,215,94,0.85), 0 0 120px rgba(255,215,94,0.5)",
        }}
      >
        ♠
      </motion.div>
    </motion.div>
  );
}

function NavLink({ href, label }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        fontFamily: "'Cinzel', serif",
        fontSize: 11,
        letterSpacing: 2,
        color: hover ? THEME.ink : THEME.muted,
        textDecoration: "none",
        paddingBottom: 6,
        transition: "color 0.25s ease",
      }}
    >
      {label}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 1,
          width: hover ? "100%" : "0%",
          background: THEME.gold,
          transition: "width 0.3s ease",
        }}
      />
    </a>
  );
}

function SectionHeading({ eyebrow, title, compact = false }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      style={{ textAlign: "center" }}
    >
      <motion.div variants={fadeUp} style={{ fontFamily: "'Cinzel', serif", letterSpacing: 5, fontSize: 11, color: THEME.gold, opacity: 0.85 }}>
        {eyebrow}
      </motion.div>
      <motion.div
        variants={fadeUp}
        style={{
          fontFamily: "'Cinzel Decorative','Cinzel', serif",
          fontSize: compact ? "clamp(24px,3.4vw,34px)" : "clamp(28px,4.4vw,44px)",
          fontWeight: 700,
          color: THEME.ink,
          marginTop: 12,
        }}
      >
        {title}
      </motion.div>
      {!compact && (
        <motion.div variants={fadeUp} style={{ width: 40, height: 1, background: THEME.hairline, margin: "24px auto 0" }} />
      )}
    </motion.div>
  );
}

function EmberParticles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0], y: [0, -140] }}
          transition={{
            duration: 9 + (i % 4) * 2.4,
            repeat: Infinity,
            delay: i * 1.3,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${(i * 9.7) % 100}%`,
            bottom: `${(i * 13) % 60}%`,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#cda86a",
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      @keyframes driftGlow {
        0% { transform: translateX(-4%) translateY(0); }
        50% { transform: translateX(3%) translateY(-2%); }
        100% { transform: translateX(-4%) translateY(0); }
      }
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        45% { opacity: 0.92; }
        50% { opacity: 0.8; }
        55% { opacity: 0.95; }
      }
    `}</style>
  );
}
