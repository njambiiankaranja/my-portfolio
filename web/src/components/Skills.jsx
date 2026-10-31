import { skills } from "../data.js";

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-h">
      <div className="container">
        <h2 id="skills-h" className="center">Technical skills</h2>
        <div className="skill-grid">
          {skills.map((g) => (
            <div className="skill-card" key={g.group}>
              <h3>{g.group}</h3>
              <ul>
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
