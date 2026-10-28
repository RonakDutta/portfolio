import { memo } from "react";
import Heading from "../components/type/Heading";
import Medal from "../components/ui/Medal";
import { achievements } from "../data/content";

function Achievements({ env }) {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      className="relative pt-12 pb-32 sm:pt-20 lg:pb-44"
    >
      <div className="mx-auto w-full max-w-[112rem] px-5 sm:px-9">
        <Heading
          id="achievements-title"
          index="05"
          kicker="Certifications and awards"
          title={achievements.title}
          accent={achievements.script}
        />

        <ul className="mt-16 grid gap-5 sm:mt-24 md:grid-cols-3 lg:gap-6">
          {achievements.items.map((item, i) => (
            <li key={item.name} data-reveal="up" style={{ transitionDelay: `${i * 90}ms` }}>
              <Medal item={item} index={i} env={env} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default memo(Achievements);
