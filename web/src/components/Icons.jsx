import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { SiUpwork } from "react-icons/si";
import { FiMail } from "react-icons/fi";
import { profile } from "../data.js";

export function SocialLinks({ className = "" }) {
  const items = [
    { label: "GitHub", href: profile.github, Icon: FaGithub, external: true },
    { label: "LinkedIn", href: profile.linkedin, Icon: FaLinkedinIn, external: true },
    { label: "Upwork", href: profile.upwork, Icon: SiUpwork, external: true },
    { label: "Email", href: profile.emailLink, Icon: FiMail, external: true },
  ];
  return (
    <ul className={`social ${className}`}>
      {items.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
