import styles from './Hero.module.css';

/* ─────────────────────────────────────────────────────────────
   Wobbly double-stroke underline
   Two passes at slightly different offsets → "drawn twice" look
   ───────────────────────────────────────────────────────────── */
function ScribblyUnderline({ color = '#ffe600' }: { color?: string }) {
  return (
    <svg
      className={styles.underlineSvg}
      viewBox="0 0 340 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* first pass — main stroke, irregular waviness */}
      <path
        d="M3 14 C18 7, 45 18, 72 11 C99 4, 118 17, 148 12
           C178 7, 195 16, 225 9 C250 3, 272 15, 298 10
           C315 6, 330 13, 338 11"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* second pass — slightly offset and shorter, like a quick re-trace */}
      <path
        d="M7 17 C30 11, 58 20, 90 14 C122 8, 145 19, 172 15
           C200 11, 222 18, 255 13 C278 9, 308 17, 332 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Wobbly scroll-down arrow — loose marker stroke, not geometric
   ───────────────────────────────────────────────────────────── */
function ScribblyArrow() {
  return (
    <svg
      className={styles.arrowSvg}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* shaft — slightly wavy, not straight */}
      <path
        d="M26 4 C25 12, 27 22, 25 32 C24 36, 26 40, 26 44"
        stroke="var(--ink-soft)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* arrowhead — two strokes, uneven */}
      <path
        d="M14 36 C18 40, 24 46, 26 44 C28 46, 33 40, 38 36"
        stroke="var(--ink-soft)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* second faint re-trace of shaft */}
      <path
        d="M27 6 C26 14, 28 24, 27 34"
        stroke="var(--ink-soft)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Wobbly hand-drawn circle — irregular loop, not perfect oval
   Two strokes: one complete loop + a small overrun/re-entry
   ───────────────────────────────────────────────────────────── */
function ScribblyCircle({ color = '#ff2d78' }: { color?: string }) {
  return (
    <svg
      className={styles.wobbleCircle}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* main irregular loop */}
      <path
        d="M60 10 C88 8, 112 25, 114 52 C116 78, 98 106, 70 111
           C42 116, 10 100, 7 72 C4 44, 20 12, 60 10 Z"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* overrun — pen comes back a little, gives hand-drawn feel */}
      <path
        d="M60 10 C50 9, 38 11, 28 17"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <text
        x="60" y="56"
        textAnchor="middle"
        fontFamily="'Nunito', sans-serif"
        fontWeight="900"
        fontSize="12"
        fill={color}
      >
        it&apos;s
      </text>
      <text
        x="60" y="72"
        textAnchor="middle"
        fontFamily="'Nunito', sans-serif"
        fontWeight="900"
        fontSize="12"
        fill={color}
      >
        FREE!
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Scribbled star — six quick strokes, slightly uneven
   ───────────────────────────────────────────────────────────── */
function ScribbleStar({ color = '#ffe600' }: { color?: string }) {
  return (
    <svg
      className={styles.scribbleStar}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 6 rough strokes radiating from centre, not perfectly even */}
      <path d="M25 5  L27 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M25 45 L23 28" stroke={color} strokeWidth="2"   strokeLinecap="round" />
      <path d="M5 25  L22 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M45 25 L28 26" stroke={color} strokeWidth="2"   strokeLinecap="round" />
      <path d="M10 10 L22 22" stroke={color} strokeWidth="2"   strokeLinecap="round" />
      <path d="M40 40 L28 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 10 L28 22" stroke={color} strokeWidth="2"   strokeLinecap="round" />
      <path d="M10 40 L22 28" stroke={color} strokeWidth="2"   strokeLinecap="round" />
      {/* tiny centre dot */}
      <circle cx="25" cy="25" r="2.5" fill={color} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Lightning bolt — irregular outline, slightly hand-cut
   ───────────────────────────────────────────────────────────── */
function LightningBolt() {
  return (
    <svg
      className={styles.bolt}
      viewBox="0 0 44 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* fill — electric yellow */}
      <path
        d="M30 3 L8 40 L21 39 L13 73 L38 30 L23 31 Z"
        fill="var(--electric)"
      />
      {/* outline stroke — two passes, slightly offset for sketch feel */}
      <path
        d="M30 3 L8 40 L21 39 L13 73 L38 30 L23 31 Z"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* inner highlight — single quick stroke */}
      <path
        d="M27 8 L12 38 L22 37"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">

      {/* ── Marquee ticker tape ───────────────────────────── */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerInner}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={styles.tickerItem}>
              BEAT BOREDOM &nbsp;★&nbsp; SOMETHING RANDOM &nbsp;★&nbsp; DO IT NOW &nbsp;★&nbsp; NO EXCUSES &nbsp;★&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────── */}
      <div className={styles.layout}>

        {/* Left column */}
        <div className={styles.leftCol}>

          <div className={styles.eyebrowStamp} aria-hidden="true">
            ✦ BOREDOM DESTROYER™ ✦
          </div>

          <h1 id="hero-heading" className={styles.heading}>
            BORED?
            <br />
            <span className={styles.headingLine2}>
              LET'S FIX
              <br />
              <span className={styles.headingAccent}>
                THAT.
                <ScribblyUnderline color="#ffe600" />
              </span>
            </span>
          </h1>

          <p className={styles.subheading}>
            Randomly picks spontaneous, delightful activities to drag you out of
            your rut — cloud-watching, midnight snack science, dance parties —
            <strong> zero planning required.</strong>
          </p>

          {/* Stats */}
          <div className={styles.statsRow} aria-label="App highlights">
            <span className={styles.statChip} style={{ background: 'var(--hotpink)', color: '#fff' }}>
              100+ activities
            </span>
            <span className={styles.statChip} style={{ background: 'var(--cobalt)', color: '#fff' }}>
              7 categories
            </span>
            <span className={styles.statChip} style={{ background: 'var(--lime)', color: 'var(--ink)' }}>
              0 excuses needed
            </span>
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <ScribblyArrow />
            <span className={styles.scrollText}>scroll to discover</span>
          </div>
        </div>

        {/* Right sticker cluster */}
        <div className={styles.rightCol} aria-hidden="true">

          {/* Big die sticker */}
          <div className={styles.bigSticker}>
            <span className={styles.bigDie}>🎲</span>
            <span className={styles.bigStickerText}>TAP TO<br />DISCOVER</span>
          </div>

          {/* Post-it A */}
          <div className={styles.postItA}>
            today is the<br />
            <em>perfect</em> day for<br />
            something<br />
            <strong>RANDOM!</strong>
          </div>

          {/* Post-it B */}
          <div className={styles.postItB}>
            100%<br />
            <strong>boredom-free</strong><br />
            guaranteed*
          </div>

          {/* Scribbled star decoration */}
          <ScribbleStar color="#ffe600" />

          {/* Wobbly bolt */}
          <LightningBolt />

          {/* Irregular circle annotation */}
          <ScribblyCircle color="#ff2d78" />

        </div>
      </div>
    </section>
  );
}
