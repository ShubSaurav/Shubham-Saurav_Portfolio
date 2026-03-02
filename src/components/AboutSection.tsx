import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Award, Users, Code } from "lucide-react";

const ABOUT_IMAGE = import.meta.env.VITE_ABOUT_IMAGE || "/gallery/about%20me/winning.jpeg";

const stats = [
  { icon: Code, value: "15+", label: "Projects Built" },
  { icon: Award, value: "1", label: "Patent Filed" },
  { icon: Users, value: "5+", label: "Hackathons" },
  { icon: Rocket, value: "MERN + IoT", label: "Tech Stack" },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />

      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">WHO I AM</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image/Avatar area */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-[3/4] rounded-2xl glass-card p-2 glow-cyan">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src={ABOUT_IMAGE}
                    alt="Shubham Saurav"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="rounded-xl bg-background/70 backdrop-blur-md border border-white/10 px-4 py-3 text-center">
                      <h3 className="font-heading text-2xl font-bold text-foreground mb-1">Shubham Saurav</h3>
                      <p className="text-primary">CSE Student • Developer • Innovator</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/30 rounded-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-secondary/30 rounded-2xl" />
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am a Computer Science Engineering student (2023–2027) driven by a passion for building intelligent systems that seamlessly connect software, hardware, and artificial intelligence.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              As a Full-Stack Developer, IoT Engineer, and AI enthusiast, I focus on creating end-to-end solutions that are not only technically strong but creatively distinct. I believe every product should stand out in the market — through thoughtful design, smart features, and meaningful user impact. My approach combines innovation, structured problem-solving, and continuous refinement to ensure that what I build is unique, scalable, and future-ready.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I am a disciplined, hardworking, and highly focused individual who thrives under challenges. I invest time in understanding problems deeply, experimenting with ideas creatively, and executing solutions with precision. My goal is not just to develop systems — but to craft intelligent, impactful, and differentiated experiences.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              With a professional background in Graphic Design, I naturally integrate visual clarity, user experience, and product thinking into my technical work — ensuring that every solution is powerful, intuitive, and market-ready.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {["React", "Node.js", "MongoDB", "ESP32", "Java", "Python"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full glass-card text-sm text-primary border border-primary/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="glass-card p-6 text-center hover-glow group"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </h4>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
