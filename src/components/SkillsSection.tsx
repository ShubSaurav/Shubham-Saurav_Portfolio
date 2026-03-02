import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Import skill icons
import programmingIcon from "../assets/skills/programing.gif";
import webIcon from "../assets/skills/web.gif";
import iotIcon from "../assets/skills/iot.gif";
import toolsIcon from "../assets/skills/tool.gif";
import designIcon from "../assets/skills/design.gif";

const skillCategories = [
  {
    title: "Programming",
    icon: programmingIcon,
    color: "primary",
    skills: ["Java", "C++", "Python", "JavaScript", "SQL"],
  },
  {
    title: "Web & Backend",
    icon: webIcon,
    color: "secondary",
    skills: ["React", "Node.js", "Express", "MongoDB", "MySQL"],
  },
  {
    title: "IoT & Embedded",
    icon: iotIcon,
    color: "accent",
    skills: ["ESP32", "Arduino", "Sensors", "Cloud Integration", "MQTT"],
  },
  {
    title: "Tools",
    icon: toolsIcon,
    color: "primary",
    skills: ["Git", "GitHub", "Docker", "Postman", "Vercel"],
  },
  {
    title: "Design",
    icon: designIcon,
    color: "secondary",
    skills: ["Figma", "CorelDRAW", "Canva", "Illustrator", "UI/UX"],
  },
];

export const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding relative overflow-hidden bg-card/30">
      {/* Background elements */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">WHAT I DO</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="glass-card p-6 hover-glow group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-${category.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <img src={category.icon} alt={category.title} className="w-8 h-8 object-contain" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    className="px-3 py-1.5 rounded-full bg-muted/50 text-foreground text-sm font-medium border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 glass-card p-8"
        >
          <h3 className="font-heading text-2xl font-bold text-center mb-8">
            Proficiency <span className="gradient-text">Levels</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "MERN Stack", level: 85 },
              { name: "IoT & Embedded", level: 80 },
              { name: "Java Programming", level: 75 },
              { name: "Graphic Design", level: 70 },
            ].map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground font-medium">{skill.name}</span>
                  <span className="text-primary">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
