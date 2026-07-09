# 이미지 삽입 안내

이 폴더에 아래 파일명(확장자는 `.png`)으로 이미지를 넣으면 웹페이지에 자동으로 반영됩니다.
아직 넣지 않은 이미지는 자리표시자(placeholder)로 표시됩니다.

| 파일명 | 용도 | 권장 사이즈(가로×세로) |
|---|---|---|
| `hero-main.png` | 히어로 메인 비주얼(대표 일러스트) | 1920×1080 (16:9) |
| `char-01.png` | 캐릭터 1 — AMANO NANAMI | 세로가 넉넉한 전신/상반신 일러스트 |
| `char-02.png` | 캐릭터 2 — QUEEN OF HEARTS | 〃 |
| `char-03.png` | 캐릭터 3 — TWIN JESTERS | 〃 |
| `char-04.png` | 캐릭터 4 — GARAGORO | 〃 |
| `ingame-01.png` | 인게임 화면 1 | 1920×1080 (16:9) |
| `ingame-02.png` | 인게임 화면 2 | 1920×1080 (16:9) |
| `ingame-03.png` | 인게임 화면 3 | 1920×1080 (16:9) |

캐릭터 이미지는 기본적으로 화면을 꽉 채우도록 크롭(`cover`)되며, 이미지마다
구도가 달라 머리가 잘리는 경우 `src/data/larkData.js`의 해당 캐릭터 항목에
`stagePosition`(크롭 기준점), `stageFit`("contain"으로 바꾸면 크롭 없이 전체 표시),
`stageTransform`(확대/이동)을 개별로 조정할 수 있습니다.

파일명/경로를 바꾸고 싶다면 `src/data/larkData.js`의 `img` 값을 수정하세요.
