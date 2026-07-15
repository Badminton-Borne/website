import { Eyebrow } from "@/components/ui/Eyebrow";
import { SanityImg } from "@/components/ui/SanityImg";
import { Reveal } from "@/components/fx/Reveal";
import { experienceChip } from "@/lib/format";
import type { TeamMemberCard, TeamSection as TeamData } from "@/sanity/types";

function TeamCard({ member }: { member: TeamMemberCard }) {
  const chip = experienceChip(member.activeSince);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-navy-800 transition-[transform,border-color] duration-200 ease-brand hover:-translate-y-1 hover:border-lime-400/40">
      <div className="relative">
        <div className="h-[260px] w-full overflow-hidden">
          <SanityImg
            image={member.photo}
            width={400}
            height={260}
            placeholderLabel={`Portret — ${member.role ?? member.name ?? "teamlid"}`}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        {chip && (
          <span className="absolute left-3.5 top-3.5 rounded-full border border-white/14 bg-[rgba(9,18,37,0.85)] px-3.5 py-1.5 text-[13px] font-bold text-lime-400 backdrop-blur-[8px]">
            {chip}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 px-6 pb-6 pt-[22px]">
        <span aria-hidden="true" className="h-1 w-11 rounded-full bg-lime-400" />
        <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-white lg:text-[19px]">
          {member.name}
        </h3>
        {member.role && (
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-lime-400">
            {member.role}
          </p>
        )}
        {member.bio && (
          <p className="text-sm leading-normal text-navy-300">{member.bio}</p>
        )}
      </div>
    </article>
  );
}

function TeamGroup({
  label,
  members,
}: {
  label: string;
  members: TeamMemberCard[];
}) {
  if (members.length === 0) return null;
  return (
    <div className="flex flex-col gap-[18px]">
      <Reveal>
        <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-navy-300">
          {label}
        </h3>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member, index) => (
          <Reveal key={member._id} delay={index * 70} className="h-full">
            <TeamCard member={member} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** Team (artboard 4c): trainers & bestuur met ervaring-chips. */
export function TeamSection({ section }: { section: TeamData }) {
  return (
    <section className="bg-navy-900 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 lg:gap-11 lg:px-20">
        <Reveal className="flex flex-col items-start gap-4">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
        </Reveal>

        <TeamGroup label="Trainers" members={section.trainers ?? []} />
        <TeamGroup label="Bestuur" members={section.board ?? []} />
      </div>
    </section>
  );
}
