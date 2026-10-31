import { FaGithub } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { projects, site } from "../data.js";

export default function Projects() {
  const shown = projects.filter((p) => p.visible === undefined || p.visible === true || (p.visible === "awsOnly" && site.hostedOnAws));
  return (
    <section className="section" id="projects" aria-labelledby="projects-h">
      <div className="container">
        <h2 id="projects-h" className="center">Projects</h2>
        <p className="section-sub center">Each one is built with Terraform and has a public repository.</p>
        <div className="project-grid">
          {shown.map((p) => (
            <article className="card" key={p.title}>
              <h3>{p.title}</h3>
              <p className="card-sum">{p.summary}</p>
              {p.flow.length > 0 && (
                <ol className="flow" aria-label="How the pieces connect">
                  {p.flow.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ol>
              )}
              <ul className="points">
                {p.points.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {p.note && <p className="card-note">{p.note}</p>}
              <ul className="tags" aria-label="Technologies">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="card-links">
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  <FaGithub aria-hidden="true" /> Source code
                </a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink aria-hidden="true" /> Live site
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
