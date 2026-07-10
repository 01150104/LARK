import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import ImageSlot from "./components/ImageSlot";
import ScrollNav from "./components/ScrollNav";
import { THEME, FONT_PIXEL, FONT_ARCADE, HERO_IMG, CHAR_DATA, IN_GAME_SHOTS } from "./data/larkData";

const SECTIONS = [
  { id: "hero", label: "HOME" },
  { id: "story", label: "STORY" },
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
  const storyRef = useRef(null);
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

  // preload every in-game screenshot up front so switching slides never
  // has to wait on a fresh network fetch mid-crossfade (that stall is what
  // reads as a "hitch" during the fade)
  useEffect(() => {
    IN_GAME_SHOTS.forEach((shot) => {
      const img = new Image();
      img.src = shot.img;
    });
  }, []);

  // laser-pointer cursor: a small glowing dot that chases the real cursor
  // with a bit of spring lag, rather than snapping to it 1:1
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const laserX = useSpring(mouseX, { damping: 22, stiffness: 260, mass: 0.4 });
  const laserY = useSpring(mouseY, { damping: 22, stiffness: 260, mass: 0.4 });

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseX.set(e.clientX - 7);
      mouseY.set(e.clientY - 7);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress: pageProgress } = useScroll();

  // hero is pinned (position: fixed) and never itself moves or fades —
  // instead the Story section slides up from below and covers it, going
  // from translucent to fully opaque exactly as it finishes covering the screen
  const { scrollYProgress: storyScrollProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "start start"],
  });
  const storyOverlayOpacity = useTransform(storyScrollProgress, [0, 1], [0.15, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // below this width the Characters section switches from "art on the right,
  // panel overlaid on the left" to a stacked layout — on a phone the overlay
  // panel is wide enough to cover the character entirely, so it can't overlap
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      style={{
        background: THEME.bg,
        color: THEME.ink,
        fontFamily: FONT_PIXEL,
        width: "100%",
        overflow: "hidden visible",
      }}
    >
      <GlobalStyle />

      <AnimatePresence>{showIntro && <Opening onDone={() => setShowIntro(false)} />}</AnimatePresence>

      {/* laser-pointer cursor follower */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: laserX,
          y: laserY,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff3b44 0%, rgba(255,59,68,0.65) 45%, transparent 75%)",
          boxShadow: "0 0 18px 5px rgba(255,59,68,0.55), 0 0 40px 14px rgba(255,59,68,0.22)",
          zIndex: 300,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

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
          background: THEME.accent,
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
          background: scrolled ? THEME.bgDeep : "transparent",
          borderBottom: `2px solid ${scrolled ? THEME.hairline : "transparent"}`,
          transition: "all 0.3s ease",
        }}
      >
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <span
            style={{
              fontFamily: FONT_ARCADE,
              fontSize: 24,
              letterSpacing: 2,
              color: THEME.ink,
            }}
          >
            LARK
          </span>
        </a>
        <nav style={{ display: "flex", gap: "clamp(20px, 3vw, 44px)" }}>
          <NavLink href="https://github.com/01150104" label="CONTACT" external color={THEME.accent} />
          {SECTIONS.map((s) => (
            <NavLink key={s.id} href={`#${s.id}`} label={s.label} />
          ))}
        </nav>
      </header>

      <ScrollNav sections={SECTIONS} />

      {/* ================= SECTION 1: HERO (HOME) ================= */}
      {/* pinned via position:fixed and filled edge-to-edge by the key art —
          it never scrolls or fades on its own. the spacer div right after it
          reserves one viewport of scroll distance, and Story (which follows)
          slides up over it, going translucent → opaque as it arrives. */}
      <section id="hero" style={{ position: "fixed", inset: 0, zIndex: 1, overflow: "hidden" }}>
        <ImageSlot
          src={HERO_IMG}
          alt="LARK main visual"
          label="MAIN VISUAL"
          hint="主人公 七野七海 イラスト · 화면 전체를 채우는 풀블리드, 1920×1080 이상 권장"
          aspectRatio="auto"
          radius={0}
          fit="cover"
          style={{ height: "100%" }}
        />

        {/* legibility gradient so the logo/scroll-cue read over any art */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 62%, rgba(0,0,0,0.65) 100%)",
            pointerEvents: "none",
          }}
        />

        <EmberParticles />
        <FloatingSuits />

        {/* title overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: FONT_ARCADE,
              fontSize: "clamp(56px, 12vw, 150px)",
              lineHeight: 1,
              letterSpacing: 2,
              color: THEME.ink,
              textShadow: `4px 0 0 ${THEME.accent}, -4px 0 0 #2a8fa0`,
              animation: "glitchFlicker 6s ease-in-out infinite",
            }}
          >
            LARK
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.a
          href="#story"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "clamp(28px, 5vh, 48px)",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: THEME.muted,
            cursor: "pointer",
          }}
        >
          <span style={{ fontFamily: FONT_ARCADE, fontSize: 9, letterSpacing: 1 }}>SCROLL</span>
          <span style={{ position: "relative", width: 2, height: 30, background: THEME.hairline, overflow: "hidden" }}>
            <motion.span
              animate={{ y: [-30, 30] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", left: -1, width: 3, height: 12, background: THEME.accent }}
            />
          </span>
        </motion.a>
      </section>

      {/* scroll-space spacer for the fixed hero above */}
      <div style={{ height: "100dvh" }} />

      {/* ================= SECTION 2: STORY ================= */}
      <motion.section
        id="story"
        ref={storyRef}
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px",
          background: `radial-gradient(ellipse 60% 50% at 50% 8%, rgba(200,48,60,0.14), transparent 65%), linear-gradient(180deg, ${THEME.bgDeep} 0%, ${THEME.bg} 55%, ${THEME.bgDeep} 100%)`,
          overflow: "hidden",
          opacity: storyOverlayOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage: "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 2px, #000 3px)",
            pointerEvents: "none",
          }}
        />
        <FloatingSuits />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          style={{ position: "relative", zIndex: 2, maxWidth: 680, textAlign: "center" }}
        >
          <motion.div
            variants={fadeUp}
            style={{ fontFamily: FONT_PIXEL, fontSize: 13, letterSpacing: 3, color: THEME.accent, textTransform: "uppercase", marginBottom: 22 }}
          >
            A World Ruled by Probability
          </motion.div>
          <motion.div
            variants={fadeUp}
            style={{
              fontFamily: FONT_PIXEL,
              fontSize: "clamp(18px,2.1vw,22px)",
              letterSpacing: 0.5,
              color: THEME.accent,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            「賭けるべき時、降りるべき時——それを見極めよ。」
          </motion.div>
          <motion.div variants={fadeUp} style={{ fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.95, color: THEME.muted, fontWeight: 300 }}>
            すべての力が「確率」によって動く世界、フォルトゥナ。
            <br />
            「必然の魔王」が現れて確率を書き換え、住民たちは悪い結果しか出ない呪いにかかり、
            <br />
            村は魔王の部下に侵略された。
            <br />
            <br />
            運命がすでに固定されたこの世界で、
            <br />
            ただ一人——異邦人<b style={{ color: THEME.ink, fontWeight: 500 }}>七野七海</b>の運命だけがまだ定まっていない。
            <br />
            魔王を討伐できる資格を持つのは、彼女だけだ。
            <br />
            <br />
            ルーレットとダイスを手に、七海は村を一つずつ解放していく——死線の戦場で、
            <br />
            本物のギャンブルを学びながら。
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ================= SECTION 3: CHARACTERS ================= */}
      <section
        id="characters"
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100dvh",
          background: THEME.bgDeep,
          overflow: "hidden",
          ...(isMobile && {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "100px 20px 40px",
          }),
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={
              isMobile
                ? { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }
                : { position: "absolute", inset: 0 }
            }
          >
            {/* big character render — right-biased & overlaid by the panel on
                desktop; stacked full-width above the panel on mobile so the
                panel never has to cover it to fit */}
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={
                isMobile
                  ? { position: "relative", width: "100%", height: "42vh" }
                  : { position: "absolute", top: 0, right: 0, bottom: 0, width: "min(85%, 1600px)" }
              }
            >
              {/* idle float + drop-shadow — reads as the character "standee"
                  floating above the background rather than flat against it */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  height: "100%",
                  filter: "drop-shadow(-14px 26px 22px rgba(0,0,0,0.6)) drop-shadow(0 0 34px rgba(200,48,60,0.18))",
                }}
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

              {/* CRT static crawl + periodic signal-glitch streak */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  mixBlendMode: "overlay",
                  opacity: 0.1,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, transparent 1px, transparent 3px)",
                  backgroundSize: "3px 3px, 4px 4px",
                  animation: "staticDrift 0.6s steps(3) infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background: `linear-gradient(100deg, transparent 42%, ${selected.accent}40 50%, transparent 58%)`,
                  animation: "bgGlitchJitter 6.5s steps(1) infinite",
                }}
              />
            </motion.div>

            {/* blend the art's left edge into the panel side — only relevant
                to the desktop overlay layout, not the mobile stacked one */}
            {!isMobile && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, ${THEME.bgDeep} 0%, ${THEME.bgDeep}aa 24%, transparent 46%)`,
                  pointerEvents: "none",
                }}
              />
            )}

            {/* single glass panel: header + story + avatar row, centered on the screen.
                positioning is a plain (unanimated) div so the entrance fade and the
                continuous idle bob below don't have to fight a static translateY(-50%)
                for control of `transform`. */}
            <div
              style={
                isMobile
                  ? { position: "relative", width: "100%", maxWidth: 460, margin: "0 auto", zIndex: 2, display: "flex", flexDirection: "column", gap: 16 }
                  : {
                      position: "absolute",
                      left: "clamp(20px, 4vw, 64px)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "min(456px, 80vw)",
                      zIndex: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }
              }
            >
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }}>
                {/* gentle continuous float — noticeable, but small enough that the
                    story text stays comfortably readable while it drifts */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    maxHeight: isMobile ? "none" : "calc(100dvh - 200px)",
                    overflowY: isMobile ? "visible" : "auto",
                    border: `3px solid ${THEME.ink}`,
                    boxShadow: `0 0 0 3px ${THEME.bgDeep}, 0 0 0 6px ${selected.accent}`,
                    background: "#0a0a0a",
                  }}
                >
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 32px", borderBottom: `2px solid ${THEME.hairline}` }}>
                <span
                  style={{
                    width: 42,
                    height: 42,
                    border: `2px solid ${selected.accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT_ARCADE,
                    fontSize: 12,
                    color: selected.accent,
                    flexShrink: 0,
                  }}
                >
                  {selected.fileNo}
                </span>
                <div>
                  <div style={{ fontFamily: FONT_PIXEL, fontSize: "clamp(22px,2.8vw,28px)", fontWeight: 700, color: THEME.ink, lineHeight: 1.3 }}>
                    {selected.name}
                  </div>
                  <div style={{ fontFamily: FONT_PIXEL, fontSize: 13, color: THEME.muted, marginTop: 3 }}>{selected.role}</div>
                </div>
              </div>

              {/* story */}
              <div style={{ padding: "22px 32px" }}>
                <div style={{ fontFamily: FONT_ARCADE, fontSize: 13, letterSpacing: 1, color: selected.accent, marginBottom: 14 }}>
                  STORY
                </div>
                <div style={{ fontFamily: FONT_PIXEL, fontSize: "clamp(13.5px,1.5vw,15px)", lineHeight: 1.9, color: THEME.muted, marginBottom: 16 }}>{selected.desc}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selected.tags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                      style={{
                        fontFamily: FONT_PIXEL,
                        fontSize: 11,
                        letterSpacing: 0.5,
                        color: THEME.muted,
                        border: `2px solid ${THEME.hairline}`,
                        padding: "6px 14px",
                      }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </div>
              </div>

                </motion.div>
              </motion.div>

              {/* avatar row + prev/next — its own box, outside the story panel.
                  same float as the story panel, just 0.1s behind it */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, delay: 0.1, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 8 : 14,
                  padding: isMobile ? "10px 12px" : "12px 18px",
                  border: `3px solid ${THEME.ink}`,
                  boxShadow: `0 0 0 3px ${THEME.bgDeep}, 0 0 0 6px ${selected.accent}`,
                  background: "#0a0a0a",
                }}
              >
                <button
                  onClick={() => setSelectedIdx((selectedIdx - 1 + CHAR_DATA.length) % CHAR_DATA.length)}
                  style={{ background: "none", border: "none", color: THEME.muted, fontSize: 20, cursor: "pointer", padding: 4, flexShrink: 0 }}
                  aria-label="previous character"
                >
                  ‹
                </button>
                <div style={{ display: "flex", gap: isMobile ? 6 : 10, flex: 1 }}>
                  {CHAR_DATA.map((char, idx) => {
                    const isActive = idx === selectedIdx;
                    return (
                      <motion.button
                        key={char.name}
                        layout
                        onClick={() => setSelectedIdx(idx)}
                        style={{
                          width: isMobile ? 40 : 48,
                          height: isMobile ? 40 : 48,
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
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ================= SECTION 4: IN-GAME SCREENS ================= */}
      <section
        id="ingame"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(90px,10vw,150px) clamp(20px,4vw,64px) 100px",
          background: THEME.bgDeep,
          overflow: "hidden",
        }}
      >
        <FloatingSuits />
        <SectionHeading eyebrow="IN-GAME" title="実際の画面より" />

        <div style={{ position: "relative", maxWidth: 1160, margin: "clamp(56px,6vw,80px) auto 0" }}>
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              border: `3px solid ${THEME.ink}`,
              boxShadow: `0 0 0 3px ${THEME.bgDeep}, 0 0 0 6px ${THEME.accent}`,
            }}
          >
            {/* both slides animate at once (no "wait" gap) so the crossfade
                never shows a blank frame between them */}
            <AnimatePresence>
              <motion.div
                key={IN_GAME_SHOTS[shotIdx].no}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ position: "absolute", inset: 0 }}
              >
                <ImageSlot
                  src={IN_GAME_SHOTS[shotIdx].img}
                  alt={IN_GAME_SHOTS[shotIdx].caption}
                  label={`SCREEN ${IN_GAME_SHOTS[shotIdx].no}`}
                  aspectRatio="auto"
                  radius={0}
                  style={{ height: "100%" }}
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
                border: `2px solid ${THEME.ink}`,
                background: THEME.bgDeep,
                color: THEME.ink,
                fontFamily: FONT_ARCADE,
                fontSize: 16,
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
                border: `2px solid ${THEME.ink}`,
                background: THEME.bgDeep,
                color: THEME.ink,
                fontFamily: FONT_ARCADE,
                fontSize: 16,
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
              transition={{ duration: 0.5 }}
              style={{ fontFamily: FONT_PIXEL, fontSize: 13, color: THEME.muted, marginTop: 18, textAlign: "center" }}
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
                  width: idx === shotIdx ? 22 : 10,
                  height: 10,
                  borderRadius: 0,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: idx === shotIdx ? THEME.accent : THEME.hairline,
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
          <div style={{ fontFamily: FONT_ARCADE, letterSpacing: 2, fontSize: 12, color: THEME.accent }}>
            ── LARK ──
          </div>
          <div style={{ fontFamily: FONT_PIXEL, marginTop: 16, fontSize: 12, color: THEME.muted, opacity: 0.7 }}>
            © LARK Portfolio Project — ファンポートフォリオ用オリジナル作品
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function Opening({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 1.6, times: [0, 0.75, 1], ease: EASE }}
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
        animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 1.1] }}
        transition={{ duration: 1.4, times: [0, 0.3, 0.7, 1], ease: EASE }}
        style={{
          position: "absolute",
          fontFamily: FONT_ARCADE,
          fontSize: "clamp(40px, 8vw, 100px)",
          letterSpacing: 2,
          color: THEME.ink,
          textShadow: `4px 0 0 ${THEME.accent}, -4px 0 0 #2a8fa0`,
        }}
      >
        LARK
      </motion.div>
    </motion.div>
  );
}

function NavLink({ href, label, external = false, color }) {
  const [hover, setHover] = useState(false);
  const baseColor = color || THEME.muted;
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        fontFamily: FONT_ARCADE,
        fontSize: 10,
        letterSpacing: 1,
        color: hover ? THEME.ink : baseColor,
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
          background: THEME.accent,
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
      <motion.div variants={fadeUp} style={{ fontFamily: FONT_ARCADE, letterSpacing: 1, fontSize: 12, color: THEME.accent }}>
        {eyebrow}
      </motion.div>
      <motion.div
        variants={fadeUp}
        style={{
          fontFamily: FONT_PIXEL,
          fontSize: compact ? "clamp(22px,3vw,28px)" : "clamp(24px,3.6vw,34px)",
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
            width: 4,
            height: 4,
            background: "#c8303c",
          }}
        />
      ))}
    </div>
  );
}

function FloatingSuits() {
  const suits = ["♥", "♠", "♦", "♣"];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.7, y: 0, x: 0 }}
          animate={{ opacity: [0.7, 0.9, 0.7, 0.9], y: [0, -70, -150, -230], x: [0, i % 2 === 0 ? 16 : -16, 0, i % 2 === 0 ? -16 : 16] }}
          transition={{
            duration: 7 + (i % 4) * 1.5,
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${(i * 19 + 6) % 100}%`,
            bottom: `${(i * 23) % 65}%`,
            fontSize: 34 + (i % 3) * 16,
            color: "#e0303c",
            lineHeight: 1,
            textShadow: "0 0 8px rgba(224,48,60,0.6)",
          }}
        >
          {suits[i % suits.length]}
        </motion.span>
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
      @keyframes glitchFlicker {
        0%, 92%, 100% { text-shadow: 3px 0 0 #c8303c, -3px 0 0 #2a8fa0; transform: translate(0, 0); }
        93% { text-shadow: -4px 1px 0 #c8303c, 4px -1px 0 #2a8fa0; transform: translate(-2px, 0); }
        95% { text-shadow: 4px -1px 0 #c8303c, -4px 1px 0 #2a8fa0; transform: translate(2px, 0); }
        97% { text-shadow: 3px 0 0 #c8303c, -3px 0 0 #2a8fa0; opacity: 0.75; }
      }
      @keyframes staticDrift {
        0% { background-position: 0 0, 0 0; }
        100% { background-position: 137px 71px, -83px 59px; }
      }
      @keyframes bgGlitchJitter {
        0%, 93%, 100% { transform: translate(0, 0); opacity: 0; }
        93.5% { transform: translate(8px, -3px); opacity: 0.6; }
        94% { transform: translate(-6px, 2px); opacity: 0.4; }
        94.5% { transform: translate(4px, -4px); opacity: 0.6; }
        95% { transform: translate(0, 0); opacity: 0; }
      }
    `}</style>
  );
}
