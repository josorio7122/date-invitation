import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sky } from "./Sky";
import { calendarUrl, clock, invite, longDate, mapsUrl, pickup, relativeDay, when } from "./invite";

const APART = { him: { x: 28, y: 42 }, her: { x: 70, y: 60 } };
const TOGETHER = { him: { x: 47.5, y: 50 }, her: { x: 52.5, y: 52 } };

const ease = [0.16, 1, 0.3, 1] as const;

export default function App() {
  const [yes, setYes] = useState(false);
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = yes ? "It's a date." : `${invite.her}, dinner ${relativeDay(when).toLowerCase()}?`;
  }, [yes]);

  useEffect(() => {
    if (yes) {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      const id = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), reduce ? 0 : 900);
      return () => window.clearTimeout(id);
    }
  }, [yes, reduce]);

  const enter = (delay: number) => (reduce ? { duration: 0 } : { delay, duration: 1.1, ease });
  const rise = {
    hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
    shown: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <>
      <Sky lit={yes} />
      <main className={`stage${yes ? " stage-yes" : ""}`}>
        <Pair joined={yes} reduce={!!reduce} />

        <div className="words">
          <AnimatePresence mode="wait" initial={false}>
            {yes ? (
              <Details key="details" reduce={!!reduce} headingRef={headingRef} />
            ) : (
              <motion.div
                key="ask"
                className="ask"
                exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.45 } }}
              >
                <motion.header className="lead" variants={rise} initial={reduce ? false : "hidden"} animate="shown" transition={enter(0.6)}>
                  <h1>{invite.her}</h1>
                  <Flourish />
                  <p>I would like to spend the evening with you.</p>
                </motion.header>
                <motion.div className="ask-row" variants={rise} initial={reduce ? false : "hidden"} animate="shown" transition={enter(1.4)}>
                  <p id="question" className="question">
                    Would you like to have dinner with me?
                  </p>
                  <button type="button" className="yes" aria-describedby="question" onClick={() => setYes(true)}>
                    Yes
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

function Flourish() {
  return (
    <svg className="flourish" viewBox="0 0 240 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M4 12 C 40 2, 70 22, 104 12 C 110 11, 114 11, 118 12" />
      <path d="M236 12 C 200 2, 170 22, 136 12 C 130 11, 126 11, 122 12" />
      <path d="M120 6.5 L121.2 10.8 L125.5 12 L121.2 13.2 L120 17.5 L118.8 13.2 L114.5 12 L118.8 10.8 Z" fill="currentColor" stroke="none" />
      <circle cx="56" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="184" cy="12.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Pair({ joined, reduce }: { joined: boolean; reduce: boolean }) {
  const pos = joined ? TOGETHER : APART;
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 22, damping: 11, mass: 1.6 };
  const fade = (delay: number) => (reduce ? { duration: 0 } : { delay, duration: 1.4, ease });

  return (
    <div className={`pair${joined ? " pair-joined" : ""}`} aria-hidden="true">
      <svg className="pair-line">
        <motion.line
          initial={
            reduce
              ? false
              : { opacity: 0, x1: `${APART.him.x}%`, y1: `${APART.him.y}%`, x2: `${APART.her.x}%`, y2: `${APART.her.y}%` }
          }
          animate={{
            x1: `${pos.him.x}%`,
            y1: `${pos.him.y}%`,
            x2: `${pos.her.x}%`,
            y2: `${pos.her.y}%`,
            opacity: joined ? 0 : 1,
          }}
          transition={joined ? { ...spring, opacity: { duration: 0.5 } } : { ...spring, opacity: fade(2.2) }}
          stroke="rgba(238,244,255,0.75)"
          strokeWidth="1"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
      </svg>


      <NamedStar name={invite.him} pos={pos.him} side="above" spring={spring} entrance={fade(1.0)} reduce={reduce} />
      <NamedStar name={invite.her} pos={pos.her} side="below" spring={spring} entrance={fade(1.4)} reduce={reduce} />
    </div>
  );
}

function NamedStar({
  name,
  pos,
  side,
  spring,
  entrance,
  reduce,
}: {
  name: string;
  pos: { x: number; y: number };
  side: "above" | "below";
  spring: object;
  entrance: object;
  reduce: boolean;
}) {
  return (
    <motion.div
      className={`star star-${side}`}
      initial={reduce ? false : { opacity: 0, scale: 0.6, left: `${pos.x}%`, top: `${pos.y}%` }}
      animate={{ opacity: 1, scale: 1, left: `${pos.x}%`, top: `${pos.y}%` }}
      transition={{ ...spring, opacity: entrance, scale: entrance }}
    >
      <span className="star-core" />
      <span className="star-name">{name}</span>
    </motion.div>
  );
}

function Details({ reduce, headingRef }: { reduce: boolean; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const item = {
    hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
    shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
  };
  return (
    <motion.section
      className="details"
      initial={reduce ? false : "hidden"}
      animate="shown"
      transition={{ staggerChildren: reduce ? 0 : 0.14, delayChildren: reduce ? 0 : 0.7 }}
    >
      <motion.h2 variants={item} ref={headingRef} tabIndex={-1}>
        It's a date.
      </motion.h2>
      <motion.dl className="plate" variants={item}>
        <div>
          <dt>When</dt>
          <dd>
            {longDate}
            <small>{clock(when)}</small>
          </dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>
            {invite.restaurant}
            {invite.address && <small>{invite.address}</small>}
          </dd>
        </div>
        <div>
          <dt>Leaving</dt>
          <dd>{clock(pickup)}, from home.</dd>
        </div>
        <div>
          <dt>Wear</dt>
          <dd>{invite.wear}</dd>
        </div>
      </motion.dl>
      <motion.p className="note" variants={item}>
        {invite.note}
        <strong>{invite.him}</strong>
      </motion.p>
      <motion.nav className="links" variants={item} aria-label="Save the plan">
        <a href={calendarUrl} target="_blank" rel="noreferrer">
          Add to calendar
        </a>
        <a href={mapsUrl} target="_blank" rel="noreferrer">
          Open in maps
        </a>
      </motion.nav>
    </motion.section>
  );
}
