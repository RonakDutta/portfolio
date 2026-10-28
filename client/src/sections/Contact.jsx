import { memo, useCallback, useMemo, useState } from "react";
import Eclipse from "../components/eclipse/Eclipse";
import Button, { Arrow } from "../components/ui/Button";
import { scrollToSection } from "../lib/useSmoothScroll";
import { SECTIONS } from "../lib/store";
import { contact, identity } from "../data/content";

const EMPTY = { name: "", email: "", subject: "", message: "" };
const MESSAGE_MAX = 1200;
/* Deliberately loose: the job here is to catch a typo, not to adjudicate what
   is a legal address. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Tell me who you are.";
  if (!values.email.trim()) errors.email = "I need somewhere to reply.";
  else if (!EMAIL.test(values.email.trim())) errors.email = "That address does not look complete.";
  if (!values.message.trim()) errors.message = "Say something and I will read it.";
  else if (values.message.length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`;
  return errors;
}

function Field({
  id,
  name,
  label,
  value,
  error,
  touched,
  onChange,
  onBlur,
  type = "text",
  rows,
  required = false,
}) {
  const invalid = Boolean(touched && error);
  const Tag = rows ? "textarea" : "input";

  return (
    <div className="relative">
      <div className="relative">
        <Tag
          id={id}
          name={name}
          type={rows ? undefined : type}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder=" "
          required={required}
          autoComplete={name === "email" ? "email" : name === "name" ? "name" : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className={`field ${rows ? "resize-y" : ""}`}
          style={invalid ? { borderBottomColor: "#e3793d" } : undefined}
        />
        <label htmlFor={id} className="field-label">
          {label}
          {required ? <span className="text-gold"> *</span> : null}
        </label>
        <span aria-hidden="true" className="field-glow" />
      </div>
      <p
        id={`${id}-error`}
        role={invalid ? "alert" : undefined}
        className={`mt-2 min-h-[1.2rem] text-[0.82rem] text-flare transition-opacity duration-300 ${
          invalid ? "opacity-100" : "opacity-0"
        }`}
      >
        {error || " "}
      </p>
    </div>
  );
}

/**
 * The close. The eclipse returns, set between the two words of the title,
 * and the page ends where it began: in totality.
 */
function Contact({ env }) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState("");

  const errors = useMemo(() => validate(values), [values]);

  const change = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const blur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const copy = useCallback(async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 2200);
    } catch {
      /* Clipboard blocked. The address is on screen either way. */
    }
  }, []);

  const draft = useMemo(
    () => `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`.trim(),
    [values],
  );

  const submit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) {
      document.getElementById(`contact-${Object.keys(errors)[0]}`)?.focus();
      return;
    }
    const subject = encodeURIComponent(values.subject.trim() || `Hello from ${values.name.trim()}`);
    window.location.href = `mailto:${identity.email}?subject=${subject}&body=${encodeURIComponent(draft)}`;
    setSent(true);
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setSent(false);
  };

  const links = {
    email: `mailto:${identity.email}`,
    github: identity.github,
    linkedin: identity.linkedin,
    resume: identity.resume,
  };

  const word =
    "wide block text-[clamp(3.6rem,19vw,7rem)] leading-[0.82] font-[850] tracking-[-0.045em] uppercase lg:text-[min(8.4vw,9.5rem)]";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative pt-20 pb-8 sm:pt-28">
      <div className="mx-auto w-full max-w-[112rem] px-5 sm:px-9">
        <p data-reveal="up" className="label flex items-center justify-center gap-3 text-gold">
          <span>06</span>
          <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
          <span>Get in touch</span>
        </p>

        <h2 id="contact-title" className="sr-only">
          {contact.title} {contact.script}
        </h2>
        <div
          aria-hidden="true"
          className="mt-16 flex flex-col items-center sm:mt-24 lg:flex-row lg:justify-center"
        >
          <span data-reveal="stretch" className={`${word} text-ivory lg:order-1`}>
            {contact.title}
          </span>
          <Eclipse
            env={env}
            className="relative my-[16vw] aspect-square w-[min(44vw,13rem)] shrink-0 sm:my-24 lg:order-2 lg:mx-[3.5vw] lg:my-0 lg:w-[min(16vw,14rem)]"
          />
          <span data-reveal="stretch" className={`${word} foil lg:order-3`}>
            {contact.script}
          </span>
        </div>

        <div className="mt-28 grid gap-x-10 gap-y-20 sm:mt-40 lg:grid-cols-12">
          {/* The human part. `min-w-0` keeps the email row from widening the
              track past the viewport on a phone. */}
          <div className="min-w-0 lg:col-span-5">
            <p
              data-reveal="up"
              className="max-w-[30ch] text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-[1.2] font-[480] tracking-[-0.018em] text-ivory"
            >
              {contact.lede}
            </p>
            <p data-reveal="up" className="mt-5 text-[1rem] text-bone/70">
              {contact.responseTime}
            </p>

            <ul data-reveal="up" className="mt-12 border-t border-gold/15">
              {contact.channels.map((channel) => (
                <li
                  key={channel.key}
                  className="group relative flex items-center gap-4 border-b border-gold/15"
                >
                  <a
                    href={links[channel.key]}
                    target={channel.key === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex min-h-[4.5rem] min-w-0 flex-1 items-center gap-5 py-4"
                  >
                    <span className="label w-[4.75rem] shrink-0 text-gold/80">{channel.label}</span>
                    <span className="min-w-0 truncate text-[1.1rem] font-[560] tracking-[-0.01em] text-ivory transition-[color,translate] duration-500 ease-[var(--ease-cine)] group-hover:translate-x-1.5 group-hover:text-gold-lit sm:text-[1.3rem]">
                      {channel.value}
                    </span>
                  </a>
                  {channel.key === "email" ? (
                    <button
                      type="button"
                      onClick={() => copy(identity.email, "email")}
                      className="shrink-0 rounded-full px-4 py-2 text-[0.85rem] font-[560] text-bone ring-1 ring-gold/25 transition-colors duration-500 hover:bg-gold-lit hover:text-ink"
                    >
                      {copied === "email" ? contact.copiedLabel : "Copy"}
                    </button>
                  ) : (
                    <Arrow dir="out" className="mr-1 text-gold/70" />
                  )}
                </li>
              ))}
            </ul>

            <p data-reveal="up" className="mt-10 max-w-[40ch] text-[0.95rem] leading-relaxed text-bone/60">
              {contact.availability}
            </p>
          </div>

          {/* The form. */}
          <div data-reveal="up" className="min-w-0 lg:col-span-6 lg:col-start-7">
            <div
              className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10"
              style={{
                background: "linear-gradient(165deg, rgba(29,26,34,0.85) 0%, rgba(12,10,16,0.92) 60%)",
                boxShadow: "inset 0 0 0 1px rgba(236,215,163,0.14), 0 40px 80px -40px rgba(0,0,0,0.9)",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/2 -right-1/3 aspect-square w-[80%] rounded-full"
                style={{
                  background: "radial-gradient(closest-side, rgba(200,164,92,0.14), transparent)",
                }}
              />
              <div className="relative flex items-baseline justify-between gap-4">
                <h3 className="text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] leading-none font-[750] tracking-[-0.025em] text-ivory [font-stretch:118%]">
                  {contact.formTitle}
                </h3>
                {!sent ? (
                  <span className="label shrink-0 text-ash">
                    {values.message.length}/{MESSAGE_MAX}
                  </span>
                ) : null}
              </div>

              {sent ? (
                <div className="relative mt-10">
                  <p className="text-[1.4rem] leading-snug font-[560] text-ivory">
                    Your mail client should be open now.
                  </p>
                  <p className="mt-4 max-w-[44ch] text-[0.98rem] leading-relaxed text-bone/80">
                    If nothing happened, copy the note below and send it to{" "}
                    <a href={`mailto:${identity.email}`} className="link-line text-gold-lit">
                      {identity.email}
                    </a>
                    .
                  </p>
                  <pre className="mt-7 max-h-52 overflow-auto rounded-2xl bg-ink/70 p-5 font-mono text-[0.78rem] leading-relaxed whitespace-pre-wrap text-bone/85 ring-1 ring-gold/15">
                    {draft}
                  </pre>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button onClick={() => copy(draft, "draft")} arrow="right">
                      {copied === "draft" ? contact.copiedLabel : contact.copyLabel}
                    </Button>
                    <Button variant="line" onClick={reset} arrow="up">
                      {contact.againLabel}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="relative mt-6 min-w-0">
                  <div className="grid gap-x-8 sm:grid-cols-2">
                    <Field
                      id="contact-name"
                      name="name"
                      label="Your name"
                      required
                      value={values.name}
                      error={errors.name}
                      touched={touched.name}
                      onChange={change}
                      onBlur={blur}
                    />
                    <Field
                      id="contact-email"
                      name="email"
                      type="email"
                      label="Email"
                      required
                      value={values.email}
                      error={errors.email}
                      touched={touched.email}
                      onChange={change}
                      onBlur={blur}
                    />
                  </div>
                  <Field
                    id="contact-subject"
                    name="subject"
                    label="Subject"
                    value={values.subject}
                    error={errors.subject}
                    touched={touched.subject}
                    onChange={change}
                    onBlur={blur}
                  />
                  <Field
                    id="contact-message"
                    name="message"
                    label="Message"
                    required
                    rows={5}
                    value={values.message}
                    error={errors.message}
                    touched={touched.message}
                    onChange={change}
                    onBlur={blur}
                  />
                  <div className="mt-6">
                    <Button
                      size="lg"
                      type="submit"
                      arrow="right"
                      className="w-full sm:w-auto sm:min-w-[11rem]"
                    >
                      {contact.sendLabel}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </p>

        <footer className="mt-32 flex flex-col items-start justify-between gap-6 border-t border-gold/12 pt-8 sm:flex-row sm:items-center">
          <p className="text-[0.92rem] text-ash">
            {contact.closing} <span className="font-[600] whitespace-nowrap text-bone">{identity.name}</span>
            <span aria-hidden="true" className="mx-2.5 text-gold-deep">
              /
            </span>
            {new Date().getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => scrollToSection(SECTIONS[0].id)}
            className="group inline-flex min-h-11 items-center gap-3 text-[0.92rem] font-[560] text-bone transition-colors duration-500 hover:text-ivory"
          >
            <span className="link-line">{contact.backToTop}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-gold/30 transition-colors duration-500 group-hover:bg-gold-lit group-hover:text-ink">
              <Arrow dir="up" />
            </span>
          </button>
          <p className="sr-only">
            {identity.name}, {identity.role} in {identity.region}. Contact by email at {identity.email}.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default memo(Contact);
