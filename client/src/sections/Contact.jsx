import { memo, useState } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import LuxuryButton from "../components/ui/LuxuryButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { SECTIONS } from "../lib/store";
import { contact, identity } from "../data/content";

function Contact() {
  const [copied, setCopied] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle"); // 'idle' | 'sending' | 'success'

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 2200);
    } catch {
      /* Clipboard fallback */
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus("sending");

    // Compose mailto link as direct fallback so visitor can also send via their mail client
    const mailtoSubject = encodeURIComponent(
      formData.subject || `Inquiry from ${formData.name}`,
    );
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    );
    const mailtoUrl = `mailto:${identity.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setTimeout(() => {
      setFormStatus("success");
      // Trigger mailto client
      window.location.href = mailtoUrl;
    }, 600);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setFormStatus("idle");
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-x-clip pt-20 pb-8 sm:pt-28 sm:pb-10 lg:pt-36 lg:pb-12"
    >
      <GoldGeometry
        variant="orbit"
        data-reveal
        className="pointer-events-none top-1/2 left-1/2 aspect-square w-[140vmin] -translate-x-1/2 -translate-y-1/2 opacity-45 lg:w-[96vmin]"
      />

      <div className="relative mx-auto w-full max-w-[108rem] px-5 sm:px-10">
        <SectionTitle
          id="contact-title"
          index={contact.index}
          label={contact.label}
          title={contact.title}
          itemClass="reveal"
        />

        <div className="mt-10 grid gap-10 sm:mt-12 sm:gap-12 lg:grid-cols-12 lg:gap-16 lg:items-start">
          {/* Left Column: Context, Social Links with SVG Icons */}
          <div className="space-y-7 lg:col-span-5 min-w-0 w-full">
            <div data-reveal className="space-y-3.5">
              <p className="text-[1.12rem] sm:text-[1.22rem] leading-snug font-normal text-ivory">
                Let’s build something exceptional together.
              </p>
              <p className="text-[0.96rem] leading-relaxed text-sand/85 font-light">
                Open to software engineering roles, distributed systems discussions, and full-stack collaborations. Feel free to send a note or connect through my social links.
              </p>
            </div>

            {/* Social & Direct Contact Channels */}
            <div data-reveal className="space-y-3 pt-1">
              {/* Email */}
              <div className="group flex items-center justify-between gap-3 rounded-xl border border-gold-dark/20 bg-carbon/70 p-4 transition-all duration-300 hover:border-gold-metal/40 hover:bg-coal/90 w-full min-w-0">
                <a
                  href={`mailto:${identity.email}`}
                  className="flex items-center gap-3.5 min-w-0 flex-1"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-dark/30 bg-coal text-gold-metal transition-colors group-hover:border-gold-metal group-hover:text-gold-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-metal">
                      Email
                    </span>
                    <span className="block truncate text-sm font-medium text-ivory group-hover:text-gold-white transition-colors">
                      {identity.email}
                    </span>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => copy(identity.email)}
                  className="shrink-0 inline-flex min-h-9 items-center justify-center rounded-md border border-gold-dark/30 bg-coal/80 px-3 eyebrow-sm text-[0.62rem] text-sand/80 transition-all hover:border-gold-metal hover:text-gold-white cursor-pointer"
                  title="Copy email address"
                >
                  {copied === identity.email ? (
                    <span className="text-gold-bright">Copied</span>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>

              {/* GitHub */}
              <a
                href={identity.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-gold-dark/20 bg-carbon/70 p-4 transition-all duration-300 hover:border-gold-metal/40 hover:bg-coal/90 w-full min-w-0"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-dark/30 bg-coal text-gold-metal transition-colors group-hover:border-gold-metal group-hover:text-gold-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-metal">
                      GitHub
                    </span>
                    <span className="block truncate text-sm font-medium text-ivory group-hover:text-gold-white transition-colors">
                      github.com/RonakDutta
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-sand/50 group-hover:text-gold-metal transition-colors">
                  ↗
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-gold-dark/20 bg-carbon/70 p-4 transition-all duration-300 hover:border-gold-metal/40 hover:bg-coal/90 w-full min-w-0"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-dark/30 bg-coal text-gold-metal transition-colors group-hover:border-gold-metal group-hover:text-gold-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-metal">
                      LinkedIn
                    </span>
                    <span className="block truncate text-sm font-medium text-ivory group-hover:text-gold-white transition-colors">
                      linkedin.com/in/ronak-dutta
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-sand/50 group-hover:text-gold-metal transition-colors">
                  ↗
                </span>
              </a>

              {/* Resume */}
              <a
                href={identity.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-gold-dark/20 bg-carbon/70 p-4 transition-all duration-300 hover:border-gold-metal/40 hover:bg-coal/90 w-full min-w-0"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-dark/30 bg-coal text-gold-metal transition-colors group-hover:border-gold-metal group-hover:text-gold-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-metal">
                      Curriculum Vitae
                    </span>
                    <span className="block truncate text-sm font-medium text-ivory group-hover:text-gold-white transition-colors">
                      View Official Resume
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-sand/50 group-hover:text-gold-metal transition-colors">
                  ↗
                </span>
              </a>
            </div>

            {/* Location & Availability */}
            <div data-reveal className="rounded-xl border border-gold-dark/20 bg-carbon/70 p-4 sm:p-5 w-full min-w-0">
              <span className="block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-metal mb-1.5">
                Location & Availability
              </span>
              <p className="text-[0.92rem] leading-relaxed text-sand/90 font-light">
                Based in <strong className="text-ivory font-medium">New Delhi, India</strong>. Available for full-time software engineering roles, internships, and remote work.
              </p>
            </div>
          </div>

          {/* Right Column: Luxury Interactive Contact Form */}
          <div data-reveal className="lg:col-span-7 min-w-0 w-full">
            <div className="relative rounded-2xl border border-gold-dark/30 bg-carbon/85 p-5 sm:p-8 lg:p-10 shadow-[0_0_35px_rgba(0,0,0,0.45)] w-full min-w-0">
              {/* Precision curved gold metallic border highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent"
                style={{
                  borderTopColor: "#ffd966",
                  borderLeftColor: "#e5be48",
                  WebkitMaskImage:
                    "linear-gradient(135deg, black 0%, black 20%, transparent 60%)",
                  maskImage:
                    "linear-gradient(135deg, black 0%, black 20%, transparent 60%)",
                }}
              />

              <div className="mb-6 border-b border-gold-dark/15 pb-4">
                <h3 className="eyebrow-sm flex items-center gap-2.5 font-semibold tracking-[0.24em] text-champagne">
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold-metal" />
                  Send a Message
                </h3>
              </div>

              {formStatus === "success" ? (
                <div className="py-10 text-center space-y-5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-gold-metal/50 bg-coal/90 text-gold-bright">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-xl font-semibold text-ivory">
                      Message Prepared & Sent
                    </h4>
                    <p className="text-sand/85 text-sm max-w-sm mx-auto">
                      Your email client has been opened with your message. I typically respond within 24 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-gold-dark/40 bg-coal px-5 eyebrow-sm text-[0.7rem] text-champagne hover:border-gold-metal hover:text-gold-white transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 w-full min-w-0">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2 min-w-0">
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-champagne/90"
                      >
                        Your Name <span className="text-gold-metal">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full min-w-0 rounded-xl border border-gold-dark/25 bg-coal/70 px-4 py-3.5 text-sm text-ivory placeholder-sand/35 transition-all duration-300 focus:border-gold-metal focus:bg-coal focus:ring-1 focus:ring-gold-metal/40 focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 min-w-0">
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-champagne/90"
                      >
                        Email Address <span className="text-gold-metal">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. aarav@example.com"
                        className="w-full min-w-0 rounded-xl border border-gold-dark/25 bg-coal/70 px-4 py-3.5 text-sm text-ivory placeholder-sand/35 transition-all duration-300 focus:border-gold-metal focus:bg-coal focus:ring-1 focus:ring-gold-metal/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2 min-w-0">
                    <label
                      htmlFor="contact-subject"
                      className="block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-champagne/90"
                    >
                      Subject / Role
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Engineering Role / Project Collaboration"
                      className="w-full min-w-0 rounded-xl border border-gold-dark/25 bg-coal/70 px-4 py-3.5 text-sm text-ivory placeholder-sand/35 transition-all duration-300 focus:border-gold-metal focus:bg-coal focus:ring-1 focus:ring-gold-metal/40 focus:outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2 min-w-0">
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-champagne/90"
                    >
                      Your Message <span className="text-gold-metal">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      className="w-full min-w-0 resize-y rounded-xl border border-gold-dark/25 bg-coal/70 px-4 py-3.5 text-sm text-ivory placeholder-sand/35 transition-all duration-300 focus:border-gold-metal focus:bg-coal focus:ring-1 focus:ring-gold-metal/40 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <LuxuryButton
                      variant="gold"
                      type="submit"
                      disabled={formStatus === "sending"}
                    >
                      {formStatus === "sending" ? "Sending..." : "Send Message →"}
                    </LuxuryButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </p>

        <footer data-reveal className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-gold-dark/20 pt-8 text-center sm:flex-row sm:items-center sm:text-left">
          <p className="eyebrow-sm text-mute">
            Designed & Engineered by{" "}
            <span className="whitespace-nowrap text-sand/90 font-medium">
              {identity.name}
            </span>
            <span aria-hidden="true" className="mx-3 text-gold-dark/40">
              /
            </span>
            {new Date().getFullYear()}
          </p>

          <button
            type="button"
            onClick={() => scrollToSection(SECTIONS[0].id)}
            className="gold-underline group inline-flex min-h-11 items-center gap-3 eyebrow-sm
              text-sand transition-colors duration-500 hover:text-ivory cursor-pointer"
          >
            {contact.backToTop}
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5 text-gold-metal transition-transform duration-500 group-hover:-translate-y-1"
            >
              <path d="M6 11V1M2 5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>

          <p className="sr-only">
            {identity.name}, {identity.role} in {identity.region}. Contact by email at{" "}
            {identity.email}.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default memo(Contact);
