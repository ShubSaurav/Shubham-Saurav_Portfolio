import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink, Award, Folder } from "lucide-react";

// Import project images
import iotImage from "../assets/featured-projects/IOT .jpeg";
import studentPortalImage from "../assets/featured-projects/Student Result Portal 1.jpeg";
import focusMateImage from "../assets/featured-projects/FocusMate.jpeg";
import pomodoroImage from "../assets/featured-projects/Smart Pomodoro Scheduler 1.jpeg";
import lifiImage from "../assets/featured-projects/LIFI Communication System.jpeg";
import fireRobotImage from "../assets/featured-projects/Fire Fighting Robot.jpeg";

const projects = [
  {
    title: "IoT Weather Monitoring System",
    description: "A patented real-time weather monitoring solution using ESP32, multiple sensors, and cloud integration for data visualization.",
    image: iotImage,
    type: "iot", // Project category
    tech: ["ESP32", "React", "Node.js", "MongoDB", "MQTT"],
    features: ["Real-time data", "Cloud dashboard", "Mobile alerts", "Historical analysis"],
    isPatented: true,
    github: "#",
    live: "#",
  },
  {
    title: "Student Result Portal",
    description: "Full-stack web application for managing and displaying student academic results with role-based authentication.",
    image: studentPortalImage,
    type: "web", // Project category
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    features: ["Admin dashboard", "Student portal", "PDF generation", "Secure auth"],
    isPatented: false,
    github: "#",
    live: "#",
  },
  {
    title: "FocusMate - Task Manager",
    description: "A Java-based desktop application for task management with Pomodoro timer integration and productivity tracking.",
    image: focusMateImage,
    type: "web", // Project category
    tech: ["Java", "Swing", "SQLite", "Timer API"],
    features: ["Task scheduling", "Pomodoro timer", "Progress tracking", "Notifications"],
    isPatented: false,
    github: "#",
    live: null,
  },
  {
    title: "Smart Pomodoro System",
    description: "A smart Pomodoro timer application featuring customizable intervals with LCD display and LED indicators.",
    image: pomodoroImage,
    type: "web", // Project category
    tech: ["C++", "LCD", "LED Matrix"],
    features: ["Custom intervals", "Visual feedback", "Break reminders", "Statistics"],
    isPatented: false,
    github: "#",
    live: null,
  },
  {
    title: "Li-Fi Communication System",
    description: "Innovative light-based data transmission system for secure high-speed communication using visible light.",
    image: lifiImage,
    type: "iot", // Project category
    tech: ["Arduino", "LEDs", "Photodiodes", "C++"],
    features: ["High speed", "Secure", "Low interference", "Prototype ready"],
    isPatented: false,
    github: "#",
    live: null,
  },
  {
    title: "Fire-Fighting Robot",
    description: "Autonomous robot capable of detecting and extinguishing fires using sensors and automated response systems.",
    image: fireRobotImage,
    type: "iot", // Project category
    tech: ["Arduino", "Sensors", "Motors", "C++"],
    features: ["Fire detection", "Auto navigation", "Water pump", "Remote control"],
    isPatented: false,
    github: "#",
    live: null,
  },
];

export const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">MY WORK</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6" />
          
          {/* Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card"
          >
            <Folder className="text-primary" size={24} />
            <span className="font-heading text-2xl font-bold text-foreground">{projects.length}+</span>
            <span className="text-muted-foreground">Projects Completed</span>
          </motion.div>

          {/* Category Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)]" />
              <span className="text-sm text-muted-foreground">IoT & Embedded Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
              <span className="text-sm text-muted-foreground">Web Applications</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card overflow-hidden group hover-glow ${
                project.type === "iot" 
                  ? "border-2 border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.3)]" 
                  : "border-2 border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              }`}
            >
              {/* Project Header */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Patent Badge */}
                {project.isPatented && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-bold">
                    <Award size={14} />
                    PATENTED
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                  <a
                    href={project.github}
                    className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Github size={20} />
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded text-xs bg-muted/50 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {project.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="text-xs text-muted-foreground"
                    >
                      • {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
