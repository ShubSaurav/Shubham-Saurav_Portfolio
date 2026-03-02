import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Download, Mail, Folder, Github, Linkedin } from "lucide-react";

const floatingIcons = [
  { icon: "⚛️", delay: 0, x: "10%", y: "20%" },
  { icon: "☕", delay: 0.2, x: "85%", y: "15%" },
  { icon: "🔌", delay: 0.4, x: "15%", y: "70%" },
  { icon: "🔧", delay: 0.6, x: "80%", y: "65%" },
  { icon: "☁️", delay: 0.8, x: "50%", y: "10%" },
  { icon: "📡", delay: 1, x: "90%", y: "40%" },
];

const PROFILE_IMAGE = import.meta.env.VITE_PROFILE_IMAGE || "/profile-pic/shub.jpeg";
const FALLBACK_IMAGE = "https://placehold.co/400x400?text=Add+profile.jpg";
const localResumeFiles = import.meta.glob("../assets/resume/*.pdf", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const LOCAL_RESUME_URL = Object.values(localResumeFiles)[0] || "";
const RESUME_URL = import.meta.env.VITE_RESUME_URL || LOCAL_RESUME_URL;

export const HeroSection = () => {
  const [profileSrc, setProfileSrc] = useState(PROFILE_IMAGE);
  const [usingFallback, setUsingFallback] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse animation-delay-400" />

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: item.delay + 0.5, duration: 0.5 }}
          className="absolute text-3xl md:text-4xl animate-float hidden md:block"
          style={{ left: item.x, top: item.y }}
        >
          {item.icon}
        </motion.div>
      ))}

      <div className="container-custom relative z-10 text-center px-4">
        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
            <div className="absolute inset-1 rounded-full bg-background" />
            <img
              src={profileSrc}
              alt="Shubham Saurav"
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full object-cover border-2 border-primary/50"
              onError={() => {
                if (!usingFallback) {
                  setUsingFallback(true);
                  setProfileSrc(FALLBACK_IMAGE);
                }
              }}
            />
            {/* Online Status */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-background" />
          </div>
          {usingFallback && (
            <p className="mt-3 text-xs text-muted-foreground">
              Drop your photo as profile.jpg in public/profile-pic/ to replace the placeholder.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4"
        >
          <span className="inline-block px-4 py-2 rounded-full glass-card text-primary text-sm font-medium">
            👋 Welcome to my portfolio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          <span className="text-foreground">I'm </span>
          <span className="gradient-text">Shubham Saurav</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-6 h-10"
        >
          <TypeAnimation
            sequence={[
              "Full-Stack Developer (MERN)",
              2000,
              "IoT & Embedded Systems Engineer",
              2000,
              "Problem Solver | Tech Innovator",
              2000,
              "Future Software Engineer",
              2000,
            ]}
            repeat={Infinity}
            className="text-primary"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Building intelligent systems—from cloud to circuits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a href="#projects" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Folder size={20} />
            View Projects
          </a>
          <a
            href={RESUME_URL || "#"}
            download
            className="btn-outline flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Download size={20} />
            Download Resume
          </a>
          <a href="#contact" className="btn-outline flex items-center gap-2 w-full sm:w-auto justify-center">
            <Mail size={20} />
            Contact Me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Linkedin size={24} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
