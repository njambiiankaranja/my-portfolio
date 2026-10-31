import { experience as e } from "../data.js";

export default function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="exp-h">
      <div className="container">
        <h2 id="exp-h">Experience</h2>
        <div className="timeline">
          <div className="t-item">
            <h3>{e.role}</h3>
            <p className="t-meta">{e.org}, {e.place}. {e.dates}.</p>
            <ul className="points">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
