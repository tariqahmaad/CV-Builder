"use client";

import { Page, Text, View, Document, StyleSheet, Link, Font } from "@react-pdf/renderer";
import { CVData } from "@/lib/types";

// Register Carlito font - metrically compatible with Calibri (open source from Google)
Font.register({
  family: 'Carlito',
  fonts: [
    { src: 'https://raw.githubusercontent.com/googlefonts/carlito/main/fonts/ttf/Carlito-Regular.ttf' },
    { src: 'https://raw.githubusercontent.com/googlefonts/carlito/main/fonts/ttf/Carlito-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://raw.githubusercontent.com/googlefonts/carlito/main/fonts/ttf/Carlito-Italic.ttf', fontStyle: 'italic' },
    { src: 'https://raw.githubusercontent.com/googlefonts/carlito/main/fonts/ttf/Carlito-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' }
  ]
});

// Colors matching the user's CV
const NAVY_BLUE = "#1e4d7b";
const TEAL = "#2e7d8a";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Carlito",
    fontSize: 11,
    paddingTop: 36,    // 0.5 inches = 36pt
    paddingBottom: 36, // 0.5 inches = 36pt
    paddingLeft: 36,   // 0.5 inches = 36pt
    paddingRight: 36,  // 0.5 inches = 36pt
    color: "#000000",
    lineHeight: 1.3,   // Matches CVPreview lineHeight: 1.3
  },
  // Section with horizontal line
  section: {
    marginBottom: 16, // Matches mb-4 (16px)
  },
  sectionHeader: {
    marginBottom: 8, // Matches mb-2 (8px)
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Carlito",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4, // Matches mb-1 (4px)
  },
  horizontalLine: {
    borderTopWidth: 0.5, // Thinner to visually match 1px screen line
    borderTopColor: "#000000",
  },
  // Text styles
  paragraph: {
    fontSize: 11,
    marginBottom: 0, // No explicit margin in CVPreview paragraphs
  },
  boldText: {
    fontFamily: "Carlito",
    fontWeight: "bold",
    fontSize: 11,
  },
  // Skills
  skillsSubtitle: {
    fontSize: 11,
    fontFamily: "Carlito",
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 8, // Matches mb-2 (8px)
  },
  bulletRow: {
    flexDirection: "row",
    paddingLeft: 20, // Matches pl-[20pt]
    marginBottom: 0, 
  },
  bullet: {
    width: 12,
    fontSize: 11,
  },
  bulletText: {
    fontSize: 11,
    flex: 1,
  },
  // Table Row for items
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0, // No explicit margin in CVPreview flex rows
  },
  tableLeft: {
    fontSize: 11,
    fontFamily: "Carlito",
    fontWeight: "bold",
    maxWidth: "75%",
  },
  tableRight: {
    fontSize: 11,
    fontFamily: "Carlito",
    fontWeight: "bold",
    textAlign: "right",
  },
  itemContainer: {
    marginBottom: 12, // Matches mb-3 (12px)
  },
  // Languages horizontal
  languagesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 10,
    gap: 32, // Matches gap-8 (32px)
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Skills list container
  skillsList: {
    marginBottom: 12, // Matches mb-3 (12px)
  },
});

interface PDFDocumentProps {
  data: CVData;
}

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.horizontalLine} />
  </View>
);

export function PDFDocument({ data }: PDFDocumentProps) {
  const { personalInfo, experience, education, projects, achievements, languages, skills } = data;

  const technicalSkills = skills.filter(s => !s.category || s.category === 'technical');
  const professionalSkills = skills.filter(s => s.category === 'professional');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ========== DECORATIVE BLUE BAR ========== */}
        {/* Matches h-[15px] -mx-[40px] -mt-[20px] mb-4 */}
        <View style={{ 
          backgroundColor: NAVY_BLUE, 
          height: 15, // Matches h-[15px]
          marginBottom: 16 // Matches mb-4 (16px)
        }} />

        {/* ========== HEADER (Below blue bar, on white) ========== */}
        <View style={{ textAlign: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 28, fontFamily: "Carlito", fontWeight: "bold", color: "#000000", marginBottom: 4, textAlign: "center", lineHeight: 1.3 }}>
            {personalInfo.fullName || "Your Name"}
          </Text>
          {personalInfo.address && <Text style={{ fontSize: 11, textAlign: "center", marginBottom: 4 }}>{personalInfo.address}</Text>}
          <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
            {personalInfo.phone && <Text style={{ fontSize: 11 }}>{personalInfo.phone}</Text>}
            {personalInfo.email && (
              <>
                <Text style={{ fontSize: 11 }}> | </Text>
                <Link src={`mailto:${personalInfo.email}`} style={{ fontSize: 11, color: TEAL, textDecoration: "underline" }}>{personalInfo.email}</Link>
              </>
            )}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
            {personalInfo.linkedin && (
              <Link src={personalInfo.linkedin} style={{ fontSize: 11, color: TEAL, textDecoration: "underline" }}>LinkedIn Profile</Link>
            )}
            {personalInfo.github && (
              <>
                <Text style={{ fontSize: 11 }}> | </Text>
                <Link src={personalInfo.github} style={{ fontSize: 11, color: TEAL, textDecoration: "underline" }}>GitHub</Link>
              </>
            )}
            {personalInfo.website && (
              <>
                <Text style={{ fontSize: 11 }}> | </Text>
                <Link src={personalInfo.website} style={{ fontSize: 11, color: TEAL, textDecoration: "underline" }}>Portfolio</Link>
              </>
            )}
          </View>
        </View>

        {/* ========== CAREER OBJECTIVE ========== */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <SectionHeader title="Career Objective" />
            <Text style={styles.paragraph}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* ========== KEY SKILLS ========== */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Key Skills" />
            
            {/* Technical Skills */}
            {technicalSkills.length > 0 && (
              <>
                <Text style={[styles.skillsSubtitle, { marginTop: 8 }]}>Technical skills:</Text>
                {technicalSkills.map(skill => (
                  <View key={skill.id} style={[styles.bulletRow, { marginBottom: 4 }]}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      {skill.description ? (
                        <>
                           <Text style={{ fontFamily: "Carlito", fontWeight: "bold" }}>{skill.name}:</Text><Text style={{ fontFamily: "Carlito" }}> {skill.description}</Text>
                        </>
                      ) : skill.name.includes(':') ? (
                        <>
                           <Text style={{ fontFamily: "Carlito", fontWeight: "bold" }}>{skill.name.split(':')[0]}:</Text><Text style={{ fontFamily: "Carlito" }}>{skill.name.split(':').slice(1).join(':')}</Text>
                        </>
                      ) : (
                         <Text style={{ fontFamily: "Carlito", fontWeight: "bold" }}>{skill.name}</Text>
                      )}
                    </Text>
                  </View>
                ))}
              </>
            )}

            {/* Professional Attributes */}
            {professionalSkills.length > 0 && (
              <>
                <Text style={[styles.skillsSubtitle, { marginTop: technicalSkills.length > 0 ? 8 : 8 }]}>Professional Attributes:</Text>
                {professionalSkills.map(skill => (
                  <View key={skill.id} style={[styles.bulletRow, { marginBottom: 4 }]}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      {skill.description ? (
                        <>
                           <Text style={{ fontFamily: "Carlito", fontWeight: "bold" }}>{skill.name}:</Text><Text style={{ fontFamily: "Carlito" }}> {skill.description}</Text>
                        </>
                      ) : skill.name.includes(':') ? (
                        <>
                           <Text style={{ fontFamily: "Carlito", fontWeight: "bold" }}>{skill.name.split(':')[0]}:</Text><Text style={{ fontFamily: "Carlito" }}>{skill.name.split(':').slice(1).join(':')}</Text>
                        </>
                      ) : (
                         <Text style={{ fontFamily: "Carlito", fontWeight: "bold" }}>{skill.name}</Text>
                      )}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* ========== PROJECTS ========== */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Projects" />
            {projects.map(proj => (
              <View key={proj.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>{proj.title}</Text>
                  <Text style={styles.tableRight}>{proj.date}</Text>
                </View>
                {proj.techStack && (
                  <Text style={styles.paragraph}>
                    <Text style={{ fontFamily: "Carlito", fontWeight: "bold" }}>Skill:</Text> {proj.techStack}
                  </Text>
                )}
                <Text style={styles.paragraph}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ========== ACHIEVEMENTS ========== */}
        {achievements.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Achievements" />
            {achievements.map(ach => (
              <View key={ach.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>{ach.title}</Text>
                  <Text style={styles.tableRight}>{ach.date}</Text>
                </View>
                <Text style={{ fontSize: 11 }}>{ach.organization}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ========== RELEVANT EXPERIENCE ========== */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Relevant Experience" />
            {experience.map(job => (
              <View key={job.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>
                    {job.role}{job.company ? ` at ${job.company}` : ""}
                  </Text>
                  <Text style={styles.tableRight}>
                    {
                      [job.startDate, job.endDate || (job.current ? "Present" : "")].filter(Boolean).join(" – ")
                    }
                  </Text>
                </View>
                {job.description && job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{line.replace(/^[-•]\s*/, '')}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ========== EDUCATION AND CERTIFICATION ========== */}
        {education.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Education and Certification" />
            {education.map(edu => (
              <View key={edu.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>{edu.degree}</Text>
                  <Text style={styles.tableRight}>
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                  </Text>
                </View>
                <Text style={{ fontSize: 11 }}>{edu.school}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ========== LANGUAGES (Horizontal) ========== */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Language(s)" />
            <View style={styles.languagesRow}>
              {languages.map(lang => (
                <View key={lang.id} style={styles.languageItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={{ fontSize: 11 }}>
                    {lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ========== REFERENCES ========== */}
        <View style={styles.section}>
          <SectionHeader title="References" />
          <View style={[styles.bulletRow, { paddingLeft: 10 }]}>
            <Text style={styles.bullet}>•</Text>
            <Text style={{ fontSize: 11 }}>Available upon request.</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
