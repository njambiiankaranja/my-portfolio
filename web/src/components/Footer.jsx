import { useEffect, useState } from "react";
import { profile, site } from "../data.js";
import { countVisit } from "../lib/api.js";
import { SocialLinks } from "./Icons.jsx";

export default function Footer() {
  const [visits, setVisits] = useState(null);
  useEffect(() => {
    countVisit().then(setVisits);
  }, []);
  return (
    <footer className="footer">
      <div className="container footer-row">
        <SocialLinks />
        <p>
          Built with React and Vite.
          {site.hostedOnAws && " Hosted on AWS with Terraform."}
        </p>
        <p>
          &copy; {new Date().getFullYear()} {profile.name}
          {visits !== null && <> &middot; {visits.toLocaleString()} visits</>}
        </p>
      </div>
    </footer>
  );
}
