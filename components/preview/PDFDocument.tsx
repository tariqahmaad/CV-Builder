"use client";

import { Page, Text, View, Document, StyleSheet, Link } from "@react-pdf/renderer";
import { CVData } from "@/lib/types";

// Colors matching the user's CV
const NAVY_BLUE = "#1e4d7b";
const TEAL = "#2e7d8a";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 0,
    paddingBottom: 30,
    paddingLeft: 40,
    paddingRight: 40,
    color: "#000000",
    lineHeight: 1.3,
  },
  // Header with blue background
  headerContainer: {
    backgroundColor: NAVY_BLUE,
    textAlign: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginLeft: -40,
    marginRight: -40,
    marginBottom: 15,
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerText: {
    fontSize: 11,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  headerLink: {
    fontSize: 11,
    color: "#87CEEB",
    textDecoration: "underline",
  },
  // Section with horizontal line
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    marginBottom: 2,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  // Text styles
  paragraph: {
    fontSize: 11,
    marginBottom: 4,
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  tealText: {
    fontSize: 11,
    color: "#000000",
  },
  // Skills
  skillsSubtitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: "row",
    paddingLeft: 20,
    marginBottom: 3,
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
    marginBottom: 2,
  },
  tableLeft: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    maxWidth: "75%",
  },
  tableRight: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  itemContainer: {
    marginBottom: 10,
  },
  // Languages horizontal
  languagesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 10,
    gap: 30,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});

interface PDFDocumentProps {
  data: CVData;
}

export function PDFDocument({ data }: PDFDocumentProps) {
  const { personalInfo, experience, education, projects, achievements, languages, skills } = data;

  // Section Header Component
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.horizontalLine} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ========== DECORATIVE BLUE BAR ========== */}
        <View style={{ backgroundColor: NAVY_BLUE, height: 15, marginLeft: -40, marginRight: -40, marginBottom: 15 }} />

        {/* ========== HEADER (Below blue bar, on white) ========== */}
        <View style={{ textAlign: "center", marginBottom: 15 }}>
          <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: "#000000", marginBottom: 4, textAlign: "center" }}>
            {personalInfo.fullName || "Your Name"}
          </Text>
          {personalInfo.address && <Text style={{ fontSize: 11, textAlign: "center", marginBottom: 2 }}>{personalInfo.address}</Text>}
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
            <Text style={styles.skillsSubtitle}>Technical skills:</Text>
            {skills.filter(s => !s.category || s.category === 'technical').map(skill => (
              <View key={skill.id} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>{skill.name}:</Text> {skill.description || ''}
                </Text>
              </View>
            ))}

            {/* Professional Attributes */}
            <Text style={[styles.skillsSubtitle, { marginTop: 8 }]}>Professional Attributes:</Text>
            {skills.filter(s => s.category === 'professional').map(skill => (
              <View key={skill.id} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>{skill.name}:</Text> {skill.description || ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ========== PROJECTS ========== */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Projects" />
            {projects.map(proj => (
              <View key={proj.id} style={styles.itemContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>{proj.title}</Text>
                  <Text style={styles.tableRight}>{proj.date}</Text>
                </View>
                {proj.techStack && (
                  <Text style={styles.paragraph}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>Skill:</Text> {proj.techStack}
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
              <View key={ach.id} style={styles.itemContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>{ach.title}</Text>
                  <Text style={styles.tableRight}>{ach.date}</Text>
                </View>
                <Text style={styles.tealText}>{ach.organization}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ========== RELEVANT EXPERIENCE ========== */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Relevant Experience" />
            {experience.map(job => (
              <View key={job.id} style={styles.itemContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>
                    {job.role}{job.company ? ` at ${job.company}` : ""}
                  </Text>
                  <Text style={styles.tableRight}>
                    {job.startDate} – {job.endDate || (job.current ? "Present" : "")}
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
              <View key={edu.id} style={styles.itemContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>{edu.degree}</Text>
                  <Text style={styles.tableRight}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <Text style={styles.tealText}>{edu.school}</Text>
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
                  <Text style={styles.tealText}>
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
            <Text style={styles.tealText}>Available upon request.</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
