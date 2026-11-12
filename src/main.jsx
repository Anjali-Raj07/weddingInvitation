import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const MEMORY_PHOTOS = [
    {
        id: "one",
        src: "/images/memories4.jpeg",
        alt: "A special memory together",
        caption: "THE LITTLE MOMENTS",
        pos: "center 25%",
    },
    {
        id: "two",
        src: "/images/memories1.jpeg",
        alt: "A beautiful memory",
        caption: "ALWAYS BETTER TOGETHER",
        pos: "center 30%",
    },
    {
        id: "three",
        src: "/images/memories8.jpeg",
        alt: "Our favourite portrait",
        caption: "AND SO THE STORY GOES",
        pos: "center 40%",
    },
];

function MemoriesGallery() {
    const trackRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState(0);

    // One gentle reveal when the gallery scrolls into view
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        if (!("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Mobile swipe: work out which photo is centred so the dots follow
    const handleScroll = () => {
        const el = trackRef.current;
        if (!el) return;
        const centre = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(el.children).forEach((child, i) => {
            const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - centre);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        });
        setActive(best);
    };

    const goTo = (i) => {
        const el = trackRef.current;
        if (!el || !el.children[i]) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.children[i].scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            inline: "center",
            block: "nearest",
        });
    };

    return (
        <div className="memories-content">
            <div className="memories-heading">
                <p className="eyebrow">THE LITTLE THINGS WE KEEP</p>
                <h2>Our <em>Memories</em></h2>
                <div className="ornament">❧</div>
                <p className="memories-description">
                    A thousand little moments, all leading to this beautiful beginning.
                </p>
            </div>

            <div
                ref={trackRef}
                className={`mem-grid${visible ? " is-visible" : ""}`}
                onScroll={handleScroll}
            >
                {MEMORY_PHOTOS.map((photo, i) => (
                    <figure key={photo.id} className="mem-photo" style={{ "--i": i }}>
                        <div className="mem-frame">
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                loading="lazy"
                                decoding="async"
                                style={{ objectPosition: photo.pos }}
                            />
                        </div>
                        <figcaption>{photo.caption}</figcaption>
                    </figure>
                ))}
            </div>

            {/* Dots: shown on mobile only */}
            <div className="mem-dots">
                {MEMORY_PHOTOS.map((photo, i) => (
                    <button
                        key={photo.id}
                        type="button"
                        className={i === active ? "on" : ""}
                        aria-label={`Show photo ${i + 1} of ${MEMORY_PHOTOS.length}`}
                        aria-current={i === active}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

            <p className="memories-footer">
                SOME MOMENTS BECOME FOREVER <span aria-hidden="true">♡</span>
            </p>
        </div>
    );
}

const EVENT = {
    title: "Anitta & Amal – Betrothal Function",
    description:
        "With the blessing of our families. Time and venue details will be shared soon.",
    start: "20270109",
    end: "20270110", // all-day events end on the following day
};

const GOOGLE_CALENDAR_URL =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(EVENT.title)}` +
    `&dates=${EVENT.start}/${EVENT.end}` +
    `&details=${encodeURIComponent(EVENT.description)}`;

const escapeIcs = (text) =>
    text
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");

// Downloads a .ics file that opens in Apple, Google, Outlook and other calendars
function downloadCalendarFile() {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Anitta and Amal//Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:anitta-amal-${EVENT.start}@invitation`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${EVENT.start}`,
        `DTEND;VALUE=DATE:${EVENT.end}`,
        `SUMMARY:${escapeIcs(EVENT.title)}`,
        `DESCRIPTION:${escapeIcs(EVENT.description)}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], {
        type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "anitta-amal-celebration.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function App() {
    return (
        <main>
            <section className="hero" id="home">
                <div className="hero-image" aria-hidden="true" />
                <nav className="nav">
                    <a className="monogram" href="#home">A <span>&</span> A</a>
                    <div className="nav-links">
                        <a href="#details">THE CELEBRATION</a>
                        <a href="#story">A NOTE</a>
                        <a href="#memories">OUR MEMORIES</a>
                        <a href="#rsvp">RSVP</a>
                    </div>
                </nav>

                <div className="hero-content">
                    <p className="eyebrow">WITH THE BLESSING OF OUR FAMILIES</p>
                    <h1>Anitta <em>&</em> Amal</h1>
                    <div className="fine-line"><span>✦</span></div>
                    <p className="hero-subtitle">
                        A day to celebrate love, faith<br />and the beginning of forever.
                    </p>
                    <a className="outline-link" href="#details">JOIN US</a>
                </div>
                <div className="vertical-note">A BEAUTIFUL BEGINNING · 09 JANUARY 2027</div>
                <a className="scroll-cue" href="#details">SCROLL TO EXPLORE <span>↓</span></a>
            </section>

            <section className="intro section-pad" id="story">
                <p className="eyebrow">A LITTLE NOTE FROM US</p>
                <h2>Some moments are<br /><em>meant to be shared.</em></h2>
                <div className="ornament">❧</div>
                <p className="intro-copy">
                    With grateful hearts and the love of our families, we invite you
                    to be part of a very special day as we begin this beautiful new chapter.
                    Your presence will make our celebration all the more meaningful.
                </p>
                <p className="signature">Anitta &amp; Amal</p>
            </section>

            <section className="details section-pad" id="details">
                <div className="details-inner">
                    <p className="eyebrow">PLEASE SAVE THE DATE</p>
                    <h2>The <em>Celebration</em></h2>
                    <div className="date-block">
                        <span className="date-day">SATURDAY</span>
                        <div className="date-main">
                            <span>09</span>
                            <div><b>JANUARY</b><small>2027</small></div>
                        </div>
                        <span className="date-time">TIME TO BE ANNOUNCED</span>
                    </div>
                    <div className="detail-rule" />
                    <div className="event-grid">
                        <div>
                            <span className="eyebrow">THE CEREMONY</span>
                            <h3>Betrothal Function</h3>
                            <p>Inside the church</p>
                        </div>
                        <div>
                            <span className="eyebrow">THE LOCATION</span>
                            <h3>Our Church</h3>
                            <p>Church name &amp; address to be added</p>
                        </div>
                    </div>
                    <p className="small-note">Further details will be shared soon.</p>
                </div>
            </section>

            {/* OUR MEMORIES (id changed to "memories" so the nav link works) */}
            <section className="memories" id="memories">

                {/* Matted triptych gallery */}
                <MemoriesGallery />
            </section>

            <section className="quote-section">
                <div className="quote-mark">“</div>
                <blockquote>Love is patient, love is kind.</blockquote>
                <p>1 CORINTHIANS 13:4</p>
            </section>

            <section className="rsvp section-pad" id="rsvp">
                <p className="eyebrow">WE WOULD LOVE TO SEE YOU</p>
                <h2>Be part of our<br /><em>special day.</em></h2>
                <p className="rsvp-copy">
                    Your presence is the most precious gift.<br />
                    We look forward to celebrating with you.
                </p>
                <button
                    type="button"
                    className="outline-link dark"
                    onClick={downloadCalendarFile}
                >
                    ADD TO CALENDAR
                </button>
                <p className="small-note">
                    Saved as an all-day event — we’ll share the time soon.<br />
                    <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                        Or add to Google Calendar
                    </a>
                </p>
                <p className="footer-names">ANITTA <span>&</span> AMAL</p>
                <p className="footer-date">09 · 01 · 2027</p>
            </section>
        </main>
    );
}

createRoot(document.getElementById("root")).render(<App />);