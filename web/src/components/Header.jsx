import { useState } from "react";
import { FiMenu, FiX, FiDownload } from "react-icons/fi";
import { profile } from "../data.js";

const links = [
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Services", "#services"],
  ["Credentials", "#credentials"],
  ["Contact", "#contact"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <div className="container header-row">
        <a href="#top" className="brand" onClick={close}>
          {profile.name}
        </a>
        <button
          className="menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
        <nav id="nav" className={`nav ${open ? "is-open" : ""}`} aria-label="Main">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={close}>
              {label}
            </a>
          ))}
          <a className="btn btn-small" href={profile.cv} download onClick={close}>
            <FiDownload aria-hidden="true" /> My resume
          </a>
        </nav>
      </div>
    </header>
  );
}
