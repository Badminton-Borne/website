import { Eyebrow } from "@/components/ui/Eyebrow";
import { SanityImg } from "@/components/ui/SanityImg";
import { Reveal } from "@/components/fx/Reveal";
import type {
  HonoraryMemberCard,
  HonoraryMembersSection as HonoraryData,
} from "@/sanity/types";

function HonoraryCard({ member }: { member: HonoraryMemberCard }) {
  return (
    <article className="relative flex h-full flex-col gap-[18px] rounded-[20px] bg-lime-400 px-8 pb-8 pt-9 transition-transform duration-200 ease-brand hover:-translate-y-1">
      <span
        aria-hidden="true"
        className="absolute right-7 top-7 text-[22px] leading-none text-navy-900"
      >
        ★
      </span>
      <div className="flex items-center gap-[18px]">
        <div className="h-[92px] w-[92px] flex-none overflow-hidden rounded-full border-4 border-navy-900">
          <SanityImg
            image={member.photo}
            width={92}
            height={92}
            placeholderLabel="Portret"
            className="h-full w-full object-cover"
            sizes="92px"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1 pr-8">
          <h3 className="font-display text-xl font-black uppercase tracking-tight text-navy-900">
            {member.name}
          </h3>
          {member.memberSince && (
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-navy-900">
              Erelid sinds {member.memberSince}
            </p>
          )}
        </div>
      </div>
      <span aria-hidden="true" className="h-1 w-14 rounded-full bg-navy-900" />
      {member.contribution && (
        <p className="text-[15px] font-semibold leading-normal text-navy-900">
          {member.contribution}
        </p>
      )}
    </article>
  );
}

/** Ere-leden (artboard 5a): feestelijke lime kaarten met ronde portretten. */
export function HonoraryMembersSection({ section }: { section: HonoraryData }) {
  const members = section.members ?? [];

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 lg:gap-11 lg:px-20">
        <Reveal className="flex flex-col items-start gap-4">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
          {section.intro && (
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-navy-300 lg:text-[17px]">
              {section.intro}
            </p>
          )}
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-stretch gap-6">
          {members.map((member, index) => (
            <Reveal key={member._id} delay={index * 70} className="h-full">
              <HonoraryCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
