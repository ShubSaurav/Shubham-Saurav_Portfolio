import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "shubhamsaurav2264@gmail.com",
    href: "mailto:shubhamsaurav2264@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 78700 99934",
    href: "tel:+917870099934",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Mohali, Punjab, India",
    href: "#",
  },
];

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/shubhamsaurav2264@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Portfolio Contact from ${formData.name}`,
          _template: "table",
          _captcha: "false",
          _replyto: formData.email,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || (result && result.success === false)) {
        const errorMessage =
          (result && typeof result.message === "string" && result.message) ||
          "Failed to send message";
        throw new Error(errorMessage);
      }

      if (result && typeof result.message === "string" && result.message.toLowerCase().includes("activate")) {
        throw new Error("Please activate FormSubmit from the confirmation email sent to your inbox first.");
      }

      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I received your message.",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again in a moment.";

      if (message.toLowerCase().includes("activate")) {
        toast({
          title: "Activation required",
          description: "Open your inbox and click the FormSubmit activation link once.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Message not sent",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-card/30">
      {/* Background elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">GET IN TOUCH</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Let's build something impactful together. Whether you have a project idea, 
            collaboration opportunity, or just want to say hi — I'd love to hear from you!
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="glass-card p-4 flex items-center gap-4 hover-glow group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <p className="text-muted-foreground mb-4">Connect on social media</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                  >
                    <social.icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              <div>
                <label className="text-foreground font-medium mb-2 block">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="text-foreground font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="text-foreground font-medium mb-2 block">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all duration-300 resize-none"
                  placeholder="Tell me about your project or just say hi..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
