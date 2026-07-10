// RPG Maker horror-game palette — near-black CRT background, high-contrast
// off-white text, blood-red accent. Flat panels with solid pixel borders,
// no blur/glassmorphism, no soft glow — everything reads as a game-menu window.
export const THEME = {
  bg: "#080808",
  bgDeep: "#000000",
  ink: "#e7e7e2",
  muted: "#8f8f8a",
  hairline: "rgba(231,231,226,0.25)",
  accent: "#c8303c",
  crimson: "#7a1620",
};

export const FONT_PIXEL = "'DotGothic16', sans-serif";
export const FONT_ARCADE = "'Press Start 2P', 'DotGothic16', sans-serif";

export const HERO_IMG = "/images/hero-main.png";

export const CHAR_DATA = [
  {
    name: "七野七海",
    role: "主人公",
    accent: "#5a6f9e",
    fileNo: "01",
    img: "/images/char-01.png",
    stagePosition: "center 0%",
    desc: "フォルトゥナに落ちた27歳のニート。幼い頃から運のいい子だと言われ続け、パチンコで大当たりを引いた日から人生が崩れていった。敵を倒し、運命の国フォルトゥナから脱出しなければならない。",
    tags: ["27歳ニート", "強運", "脱出"],
  },
  {
    name: "お金 稼ぐ",
    role: "犯人",
    accent: "#c9a83a",
    fileNo: "02",
    img: "/images/char-02.png",
    stagePosition: "center 0%",
    desc: "フォルトゥナに主人公を引き込んだ犯人。パチンコ中毒に陥り、ホスト活動で稼いだ金をすべてスロットに注ぎ込み、破産した。5年間代わりの人間を探し続け、ついに主人公を見つけた。",
    tags: ["パチンコ中毒", "ホスト", "身代わり探し"],
  },
  {
    name: "ノア & ナオ",
    role: "双子",
    accent: "#b23a42",
    fileNo: "03",
    img: "/images/char-03.png",
    desc: "フォルトゥナに住む双子。妹のノアは寡黙で表情の変化に乏しく、兄のナオは活発で社交的な性格で口数が多い。対照的な二人だが、序盤はともに主人公に好意的だが、次第に本性を現し、主人公を敵視していく。",
    tags: ["双子", "序盤は味方", "本性顕現"],
  },
  {
    name: "LARK",
    role: "マスコット",
    accent: "#6b9c6e",
    fileNo: "04",
    img: "/images/char-04.png",
    stageFit: "contain",
    desc: "フォルトゥナのマスコット。すべての敵を倒すと、ラクの姿へと変わり、この世界に閉じ込められる。元の姿に戻る方法は、代わりの人間を見つけ、再びすべての敵を倒させることだけである。",
    tags: ["マスコット", "ラクの呪い", "入れ替わり"],
  },
];

export const IN_GAME_SHOTS = [
  { no: "01", caption: "戦闘モード", img: "/images/ingame-01.png" },
  { no: "02", caption: "アイテム選択", img: "/images/ingame-02.png" },
  { no: "03", caption: "チャット画面", img: "/images/ingame-04.png" },
  { no: "04", caption: "777カットイン", img: "/images/ingame-03.png" },
];
