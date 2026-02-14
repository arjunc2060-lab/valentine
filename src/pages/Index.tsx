import { useState, useEffect, useCallback, useRef } from "react";
import { sendResponse } from "@/lib/email";

import askGif from "@/assets/ask.gif";
import attemptsGif from "@/assets/attempts.gif";
import yesGif from "@/assets/yes.gif";
import noGif from "@/assets/no.gif";
import music from "@/assets/sarangi.mp3";   // 🎵 music import

type Phase = "question" | "celebration" | "rejection";

const NO_MESSAGES = [
  "Will you be my Valentine? ❤️",
  "Hmm… I think you misclicked 😌 Wanna try that again?",
  "Okay listen… I already imagined us sharing dessert and you stealing my fries 🍟",
  "Alright, last attempt… I really like you, and I’d love to spend this Valentine’s with you ❤️",
];

/* ---------- Floating Hearts ---------- */
const FloatingHearts = ({ sad }: { sad: boolean }) => {
  const hearts = Array.from({ length: 20 }, (_, i) => {
    const size = 14 + Math.random() * 24;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 6 + Math.random() * 1;
    const opacity = 0.3 + Math.random() * 0.5;

    return (
      <span
        key={i}
        className={sad ? "animate-float-heart-sad" : "animate-float-heart"}
        style={{
          position: "fixed",
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity,
          zIndex: 0,
          pointerEvents: "none",
          top: sad ? 0 : "auto",
          bottom: sad ? "auto" : 0,
        }}
      >
        {sad ? "💔" : "❤️"}
      </span>
    );
  });

  return <>{hearts}</>;
};


/* ---------- Floating Love Text ---------- */
const FloatingLoveTexts = () => {
  const [texts, setTexts] = useState<
    { id: number; left: number; bottom: number }[]
  >([]);

  const counter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      counter.current++;

      setTexts((prev) => [
        ...prev.slice(-8),
        {
          id: counter.current,
          left: 10 + Math.random() * 80,
          bottom: Math.random() * 40,
        },
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {texts.map((t) => (
        <span
          key={t.id}
          className="animate-float-text font-romantic fixed pointer-events-none z-10"
          style={{
            left: `${t.left}%`,
            bottom: `${t.bottom}%`,
            color: "hsl(340, 82%, 52%)",
            fontSize: "1.2rem",
          }}
        >
          I love you 💕
        </span>
      ))}
    </>
  );
};

/* ---------- Confetti ---------- */
const Confetti = () => {
  const items = Array.from({ length: 40 }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 3;
    const emojis = ["❤️", "💕", "💖", "💗", "✨", "🌹", "💘"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    return (
      <span
        key={i}
        className="animate-confetti"
        style={{
          position: "fixed",
          left: `${left}%`,
          top: "-40px",
          fontSize: `${16 + Math.random() * 20}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {emoji}
      </span>
    );
  });

  return <>{items}</>;
};

/* ---------- Main Page ---------- */
const Index = () => {
  const [phase, setPhase] = useState<Phase>("question");
  const [noCount, setNoCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const questionText =
    NO_MESSAGES[noCount] || NO_MESSAGES[NO_MESSAGES.length - 1];

  const questionGif =
    noCount === 0 ? askGif : noCount < 4 ? attemptsGif : noGif;

  /* ---------- YES CLICK ---------- */
  const handleYes = useCallback(() => {
    setPhase("celebration");

    // send email
    sendResponse("YES 💖");

    // 🎵 play background music
    if (!audioRef.current) {
      audioRef.current = new Audio(music);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((err) => {
      console.log("Audio blocked:", err);
    });
  }, []);

  /* ---------- NO CLICK ---------- */
  const handleNo = useCallback(() => {
    if (noCount < 3) {
      setNoCount((c) => c + 1);
    } else {
      setPhase("rejection");
      sendResponse("NO 💔");
    }
  }, [noCount]);

  /* ---------- STOP MUSIC IF LEAVING ---------- */
  const reset = () => {
    setPhase("question");
    setNoCount(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">

      <FloatingHearts sad={phase === "rejection"} />

      {phase === "celebration" && <>
      <Confetti />
      <FloatingLoveTexts />
      </>}

      {/* QUESTION */}
      {phase === "question" && (
        <div className="bg-white/90 rounded-3xl p-10 text-center shadow-xl max-w-md w-full mx-4">

          <img src={questionGif} className="rounded-lg mb-6" />

          <h1 className="text-2xl mb-8 font-semibold">
            {questionText}
          </h1>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleYes}
              className="px-8 py-3 bg-pink-500 text-white rounded-full hover:scale-110 transition"
            >
              YES 💖
            </button>

            <button
              onClick={handleNo}
              className="px-8 py-3 border-2 rounded-full hover:scale-95 transition"
            >
              NO 💔
            </button>
          </div>
        </div>
      )}

      {/* CELEBRATION */}
      {phase === "celebration" && (
        <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
          <img src={yesGif} className="rounded-lg mb-6 w-72 mx-auto" />

          <h1 className="text-3xl font-bold mb-4">
            You just made me the happiest guy today ❤️
          </h1>

          <p className="text-lg">
            Now I owe you a proper date… and maybe a flower too 🌹
          </p>
        </div>
      )}

      {/* REJECTION */}
      {phase === "rejection" && (
        <div className="bg-black/70 text-white rounded-3xl p-10 text-center shadow-xl">

          <img src={noGif} className="rounded-lg mb-6 w-72 mx-auto" />

          <h1 className="text-2xl mb-3">That’s okay…</h1>
          <p className="mb-2">I still feel lucky I met you.</p>
          <p className="mb-6">My Valentine wish was you 💔</p>

          <button
            onClick={reset}
            className="px-6 py-2 border rounded-full hover:bg-white hover:text-black transition"
          >
            Try again 🥺
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
