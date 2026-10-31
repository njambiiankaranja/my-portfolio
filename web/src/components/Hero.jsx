import { FiMail } from "react-icons/fi";
import { profile } from "../data.js";
import { SocialLinks } from "./Icons.jsx";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-center">
        <div className="hero-copy">
          <p className="hero-name">Hi, I'm {profile.name}</p>
          <h1>{profile.title}</h1>
          <p className="lede">
            I build AWS infrastructure with Terraform and automate its deployment with GitHub Actions.
            Open to remote cloud roles and freelance AWS projects.
          </p>
          <div className="actions">
            <a className="btn btn-primary" href={profile.emailLink} target="_blank" rel="noopener noreferrer">
              <FiMail aria-hidden="true" /> Email me
            </a>
            <a className="btn" href={profile.cv} download>
              My resume
            </a>
          </div>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
