import { memo, useCallback, useMemo, useState } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import Action from "../components/ui/Action";
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
  else if (!EMAIL.test(values.email.trim()))
    errors.email = "That address does not look complete.";
  if (!values.message.trim()) errors.message = "Say something and I will read it.";
  else if (values.message.length > MESSAGE_MAX)
    errors.message = `Keep it under ${MESSAGE_MAX} characters.`;
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
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`field peer ${rows ? "resize-y" : ""}`}
        style={invalid ? { borderBottomColor: "#d9663f" } : undefined}
      />
      <label htmlFor={id} className="field-label">
        {label}
        {required ? <span className="text-brass"> *</span> : null}
      </label>

      <p
        id={`${id}-error`}
        role={invalid ? "alert" : undefined}
        className={`mt-2 font-mono text-[0.66rem] tracking-[0.08em] text-ember transition-opacity
          duration-300 ${invalid ? "opacity-100" : "opacity-0"}`}
      >
        {error || " "}
      </p>
    </div>
  );
}

function Contact() {
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
    () =>
      `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`.trim(),
    [values],
  );

  const submit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) {
      document.getElementById(`contact-${Object.keys(errors)[0]}`)?.focus();
      return;
    }

    const subject = encodeURIComponent(
      values.subject.trim() || `Hello from ${values.name.trim()}`,
    );
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

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-x-clip pt-10 pb-10 sm:pt-14 lg:pt-20"
    >
      <GoldGeometry
        variant="orbit"
        className="pointer-events-none top-[38%] left-1/2 aspect-square w-[150vmin]
          -translate-x-1/2 -translate-y-1/2 opacity-40 lg:w-[92vmin]"
      />

      <div className="relative mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <SectionTitle
          id="contact-title"
          title={contact.title}
          script={contact.script}
          size="xl"
        />

        <div className="mt-14 grid gap-16 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-24">
          {/* Left: the human part. `min-w-0` matters here. Without it the
              email row sets the grid track's width and the whole column grows
              past the viewport on a phone. */}
          <div className="min-w-0">
            <p
              data-reveal
              className="max-w-[38ch] font-display text-[1.4rem] leading-snug font-normal text-ivory sm:text-[1.7rem]"
            >
              {contact.lede}
            </p>

            <p data-reveal className="mt-4 text-[0.98rem] text-sand/75">
              {contact.responseTime}
            </p>

            <ul data-reveal className="mt-12 space-y-px">
              {contact.channels.map((channel) => (
                <li
                  key={channel.key}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <a
                    href={links[channel.key]}
                    target={channel.key === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    data-cursor={channel.key === "email" ? "Write" : "Open"}
                    className="flex min-w-0 flex-1 items-baseline gap-5"
                  >
                    <span className="w-16 shrink-0 text-[0.85rem] text-brass/70 sm:w-20">
                      {channel.label}
                    </span>
                    <span
                      className="link-underline min-w-0 truncate font-display text-[1.05rem] text-pearl
                        transition-colors duration-500 group-hover:text-brass-lit sm:text-[1.3rem]"
                    >
                      {channel.value}
                    </span>
                  </a>

                  {channel.key === "email" ? (
                    <button
                      type="button"
                      onClick={() => copy(identity.email, "email")}
                      className="shrink-0 text-[0.85rem] text-mute transition-colors duration-500
                        hover:text-brass-lit"
                    >
                      {copied === "email" ? contact.copiedLabel : "Copy"}
                    </button>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-mute transition-colors duration-500 group-hover:text-brass"
                    >
                      ↗
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <p
              data-reveal
              className="mt-10 max-w-[40ch] text-[0.92rem] leading-relaxed text-sand/60"
            >
              {contact.availability}
            </p>
          </div>

          {/* Right: the form */}
          <div data-reveal className="min-w-0">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="script text-[2.4rem] leading-none text-brass-lit sm:text-[2.8rem]">
                {contact.formTitle}
              </h3>
              {!sent ? (
                <span className="shrink-0 font-mono text-[0.66rem] text-mute">
                  {values.message.length}/{MESSAGE_MAX}
                </span>
              ) : null}
            </div>

            {sent ? (
              <div className="mt-10">
                <p className="font-display text-[1.5rem] leading-snug text-ivory">
                  Your mail client should be open now.
                </p>
                <p className="mt-4 max-w-[44ch] text-[0.96rem] leading-relaxed text-sand/80">
                  If nothing happened, copy the note below and send it to{" "}
                  <a
                    href={`mailto:${identity.email}`}
                    className="link-underline text-brass-lit"
                  >
                    {identity.email}
                  </a>
                  .
                </p>

                <pre className="mt-7 max-h-52 overflow-auto border border-brass/15 bg-carbon/60 p-5 font-mono text-[0.76rem] leading-relaxed whitespace-pre-wrap text-sand/85">
                  {draft}
                </pre>

                <div className="mt-7 flex flex-wrap gap-4">
                  <Action
                    variant="solid"
                    onClick={() => copy(draft, "draft")}
                    arrow={null}
                  >
                    {copied === "draft" ? contact.copiedLabel : contact.copyLabel}
                  </Action>
                  <Action onClick={reset} arrow={null}>
                    {contact.againLabel}
                  </Action>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-8 min-w-0">
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
                  <Action variant="solid" type="submit">
                    {contact.sendLabel}
                  </Action>
                </div>
              </form>
            )}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </p>

        <footer className="mt-24 flex flex-col items-start justify-between gap-6 pt-8 sm:flex-row sm:items-center">
          <p className="eyebrow-sm text-mute">
            {contact.closing}{" "}
            <span className="whitespace-nowrap text-sand/85">{identity.name}</span>
            <span aria-hidden="true" className="mx-3 text-brass-deep">
              /
            </span>
            {new Date().getFullYear()}
          </p>

          <button
            type="button"
            onClick={() => scrollToSection(SECTIONS[0].id)}
            className="link-underline group inline-flex min-h-11 items-center gap-3 eyebrow-sm
              text-sand transition-colors duration-500 hover:text-ivory"
          >
            {contact.backToTop}
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5 text-brass transition-transform duration-500 group-hover:-translate-y-1"
            >
              <path
                d="M6 11V1M2 5l4-4 4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </button>

          <p className="sr-only">
            {identity.name}, {identity.role} in {identity.region}. Contact by email
            at {identity.email}.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default memo(Contact);
