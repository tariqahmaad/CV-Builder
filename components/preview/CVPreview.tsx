"use client";

import { CVData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CVPreviewProps {
  data: CVData;
  className?: string;
  id?: string;
}

// Colors matching your CV
const NAVY_BLUE = "#1e4d7b";
const TEAL = "#2e7d8a";

export function CVPreview({ data, className, id }: CVPreviewProps) {
  const { personalInfo, experience, education, projects, achievements, languages, skills } = data;

  // Section Header Component with horizontal line
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-2">
      <h2 className="text-[13pt] font-bold mb-1 text-black">{title}</h2>
      <hr className="border-t border-black" />
    </div>
  );

  return (
    <div
      id={id}
      className={cn(
        "bg-white text-black px-[40px] py-[20px] shadow-lg min-h-[297mm] w-[210mm] mx-auto box-border",
        "transform origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform",
        className
      )}
      style={{ 
        fontFamily: "Calibri, Arial, sans-serif",
        fontSize: "11pt",
        lineHeight: "1.3",
        color: "#000"
      }}
    >
      {/* ========== DECORATIVE BLUE BAR ========== */}
      <div 
        className="-mx-[40px] -mt-[20px] mb-4 h-[15px]"
        style={{ backgroundColor: NAVY_BLUE }}
      />

      {/* ========== HEADER (Below blue bar, on white) ========== */}
      <div className="text-center mb-4">
        <h1 className="font-bold text-[28pt] leading-tight mb-1 text-black">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.address && (
          <p className="text-[11pt] mb-1">{personalInfo.address}</p>
        )}
        <p className="text-[11pt]">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && (
            <> | <a href={`mailto:${personalInfo.email}`} className="underline" style={{ color: TEAL }}>{personalInfo.email}</a></>
          )}
        </p>
        <p className="text-[11pt]">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" className="underline" style={{ color: TEAL }}>LinkedIn Profile</a>
          )}
          {personalInfo.github && (
            <> | <a href={personalInfo.github} target="_blank" className="underline" style={{ color: TEAL }}>GitHub</a></>
          )}
          {personalInfo.website && (
            <> | <a href={personalInfo.website} target="_blank" className="underline" style={{ color: TEAL }}>Portfolio</a></>
          )}
        </p>
      </div>

      {/* ========== CAREER OBJECTIVE ========== */}
      {personalInfo.summary && (
        <section className="mb-4">
          <SectionHeader title="Career Objective" />
          <p className="text-[11pt]">{personalInfo.summary}</p>
        </section>
      )}

      {/* ========== KEY SKILLS ========== */}
      {skills.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Key Skills" />
          
          {/* Technical Skills */}
          <p className="text-[11pt] font-bold underline mb-2">Technical skills:</p>
          <ul className="pl-[20pt] mb-3">
            {skills.filter(s => !s.category || s.category === 'technical').map(skill => (
              <li key={skill.id} className="flex items-start mb-1 text-[11pt]">
                <span className="mr-2">•</span>
                <span><strong>{skill.name}:</strong> {skill.description || ''}</span>
              </li>
            ))}
          </ul>

          {/* Professional Attributes */}
          <p className="text-[11pt] font-bold underline mb-2">Professional Attributes:</p>
          <ul className="pl-[20pt]">
            {skills.filter(s => s.category === 'professional').map(skill => (
              <li key={skill.id} className="flex items-start mb-1 text-[11pt]">
                <span className="mr-2">•</span>
                <span><strong>{skill.name}:</strong> {skill.description || ''}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ========== PROJECTS ========== */}
      {projects.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Projects" />
          {projects.map(proj => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between text-[11pt]">
                <span className="font-bold">{proj.title}</span>
                <span className="text-right font-bold">{proj.date}</span>
              </div>
              {proj.techStack && (
                <p className="text-[11pt]"><strong>Skill:</strong> {proj.techStack}</p>
              )}
              <p className="text-[11pt]">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ========== ACHIEVEMENTS ========== */}
      {achievements.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Achievements" />
          {achievements.map(ach => (
            <div key={ach.id} className="mb-3">
              <div className="flex justify-between text-[11pt]">
                <span className="font-bold">{ach.title}</span>
                <span className="text-right font-bold">{ach.date}</span>
              </div>
              <p className="text-[11pt] text-black">{ach.organization}</p>
            </div>
          ))}
        </section>
      )}

      {/* ========== RELEVANT EXPERIENCE ========== */}
      {experience.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Relevant Experience" />
          {experience.map(job => (
            <div key={job.id} className="mb-3">
              <div className="flex justify-between text-[11pt]">
                <span className="font-bold">{job.role}{job.company ? ` at ${job.company}` : ""}</span>
                <span className="text-right font-bold">{job.startDate} – {job.endDate || (job.current ? "Present" : "")}</span>
              </div>
              {job.description && (
                <ul className="pl-[20pt]">
                  {job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                    <li key={i} className="flex items-start text-[11pt]">
                      <span className="mr-2">•</span>
                      <span>{line.replace(/^[-•]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ========== EDUCATION AND CERTIFICATION ========== */}
      {education.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Education and Certification" />
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between text-[11pt]">
                <span className="font-bold">{edu.degree}</span>
                <span className="text-right font-bold">{edu.startDate} – {edu.endDate}</span>
              </div>
              <p className="text-[11pt] text-black">{edu.school}</p>
            </div>
          ))}
        </section>
      )}

      {/* ========== LANGUAGES (Horizontal Layout) ========== */}
      {languages.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Language(s)" />
          <div className="flex flex-wrap gap-8 pl-[10pt] text-[11pt]">
            {languages.map(lang => (
              <span key={lang.id} className="flex items-center">
                <span className="mr-2">•</span>
                <span className="text-black">{lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ""}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ========== REFERENCES ========== */}
      <section className="mb-4">
        <SectionHeader title="References" />
        <div className="pl-[10pt] text-[11pt]">
          <span className="flex items-center">
            <span className="mr-2">•</span>
            <span className="text-black">Available upon request.</span>
          </span>
        </div>
      </section>
    </div>
  );
}
