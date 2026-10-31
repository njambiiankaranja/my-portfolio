import { useRef, useState } from "react";
import { profile } from "../data.js";
import { API_BASE, sendContact } from "../lib/api.js";
import { SocialLinks } from "./Icons.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const [state, setState] = useState({ kind: "idle", text: "" });
  const opened = useRef(Date.now());

  async function onSubmit(ev) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const data = {
      name: String(f.get("name") || "").trim(),
      email: String(f.get("email") || "").trim(),
      topic: String(f.get("topic") || "").trim(),
      message: String(f.get("message") || "").trim(),
      website: String(f.get("website") || ""),
    };
    if (!data.name || !data.message) {
      setState({ kind: "error", text: "Please enter your name and a message." });
      return;
    }
    if (!EMAIL_RE.test(data.email)) {
      setState({ kind: "error", text: "Please enter a valid email address so I can reply." });
      return;
    }
    if (Date.now() - opened.current < 3000) {
      setState({ kind: "error", text: "That was quick. Please wait a moment and send again." });
      return;
    }

    if (!API_BASE) {
      const subject = encodeURIComponent(data.topic ? `Portfolio enquiry: ${data.topic}` : "Portfolio enquiry");
      const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setState({ kind: "ok", text: "Your email app should open with the message ready to send." });
      return;
    }

    setState({ kind: "sending", text: "Sending..." });
    try {
      await sendContact(data);
      ev.currentTarget.reset();
      setState({ kind: "ok", text: "Message sent. I will reply to your email address." });
    } catch (err) {
      setState({
        kind: "error",
        text:
          err.message === "rate_limited"
            ? "Too many messages right now. Please try again later or email me directly."
            : `Could not send the message. Please email ${profile.email} instead.`,
      });
    }
  }

  return (
    <section className="section" id="contact" aria-labelledby="contact-h">
      <div className="container contact-grid">
        <div>
          <h2 id="contact-h">Contact me</h2>
          <p className="section-sub">
            Have a role or an AWS project in mind? Send a message and I will reply by email.
          </p>
          <p>
            <a className="mail-link" href={profile.emailLink} target="_blank" rel="noopener noreferrer">{profile.email}</a>
          </p>
          <SocialLinks />
        </div>
        <form className="form" onSubmit={onSubmit} noValidate>
          <label>
            Name
            <input name="name" type="text" autoComplete="name" maxLength={100} required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" maxLength={200} required />
          </label>
          <label>
            Topic (optional)
            <input name="topic" type="text" maxLength={100} />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} maxLength={4000} required />
          </label>
          <div className="hp" aria-hidden="true">
            <label>
              Leave this empty
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={state.kind === "sending"}>
            Send message
          </button>
          <p className={`status ${state.kind}`} role="status" aria-live="polite">
            {state.text}
          </p>
        </form>
      </div>
    </section>
  );
}
