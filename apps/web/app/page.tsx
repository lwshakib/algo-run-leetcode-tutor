"use client"

import { useEffect, useRef, useState } from "react"
import { Logo } from "@workspace/ui/components/logo"
import { Icon } from "@iconify/react"
import { DOWNLOAD_URL } from "../lib/constants"
import "./landing.css"

export default function LandingPage() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const [activeSection, setActiveSection] = useState(0)
  const [installMethod, setInstallMethod] = useState<"unpacked" | "dragdrop">(
    "unpacked"
  )

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[]

    // Active dot on scroll
    const dotObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement)
            if (idx !== -1) setActiveSection(idx)
          }
        })
      },
      { root: scroller, threshold: 0.5 }
    )

    sections.forEach((s) => dotObserver.observe(s))

    // Reveal animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el) => {
              el.classList.add("visible")
            })
          }
        })
      },
      { root: scroller, threshold: 0.2 }
    )

    sections.forEach((s) => revealObserver.observe(s))

    // Trigger hero on load
    sections[0]?.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("visible")
    })

    return () => {
      dotObserver.disconnect()
      revealObserver.disconnect()
    }
  }, [])

  const scrollToSection = (i: number) => {
    sectionsRef.current[i]?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="landing-body">
      {/* Header */}
      <header id="header" className={activeSection === 1 ? "inverted" : ""}>
        <div id="wordmark">
          <Logo size={24} color={activeSection === 1 ? "#f7f9f7" : "#7fb492"} />
          Algorun
        </div>
        <a
          href="https://github.com/lwshakib/algo-run-leetcode-tutor"
          target="_blank"
          rel="noopener noreferrer"
          id="github-link"
          title="View on GitHub"
        >
          <Icon icon="simple-icons:github" width="22" height="22" />
        </a>
      </header>

      {/* Dot Navigation */}
      <nav id="dot-nav" aria-label="Page navigation">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`dot ${activeSection === i ? "active" : ""}`}
            onClick={() => scrollToSection(i)}
            title={
              ["Hero", "Problem", "Features", "How it works", "Download"][i]
            }
          />
        ))}
      </nav>

      <div id="scroller" ref={scrollerRef}>
        {/* ── SCREEN 1: HERO ── */}
        <section
          id="hero"
          ref={(el) => {
            sectionsRef.current[0] = el
          }}
        >
          <div className="hero-deco deco-1" />
          <div className="hero-deco deco-2" />
          <div className="hero-inner">
            <div className="hero-badge reveal">Chrome Extension · Free</div>
            <h1 className="hero-title reveal reveal-delay-1">
              Your <em>AI tutor</em>
              <br />
              for LeetCode.
            </h1>
            <p className="hero-sub reveal reveal-delay-2">
              The context-aware AI overlay that reads your code and problem
              statement in real-time. Learn the <em>why</em>, not just the
              solution.
            </p>
            <div className="hero-actions reveal reveal-delay-3">
              <a href={DOWNLOAD_URL} className="btn-primary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download for Chrome
              </a>
              <button className="btn-ghost" onClick={() => scrollToSection(2)}>
                How it works
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ── SCREEN 2: THE PROBLEM ── */}
        <section
          id="problem"
          ref={(el) => {
            sectionsRef.current[1] = el
          }}
        >
          <div className="problem-inner">
            <div className="problem-left">
              <h2 className="reveal">
                LeetCode is hard.
                <br />
                <em>Staring harder</em>
                <br />
                doesn&apos;t help.
              </h2>
              <ul className="pain-list">
                <li className="reveal reveal-delay-1">
                  You copy solutions but don&apos;t retain the logic behind them
                </li>
                <li className="reveal reveal-delay-2">
                  Editorials skip the intuition and jump straight to the answer
                </li>
                <li className="reveal reveal-delay-3">
                  You&apos;re stuck on a edge case with no one to point the way
                </li>
              </ul>
            </div>
            <div className="problem-right reveal reveal-delay-2">
              <svg
                width="260"
                height="260"
                viewBox="0 0 260 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="30"
                  y="60"
                  width="200"
                  height="130"
                  rx="10"
                  fill="#2a302a"
                  stroke="#7fb492"
                  strokeWidth="1.5"
                />
                <rect
                  x="42"
                  y="72"
                  width="176"
                  height="106"
                  rx="5"
                  fill="#1a1e1a"
                />
                <rect
                  x="54"
                  y="84"
                  width="80"
                  height="6"
                  rx="3"
                  fill="#7fb492"
                  opacity="0.5"
                />
                <rect
                  x="54"
                  y="98"
                  width="120"
                  height="6"
                  rx="3"
                  fill="#d4eadb"
                  opacity="0.3"
                />
                <rect
                  x="66"
                  y="112"
                  width="60"
                  height="6"
                  rx="3"
                  fill="#d4eadb"
                  opacity="0.3"
                />
                <rect
                  x="66"
                  y="126"
                  width="100"
                  height="6"
                  rx="3"
                  fill="#d4eadb"
                  opacity="0.3"
                />
                <rect
                  x="54"
                  y="140"
                  width="50"
                  height="6"
                  rx="3"
                  fill="#7fb492"
                  opacity="0.4"
                />
                <rect
                  x="54"
                  y="154"
                  width="90"
                  height="6"
                  rx="3"
                  fill="#d4eadb"
                  opacity="0.2"
                />
                <rect
                  x="115"
                  y="190"
                  width="30"
                  height="18"
                  rx="2"
                  fill="#2a302a"
                />
                <rect
                  x="90"
                  y="205"
                  width="80"
                  height="8"
                  rx="4"
                  fill="#2a302a"
                />
                <circle
                  cx="130"
                  cy="42"
                  r="18"
                  fill="#2a302a"
                  stroke="#7fb492"
                  strokeWidth="1.5"
                />
                <text
                  x="124"
                  y="49"
                  fontFamily="serif"
                  fontSize="18"
                  fill="#7fb492"
                  opacity="0.9"
                >
                  ?
                </text>
                <line
                  x1="152"
                  y1="30"
                  x2="162"
                  y2="22"
                  stroke="#7fb492"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <line
                  x1="156"
                  y1="38"
                  x2="168"
                  y2="34"
                  stroke="#7fb492"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <line
                  x1="108"
                  y1="30"
                  x2="98"
                  y2="22"
                  stroke="#7fb492"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* ── SCREEN 3: FEATURES ── */}
        <section
          id="features"
          ref={(el) => {
            sectionsRef.current[2] = el
          }}
        >
          <div className="features-inner">
            <p className="features-label reveal">What Algorun does</p>

            <div className="feature-row reveal reveal-delay-1">
              <div className="feature-num">01</div>
              <div className="feature-text">
                <h3>Context Awareness</h3>
                <p>
                  Algorun automatically reads the problem and your current code,
                  so you never have to copy-paste context.
                </p>
              </div>
            </div>

            <div className="feature-row reveal reveal-delay-2">
              <div className="feature-num">02</div>
              <div className="feature-text">
                <h3>Socratic Tutoring</h3>
                <p>
                  Instead of spoilers, get nudges and hints that help you
                  develop the algorithmic intuition yourself.
                </p>
              </div>
            </div>

            <div className="feature-row reveal reveal-delay-3">
              <div className="feature-num">03</div>
              <div className="feature-text">
                <h3>Complexity & Patterns</h3>
                <p>
                  Get instant Big-O analysis and identify underlying patterns
                  like Sliding Window or DP in plain English.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SCREEN 4: HOW IT WORKS ── */}
        <section
          id="howitworks"
          ref={(el) => {
            sectionsRef.current[3] = el
          }}
        >
          <div className="how-inner">
            <p className="how-label reveal">Setup in 3 steps</p>
            <h2 className="how-title reveal reveal-delay-1">
              From download to
              <br />
              <em>first hint</em> in under a minute.
            </h2>

            {/* Method Toggle */}
            <div className="method-toggle reveal reveal-delay-2">
              <button
                className={`toggle-btn ${installMethod === "unpacked" ? "active" : ""}`}
                onClick={() => setInstallMethod("unpacked")}
              >
                Load Unpacked
              </button>
              <button
                className={`toggle-btn ${installMethod === "dragdrop" ? "active" : ""}`}
                onClick={() => setInstallMethod("dragdrop")}
              >
                Direct Drag & Drop
              </button>
              <div
                className="toggle-slider"
                style={{
                  transform:
                    installMethod === "unpacked"
                      ? "translateX(0)"
                      : "translateX(100%)",
                }}
              />
            </div>

            <div className="steps-container">
              <div
                className={`steps ${installMethod === "unpacked" ? "active" : ""}`}
              >
                <div className="step reveal reveal-delay-2">
                  <div className="step-num">1</div>
                  <h4>Download the zip</h4>
                  <p>
                    Click the download button and save{" "}
                    <code>the extension</code> anywhere on your machine.
                  </p>
                  <span className="step-arrow">→</span>
                </div>
                <div className="step reveal reveal-delay-3">
                  <div className="step-num">2</div>
                  <h4>Load as unpacked</h4>
                  <p>
                    Unzip the file, then load the folder as an unpacked Chrome
                    extension in developer mode.
                  </p>
                  <span className="step-arrow">→</span>
                </div>
                <div className="step reveal reveal-delay-4">
                  <div className="step-num">3</div>
                  <h4>Open LeetCode</h4>
                  <p>
                    Navigate to any problem and click the Algorun panel to start
                    getting guided help.
                  </p>
                </div>
              </div>

              <div
                className={`steps ${installMethod === "dragdrop" ? "active" : ""}`}
              >
                <div className="step">
                  <div className="step-num">1</div>
                  <h4>Download the zip</h4>
                  <p>
                    Click the download button and save{" "}
                    <code>the extension</code> anywhere on your machine.
                  </p>
                  <span className="step-arrow">→</span>
                </div>
                <div className="step">
                  <div className="step-num">2</div>
                  <h4>Direct Drag & Drop</h4>
                  <p>
                    Enable Developer Mode on the extensions page, then drag and
                    drop the zip file directly.
                  </p>
                  <span className="step-arrow">→</span>
                </div>
                <div className="step">
                  <div className="step-num">3</div>
                  <h4>Open LeetCode</h4>
                  <p>
                    Navigate to any problem and click the Algorun panel to start
                    getting guided help.
                  </p>
                </div>
              </div>
            </div>

            <div className="code-pill reveal reveal-delay-4">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              chrome://extensions
              <span>→</span> Developer Mode
              <span>→</span>{" "}
              {installMethod === "unpacked"
                ? "Load Unpacked"
                : "Drag & Drop Zip"}
            </div>
          </div>
        </section>

        {/* ── SCREEN 5: DOWNLOAD ── */}
        <section
          id="download"
          ref={(el) => {
            sectionsRef.current[4] = el
          }}
        >
          <div className="download-inner">
            <div className="download-icon reveal">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5a9470"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h2 className="download-title reveal reveal-delay-1">
              Start solving
              <br />
              <em>smarter.</em>
            </h2>
            <p className="download-sub reveal reveal-delay-2">
              Stop copying solutions you don&apos;t understand.
              <br />
              Let Algorun guide you to the answer.
            </p>
            <a
              href={DOWNLOAD_URL}
              className="btn-primary reveal reveal-delay-3"
              style={{ fontSize: "1rem", padding: "15px 36px" }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Algorun (.zip)
            </a>
            <p className="download-helper reveal reveal-delay-4">
              Chrome only · Load as unpacked extension · Free forever
            </p>
          </div>
          <footer className="reveal">
            © 2026 Algorun · Not affiliated with LeetCode
          </footer>
        </section>
      </div>
    </div>
  )
}
