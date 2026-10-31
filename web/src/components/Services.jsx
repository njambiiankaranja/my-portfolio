import { FiGlobe, FiCloud, FiCode, FiGitBranch, FiZap, FiActivity } from "react-icons/fi";
import { services } from "../data.js";

const icons = [FiGlobe, FiCloud, FiCode, FiGitBranch, FiZap, FiActivity];

export default function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-h">
      <div className="container">
        <h2 id="services-h" className="center">What I can do for you</h2>
        <p className="section-sub center">Available for freelance work and remote roles.</p>
        <div className="service-grid">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
            <div className="service" key={s.title}>
              <span className="service-icon"><Icon aria-hidden="true" /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
