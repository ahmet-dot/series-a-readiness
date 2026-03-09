import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: 1, category: "Revenue Quality", weight: 8,
    question: "What is your current ARR?",
    options: ["Under $500K", "$500K – $1M", "$1M – $2M", "$2M – $3M", "Over $3M"],
    scores: [1, 3, 6, 8, 10]
  },
  {
    id: 2, category: "Revenue Quality", weight: 9,
    question: "What is your Net Revenue Retention (NRR)?",
    options: ["Don't track it", "Below 90%", "90% – 100%", "100% – 110%", "Above 110%"],
    scores: [0, 3, 5, 8, 10]
  },
  {
    id: 3, category: "Revenue Quality", weight: 7,
    question: "How predictable is your MRR month-over-month?",
    options: ["Very unpredictable", "Somewhat variable", "Mostly predictable", "Highly predictable with contracts"],
    scores: [1, 4, 7, 10]
  },
  {
    id: 4, category: "Unit Economics", weight: 9,
    question: "Do you know your CAC Payback Period?",
    options: ["No idea", "Over 24 months", "12–24 months", "6–12 months", "Under 6 months"],
    scores: [0, 2, 5, 8, 10]
  },
  {
    id: 5, category: "Unit Economics", weight: 8,
    question: "What is your Gross Margin?",
    options: ["Don't know", "Below 50%", "50–65%", "65–75%", "Above 75%"],
    scores: [0, 2, 5, 8, 10]
  },
  {
    id: 6, category: "Unit Economics", weight: 7,
    question: "What is your Burn Multiple? (Net Burn / Net New ARR)",
    options: ["Don't track", "Above 2x", "1.5x – 2x", "1x – 1.5x", "Below 1x"],
    scores: [0, 2, 4, 7, 10]
  },
  {
    id: 7, category: "Financial Infrastructure", weight: 8,
    question: "How is your financial reporting done today?",
    options: ["Founder manages in Excel", "Bookkeeper only", "Part-time controller", "Full financial stack (GAAP + dashboards)", "Fractional/Full CFO in place"],
    scores: [1, 3, 5, 8, 10]
  },
  {
    id: 8, category: "Financial Infrastructure", weight: 7,
    question: "How quickly can you produce a board-ready financial package?",
    options: ["Never done it", "2+ weeks", "1–2 weeks", "3–5 days", "Under 3 days"],
    scores: [0, 2, 4, 7, 10]
  },
  {
    id: 9, category: "Financial Infrastructure", weight: 6,
    question: "Do you have a 18-month driver-based financial model?",
    options: ["No model", "Basic spreadsheet", "Partial model", "Full model, rarely updated", "Dynamic model, updated monthly"],
    scores: [0, 2, 4, 7, 10]
  },
  {
    id: 10, category: "Runway & Cash", weight: 9,
    question: "How many months of runway do you currently have?",
    options: ["Under 6 months", "6–9 months", "9–12 months", "12–18 months", "18+ months"],
    scores: [0, 2, 5, 8, 10]
  },
  {
    id: 11, category: "Runway & Cash", weight: 7,
    question: "How confident are you in your 12-month cash forecast accuracy?",
    options: ["Not confident at all", "Rough estimates only", "Somewhat confident", "Very confident", "Confident with scenario planning"],
    scores: [0, 2, 5, 8, 10]
  },
  {
    id: 12, category: "Growth", weight: 8,
    question: "What is your MoM ARR growth rate over last 3 months?",
    options: ["Flat or declining", "1–3%", "3–5%", "5–10%", "Above 10%"],
    scores: [0, 2, 5, 8, 10]
  },
  {
    id: 13, category: "Growth", weight: 7,
    question: "How repeatable is your sales motion?",
    options: ["All founder-led, no process", "Some documentation", "Defined playbook", "Repeatable with AEs", "Predictable pipeline + quota attainment"],
    scores: [1, 3, 5, 8, 10]
  },
  {
    id: 14, category: "Investor Readiness", weight: 8,
    question: "How complete is your data room?",
    options: ["No data room", "Basic docs only", "Partial (missing financials or cap table)", "Mostly complete", "Fully ready to share"],
    scores: [0, 2, 4, 7, 10]
  },
  {
    id: 15, category: "Investor Readiness", weight: 7,
    question: "Does your cap table have issues? (SAFEs, convertible notes, complexity)",
    options: ["Major issues / never modeled dilution", "Some complexity, not modeled", "Complex but understood", "Clean and modeled", "Clean, modeled, and attorney reviewed"],
    scores: [0, 3, 5, 7, 10]
  },
  {
    id: 16, category: "Investor Readiness", weight: 6,
    question: "Have you defined your Series A milestone narrative?",
    options: ["No clear story", "Rough idea", "Defined internally", "Validated with advisors", "Tested with investors"],
    scores: [0, 2, 5, 7, 10]
  },
  {
    id: 17, category: "Product-Market Fit", weight: 8,
    question: "What is your logo churn rate (annual)?",
    options: ["Don't track", "Above 20%", "15–20%", "5–15%", "Below 5%"],
    scores: [0, 2, 4, 7, 10]
  },
  {
    id: 18, category: "Product-Market Fit", weight: 7,
    question: "How strong are your customer references / NPS?",
    options: ["No data", "Mixed reviews", "Positive but limited", "Strong references available", "Champions who will talk to investors"],
    scores: [0, 2, 5, 7, 10]
  },
  {
    id: 19, category: "Team", weight: 7,
    question: "How complete is your leadership team for Series A?",
    options: ["Founder only", "2 founders", "Founders + 1-2 key hires", "Most C-suite filled", "Full team with relevant experience"],
    scores: [1, 3, 5, 8, 10]
  },
  {
    id: 20, category: "Team", weight: 6,
    question: "How prepared are you personally to run a 6–9 month fundraise?",
    options: ["Not at all", "Somewhat — still running everything", "Have delegated some operations", "Mostly ready", "Fully ready, have a plan"],
    scores: [0, 2, 4, 7, 10]
  }
];

const CATEGORIES = ["Revenue Quality", "Unit Economics", "Financial Infrastructure", "Runway & Cash", "Growth", "Investor Readiness", "Product-Market Fit", "Team"];

const CATEGORY_COLORS = {
  "Revenue Quality": "#00C6A0",
  "Unit Economics": "#3B82F6",
  "Financial Infrastructure": "#8B5CF6",
  "Runway & Cash": "#F59E0B",
  "Growth": "#10B981",
  "Investor Readiness": "#EF4444",
  "Product-Market Fit": "#EC4899",
  "Team": "#6366F1"
};

function ScoreGauge({ score }) {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#00C6A0" : score >= 50 ? "#F59E0B" : "#EF4444";
  const label = score >= 75 ? "STRONG" : score >= 50 ? "DEVELOPING" : "EARLY STAGE";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <svg height={radius * 2} width={radius * 2} style={{ transform: "rotate(-90deg)" }}>
        <circle stroke="#1E293B" fill="transparent" strokeWidth={strokeWidth} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={color} fill="transparent" strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius} cx={radius} cy={radius}
          style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
        />
      </svg>
      <div style={{ marginTop: "-" + (radius * 2 + 16) + "px", height: radius * 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "36px", fontWeight: "900", color, fontFamily: "'Space Mono', monospace" }}>{score}</div>
        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#64748B" }}>{label}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("intro"); // intro | quiz | email | results
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const resultsRef = useRef(null);

  const q = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  function calcScore() {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    QUESTIONS.forEach(q => {
      const answerIdx = answers[q.id];
      if (answerIdx !== undefined) {
        totalWeightedScore += (q.scores[answerIdx] / 10) * q.weight;
        totalWeight += q.weight;
      }
    });
    return Math.round((totalWeightedScore / totalWeight) * 100);
  }

  function calcCategoryScores() {
    const cats = {};
    CATEGORIES.forEach(cat => {
      const qs = QUESTIONS.filter(q => q.category === cat);
      let ws = 0, wt = 0;
      qs.forEach(q => {
        const a = answers[q.id];
        if (a !== undefined) { ws += (q.scores[a] / 10) * q.weight; wt += q.weight; }
      });
      cats[cat] = wt > 0 ? Math.round((ws / wt) * 100) : 0;
    });
    return cats;
  }

  function handleSelect(idx) {
    setSelected(idx);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    setAnimating(true);
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent(current + 1);
      } else {
        setStep("email");
      }
      setAnimating(false);
    }, 250);
  }

  async function handleSubmitEmail() {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    const score = calcScore();
    const catScores = calcCategoryScores();

    const weakCategories = Object.entries(catScores).sort((a, b) => a[1] - b[1]).slice(0, 3);
    const summaryLines = QUESTIONS.map(q => {
      const a = answers[q.id];
      return `${q.category} — ${q.question}: ${a !== undefined ? q.options[a] : "N/A"}`;
    }).join("\n");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Ahmet, a fractional CFO at Unicorn CFO (unicorncfo.com) with 15+ years of international finance experience. You help VC-backed SaaS startups prepare for Series A. Be direct, specific, and actionable. No fluff. Write like a trusted advisor, not a consultant. Use plain English. No markdown headers.`,
          messages: [{
            role: "user",
            content: `A SaaS founder just completed the Series A Readiness Assessment. Their overall score is ${score}/100. Here are their answers:\n\n${summaryLines}\n\nTheir weakest categories are: ${weakCategories.map(([c, s]) => `${c} (${s}/100)`).join(", ")}.\n\nProvide exactly 3 specific, prioritized action items they must address before Series A. Each action should be 2-3 sentences. Be brutally honest. Format as JSON array: [{"priority": 1, "category": "...", "title": "...", "action": "..."}]. Return ONLY the JSON array, nothing else.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "[]";
      let actions = [];
      try { actions = JSON.parse(text.replace(/```json|```/g, "").trim()); } catch (e) { actions = []; }
      setResults({ score, catScores, actions, email });
      setStep("results");
    } catch (e) {
      setResults({ score, catScores, actions: [], email });
      setStep("results");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (step === "results" && results) {
      let start = 0;
      const end = results.score;
      const duration = 1500;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) { setDisplayScore(end); clearInterval(timer); }
        else setDisplayScore(Math.floor(start));
      }, 16);
      return () => clearInterval(timer);
    }
  }, [step, results]);

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#0A0F1E",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      color: "#F1F5F9",
      position: "relative",
      overflow: "hidden"
    },
    bg: {
      position: "fixed", inset: 0, zIndex: 0,
      background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,198,160,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59,130,246,0.08) 0%, transparent 50%)"
    },
    container: {
      position: "relative", zIndex: 1,
      maxWidth: "680px", margin: "0 auto",
      padding: "40px 24px",
      minHeight: "100vh",
      display: "flex", flexDirection: "column"
    },
    logo: {
      fontSize: "13px", fontWeight: "700", letterSpacing: "3px",
      color: "#00C6A0", marginBottom: "48px", textTransform: "uppercase"
    },
    card: {
      background: "rgba(15,23,42,0.8)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "20px",
      padding: "40px",
      backdropFilter: "blur(20px)",
      flex: 1
    }
  };

  if (step === "intro") return (
    <div style={styles.app}>
      <div style={styles.bg} />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={styles.container}>
        <div style={styles.logo}>Unicorn CFO</div>
        <div style={styles.card}>
          <div style={{ display: "inline-block", background: "rgba(0,198,160,0.1)", border: "1px solid rgba(0,198,160,0.3)", borderRadius: "100px", padding: "6px 16px", fontSize: "12px", color: "#00C6A0", fontWeight: "600", letterSpacing: "1px", marginBottom: "28px" }}>
            FREE ASSESSMENT · 5 MINUTES
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: "800", lineHeight: 1.15, marginBottom: "20px", letterSpacing: "-1px" }}>
            Are You <span style={{ color: "#00C6A0" }}>Series A Ready?</span>
          </h1>
          <p style={{ fontSize: "17px", color: "#94A3B8", lineHeight: 1.7, marginBottom: "36px" }}>
            20 questions. Instant score. Prioritized action plan.<br />
            Built by a fractional CFO who has seen hundreds of founders walk into investor meetings unprepared.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "36px" }}>
            {[["Revenue Quality", "Unit Economics"], ["Financial Infrastructure", "Investor Readiness"], ["Runway & Cash", "Product-Market Fit"]].flat().map(cat => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: CATEGORY_COLORS[cat], flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "#CBD5E1", fontWeight: "500" }}>{cat}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep("quiz")} style={{ width: "100%", padding: "18px", background: "#00C6A0", color: "#0A0F1E", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px", transition: "transform 0.15s, opacity 0.15s" }}
            onMouseOver={e => e.target.style.opacity = "0.9"}
            onMouseOut={e => e.target.style.opacity = "1"}>
            Start Assessment →
          </button>
          <p style={{ fontSize: "13px", color: "#475569", textAlign: "center", marginTop: "16px" }}>No signup required. Results in under 5 minutes.</p>
        </div>
      </div>
    </div>
  );

  if (step === "quiz") return (
    <div style={styles.app}>
      <div style={styles.bg} />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={styles.container}>
        <div style={styles.logo}>Unicorn CFO</div>

        {/* Progress */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#64748B" }}>Question {current + 1} of {QUESTIONS.length}</span>
            <span style={{ fontSize: "13px", color: "#00C6A0", fontWeight: "600" }}>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00C6A0,#3B82F6)", borderRadius: "100px", transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={{ ...styles.card, opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.25s, transform 0.25s" }}>
          <div style={{ display: "inline-block", background: `rgba(${CATEGORY_COLORS[q.category].replace('#','').match(/../g).map(h=>parseInt(h,16)).join(',')},0.15)`, borderRadius: "100px", padding: "5px 14px", fontSize: "12px", fontWeight: "600", color: CATEGORY_COLORS[q.category], letterSpacing: "1px", marginBottom: "20px" }}>
            {q.category.toUpperCase()}
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", lineHeight: 1.4, marginBottom: "28px", letterSpacing: "-0.3px" }}>{q.question}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {q.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleSelect(idx)}
                style={{
                  padding: "15px 20px", textAlign: "left", background: selected === idx ? "rgba(0,198,160,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected === idx ? "#00C6A0" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "12px", color: selected === idx ? "#F1F5F9" : "#94A3B8",
                  fontSize: "15px", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: "12px"
                }}
                onMouseOver={e => { if (selected !== idx) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#F1F5F9"; } }}
                onMouseOut={e => { if (selected !== idx) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#94A3B8"; } }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${selected === idx ? "#00C6A0" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {selected === idx && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00C6A0" }} />}
                </div>
                {opt}
              </button>
            ))}
          </div>

          <button onClick={handleNext} disabled={selected === null}
            style={{
              marginTop: "24px", width: "100%", padding: "16px",
              background: selected !== null ? "#00C6A0" : "rgba(255,255,255,0.05)",
              color: selected !== null ? "#0A0F1E" : "#475569",
              border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700",
              cursor: selected !== null ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "inherit"
            }}>
            {current < QUESTIONS.length - 1 ? "Next Question →" : "See My Score →"}
          </button>
        </div>
      </div>
    </div>
  );

  if (step === "email") return (
    <div style={styles.app}>
      <div style={styles.bg} />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={styles.container}>
        <div style={styles.logo}>Unicorn CFO</div>
        <div style={styles.card}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.5px" }}>You're done.</h2>
          <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: 1.7, marginBottom: "32px" }}>
            Your personalized Series A readiness score and prioritized action plan is ready. Enter your email to unlock it — no spam, no sequences, just your results.
          </p>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="email" placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmitEmail()}
              style={{
                width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
                color: "#F1F5F9", fontSize: "16px", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "#00C6A0"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <button onClick={handleSubmitEmail} disabled={loading || !email.includes("@")}
            style={{
              width: "100%", padding: "17px", background: loading ? "rgba(0,198,160,0.5)" : "#00C6A0",
              color: "#0A0F1E", border: "none", borderRadius: "12px", fontSize: "16px",
              fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}>
            {loading ? (
              <><span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0A0F1E", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Analyzing your responses...</>
            ) : "Unlock My Results →"}
          </button>
          <p style={{ fontSize: "12px", color: "#334155", textAlign: "center", marginTop: "14px" }}>
            Your data is private. We will not spam you.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (step === "results" && results) {
    const { score, catScores, actions } = results;
    const scoreColor = score >= 75 ? "#00C6A0" : score >= 50 ? "#F59E0B" : "#EF4444";
    const scoreLabel = score >= 75 ? "You're in strong shape. A few refinements will get you investor-ready." : score >= 50 ? "Solid foundation, but critical gaps need to be closed before you raise." : "Significant work ahead — but the good news is, these gaps are fixable.";

    return (
      <div style={styles.app} ref={resultsRef}>
        <div style={styles.bg} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } } .fade-up { animation: fadeUp 0.5s ease forwards; }`}</style>
        <div style={{ ...styles.container, maxWidth: "720px" }}>
          <div style={styles.logo}>Unicorn CFO</div>

          {/* Score Hero */}
          <div className="fade-up" style={{ ...styles.card, textAlign: "center", marginBottom: "20px", animationDelay: "0s" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "2px", color: "#64748B", marginBottom: "24px" }}>YOUR SERIES A READINESS SCORE</p>
            <ScoreGauge score={displayScore} />
            <p style={{ fontSize: "16px", color: "#CBD5E1", lineHeight: 1.7, marginTop: "20px", maxWidth: "480px", margin: "20px auto 0" }}>{scoreLabel}</p>
          </div>

          {/* Category Breakdown */}
          <div className="fade-up" style={{ ...styles.card, marginBottom: "20px", animationDelay: "0.15s" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "1px", color: "#64748B", marginBottom: "20px" }}>BREAKDOWN BY CATEGORY</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {Object.entries(catScores).sort((a, b) => a[1] - b[1]).map(([cat, s]) => (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px", color: "#CBD5E1", fontWeight: "500" }}>{cat}</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: s >= 70 ? "#00C6A0" : s >= 45 ? "#F59E0B" : "#EF4444", fontFamily: "'Space Mono', monospace" }}>{s}</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s}%`, background: s >= 70 ? "#00C6A0" : s >= 45 ? "#F59E0B" : "#EF4444", borderRadius: "100px", transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          {actions.length > 0 && (
            <div className="fade-up" style={{ ...styles.card, marginBottom: "20px", animationDelay: "0.3s" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "1px", color: "#64748B", marginBottom: "20px" }}>YOUR 3 PRIORITY ACTIONS</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {actions.map((a, i) => (
                  <div key={i} style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", borderLeft: `3px solid ${i === 0 ? "#EF4444" : i === 1 ? "#F59E0B" : "#3B82F6"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: i === 0 ? "rgba(239,68,68,0.2)" : i === 1 ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: i === 0 ? "#EF4444" : i === 1 ? "#F59E0B" : "#3B82F6", fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#64748B", letterSpacing: "1px", fontWeight: "600" }}>{a.category?.toUpperCase()}</div>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#F1F5F9" }}>{a.title}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>{a.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="fade-up" style={{ ...styles.card, animationDelay: "0.45s", background: "rgba(0,198,160,0.06)", border: "1px solid rgba(0,198,160,0.2)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "10px" }}>Want to close these gaps before your raise?</h3>
            <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.7, marginBottom: "24px" }}>
              I work with seed-to-Series A SaaS founders to build the financial infrastructure investors expect. Most of my clients improve their readiness score by 20–35 points in 90 days.
            </p>
            <a href="https://calendly.com/ahmet-unicorncfo/30min" target="_blank" rel="noopener noreferrer"
              style={{ display: "block", width: "100%", padding: "17px", background: "#00C6A0", color: "#0A0F1E", borderRadius: "12px", fontSize: "16px", fontWeight: "700", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>
              Book a Free 30-Min Strategy Call →
            </a>
            <p style={{ fontSize: "12px", color: "#475569", textAlign: "center", marginTop: "12px" }}>No commitment. Just a honest look at where you stand.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
