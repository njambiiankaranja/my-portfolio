import { FiExternalLink } from "react-icons/fi";
import { credentials } from "../data.js";

export default function Credentials() {
  return (
    <section className="section" id="credentials" aria-labelledby="cred-h">
      <div className="container">
        <h2 id="cred-h" className="center">Credentials</h2>
        <p className="section-sub center">
          Course certificates and AWS training badges. Each one links to its official page so you can verify it.
        </p>
        <ul className="cred-list">
          {credentials.map((c) => (
            <li key={c.title}>
              <div>
                <h3>{c.title}</h3>
                <p>{c.detail}</p>
              </div>
              <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${c.title}`}>
                Verify <FiExternalLink aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
