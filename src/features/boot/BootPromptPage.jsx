import { useEffect, useRef, useState } from "react";

const REQUIRED_COMMAND = "start my finance";
const LOVE_COMMAND = "mi amor";

const LOVE_LINES = [
  "Decrypting Secret.Message...",
  "Bypassing all firewalls to reach: her.smile",
  "Mounting memory drive: /us/our-moments",
  "Loading our Pictures and my favorite of you...",
  " - the way you laugh",
  " - the way you smile",
  " - the way you joke and tease me",
  " - the way you make everything feel lighter",
  " - the way you make me feel like a man and the luckiest guy alive",
  "Compiling some of the reasons why i love you.txt",
  "Reason #1: You are becoming my peace in every storm.",
  "Reason #2: You make ordinary days feel magical and fun.",
  "Reason #3: You believe in me and i even doubt myself.",
  "Reason #4: Your heart is the most beautiful place ever.",
  "Reason #5: Home is wherever you are laying somewhere nice...hehehe.",
  "Generating future_plans.exe...",
  " > more places nice together",
  " > more teasing jokes",
  " > more hand-holding, always",
  " > more food trip, walking, and exploring",
  " > more trying new things together",
  "Final output:",
  "I love you more than words, code, or stars can explain.",
  "Forever command locked: you + me",
  "Type 'start my finance' when you're ready, my love.",
];

export default function BootPromptPage({ onBootComplete }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "PF-OS v1.0.7",
    "Initializing secure finance kernel...",
    "Loading modules: ledger, budget, analytics...",
    "Awaiting command...",
  ]);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isStreamingLove, setIsStreamingLove] = useState(false);
  const [showRose, setShowRose] = useState(false);

  const inputRef = useRef(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollConsoleToBottom = () => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  };

  const randomBinaryLine = (length = 110) =>
    Array.from({ length }, () => (Math.random() > 0.5 ? "1" : "0")).join("");

  const runBinaryStorm = (durationMs = 3600) => {
    return new Promise((resolve) => {
      const start = Date.now();

      setHistory((prev) => [
        ...prev,
        "Command accepted.",
        "Launching authentication gateway...",
        "Entering secure stream...",
      ]);
      setTimeout(scrollConsoleToBottom, 0);

      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));

        setHistory((prev) => [
          ...prev,
          randomBinaryLine(110),
          `sync_state: ${pct}%`,
        ]);
        setTimeout(scrollConsoleToBottom, 0);

        if (elapsed >= durationMs) {
          clearInterval(timer);
          setHistory((prev) => [
            ...prev,
            "Binary stream complete.",
            "Handshake successful.",
            "Redirecting to login...",
          ]);
          setTimeout(scrollConsoleToBottom, 0);
          setTimeout(resolve, 700);
        }
      }, 120);
    });
  };

  const streamLines = (lines, onDone) => {
    setIsTyping(false);
    setIsStreamingLove(true);
    setShowRose(true);

    let i = 0;
    const timer = setInterval(() => {
      setHistory((prev) => [...prev, lines[i]]);
      i += 1;
      setTimeout(scrollConsoleToBottom, 0);

      if (i >= lines.length) {
        clearInterval(timer);
        setIsStreamingLove(false);
        setTimeout(() => setShowRose(false), 1200);
        setIsTyping(true);
        inputRef.current?.focus();
        onDone?.();
      }
    }, 700);
  };

  const submitCommand = async (e) => {
    e.preventDefault();
    const cmdRaw = input.trim();
    const cmd = cmdRaw.toLowerCase();

    if (!cmdRaw || isStreamingLove || !isTyping) return;

    setHistory((prev) => [...prev, `> ${cmdRaw}`]);
    setInput("");
    setError("");
    setTimeout(scrollConsoleToBottom, 0);

    if (cmd === REQUIRED_COMMAND) {
      setIsTyping(false);
      await runBinaryStorm(3600);
      onBootComplete();
      return;
    }

    if (cmd === LOVE_COMMAND) {
      streamLines(LOVE_LINES, () => {
        setHistory((prev) => [...prev, "Awaiting command..."]);
        setTimeout(scrollConsoleToBottom, 0);
      });
      return;
    }

    setError("Unknown command. Try: start my finance");
    setHistory((prev) => [...prev, "ERR: Unknown command."]);
    setTimeout(scrollConsoleToBottom, 0);
  };

  return (
    <div style={styles.screen}>
      <div style={styles.glow} />

      {showRose ? <div style={styles.fixedRose}>🌹</div> : null}

      <div style={styles.window}>
        <div style={styles.titlebar}>
          <span>finance@terminal</span>
          <span style={{ opacity: 0.7 }}>secure-session</span>
        </div>

        <div ref={consoleRef} style={styles.console}>
          {history.map((line, idx) => (
            <div key={idx} style={styles.line}>
              {line}
            </div>
          ))}

          {error ? <div style={styles.error}>{error}</div> : null}

          <form onSubmit={submitCommand} style={styles.inputRow}>
            <span style={styles.prompt}>&gt;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!isTyping}
              autoComplete="off"
              spellCheck={false}
              placeholder='type "start my finance"'
              style={styles.input}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 20%, rgba(0,255,170,0.08), transparent 35%), radial-gradient(circle at 80% 10%, rgba(0,153,255,0.08), transparent 30%), #05070d",
    color: "#7CFFB2",
    display: "grid",
    placeItems: "center",
    padding: 20,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(to bottom, rgba(124,255,178,0.04) 0px, rgba(124,255,178,0.04) 1px, transparent 2px, transparent 4px)",
    pointerEvents: "none",
  },
  fixedRose: {
    position: "fixed",
    right: 24,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 96,
    lineHeight: 1,
    filter: "drop-shadow(0 0 14px rgba(255, 77, 121, 0.55))",
    pointerEvents: "none",
    zIndex: 9999,
    userSelect: "none",
  },
  window: {
    width: "100%",
    maxWidth: 900,
    border: "1px solid rgba(124,255,178,0.25)",
    borderRadius: 12,
    background: "rgba(3, 10, 8, 0.82)",
    boxShadow: "0 0 40px rgba(0, 255, 170, 0.12)",
    overflow: "hidden",
    position: "relative",
    zIndex: 2,
  },
  titlebar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderBottom: "1px solid rgba(124,255,178,0.2)",
    background: "rgba(124,255,178,0.06)",
    fontSize: 13,
  },
  console: {
    padding: 16,
    minHeight: 420,
    maxHeight: "70vh",
    overflowY: "auto",
  },
  line: {
    marginBottom: 8,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  inputRow: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
    position: "sticky",
    bottom: 0,
    background: "rgba(3,10,8,0.92)",
    paddingTop: 8,
  },
  prompt: {
    color: "#7CFFB2",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#C8FFD8",
    font: "inherit",
    fontSize: 15,
  },
  error: {
    color: "#FF6B8A",
    marginTop: 4,
    marginBottom: 4,
  },
};