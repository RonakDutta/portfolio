import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import { skills } from "../data/content";

/**
 * The toolkit, printed on paper.
 *
 * This is the one light section on the site. A dark portfolio that stays dark
 * for six screens reads as one long gradient; cutting a warm sheet into the
 * middle of it gives the scroll a middle, and gives this section a reason to
 * be plain: it is a specification page, not a wall of glowing badges.
 */
function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="paper relative isolate z-10 overflow-x-clip py-24 shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.9),0_40px_80px_-40px_rgba(0,0,0,0.9)] sm:py-32 lg:py-40"
    >
      {/* Paper tooth. Without it the sheet is a flat swatch. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23p)' opacity='0.16'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <SectionTitle
            id="skills-title"
            title={skills.title}
            script={skills.script}
            tone="paper"
          />

          <p
            data-reveal
            className="max-w-[42ch] font-display text-[1.05rem] leading-relaxed text-espresso-soft lg:justify-self-end lg:text-right"
          >
            {skills.note}
          </p>
        </div>

        <dl className="mt-16 grid gap-x-16 gap-y-12 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:gap-y-16">
          {skills.groups.map((group, i) => (
            <div
              key={group.name}
              data-reveal
              style={{ transitionDelay: `${i * 60}ms` }}
              className={i === skills.groups.length - 1 ? "sm:col-span-2" : ""}
            >
              <dt className="font-display text-[1rem] tracking-wide text-brass-deep">
                {group.name}
              </dt>

              <dd className="mt-3.5">
                <ul className="flex flex-wrap gap-x-8 gap-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-display text-[1.55rem] leading-tight font-normal
                        tracking-[-0.02em] text-espresso sm:text-[1.85rem]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default memo(Skills);
