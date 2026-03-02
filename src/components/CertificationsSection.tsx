import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Award, Cloud, Palette, Code, Trophy, LayoutGrid, Medal } from "lucide-react";
import { CertificationModal } from "./CertificationModal";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

const categoryMeta = {
  linkedin: {
    label: "LinkedIn",
    issuer: "LinkedIn Learning",
    badge: "Certificate",
    color: "secondary",
    icon: Palette,
    description: "Certificates and skill badges completed on LinkedIn Learning.",
  },
  coursera: {
    label: "Coursera",
    issuer: "Coursera",
    badge: "Certificate",
    color: "primary",
    icon: Cloud,
    description: "Coursera courses and specializations you finished.",
  },
  hackathon: {
    label: "Hackathon",
    issuer: "Hackathon",
    badge: "Participation",
    color: "primary",
    icon: Trophy,
    description: "Hackathon participation and winner certificates.",
  },
  workshop: {
    label: "Workshop",
    issuer: "Workshop",
    badge: "Participation",
    color: "accent",
    icon: Code,
    description: "Workshops or bootcamps you attended.",
  },
  meetings: {
    label: "Meetings",
    issuer: "Meetups",
    badge: "Participation",
    color: "secondary",
    icon: Medal,
    description: "Community meetups or talks you joined.",
  },
  other: {
    label: "Other",
    issuer: "Certificate",
    badge: "Certificate",
    color: "primary",
    icon: Award,
    description: "Miscellaneous certificates.",
  },
} as const;

type CategoryKey = keyof typeof categoryMeta;

type Certification = {
  title: string;
  issuer: string;
  badge: string;
  icon: LucideIcon;
  color: string;
  description: string;
  image: string;
  link: string;
  date: string;
  category: CategoryKey;
};

GlobalWorkerOptions.workerSrc = pdfWorker;

const pdfThumbnailCache = new Map<string, string>();

const PdfThumbnail = ({ src, alt }: { src: string; alt: string }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(
    pdfThumbnailCache.get(src) ?? null
  );

  useEffect(() => {
    if (thumbnail) return;
    let cancelled = false;

    const renderThumbnail = async () => {
      try {
        const loadingTask = getDocument({
          url: src,
          disableRange: true,
          disableStream: true,
        });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const targetWidth = 320;
        const scale = targetWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
        const dataUrl = canvas.toDataURL("image/png");
        pdfThumbnailCache.set(src, dataUrl);
        if (!cancelled) setThumbnail(dataUrl);
      } catch (error) {
        if (!cancelled) setThumbnail(null);
      }
    };

    renderThumbnail();

    return () => {
      cancelled = true;
    };
  }, [src, thumbnail]);

  if (thumbnail) {
    return (
      <img
        src={thumbnail}
        alt={alt}
        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
      Loading preview…
    </div>
  );
};

const certificateImports = import.meta.glob<string>(
  "../assets/certificates/**/*.{png,jpg,jpeg,webp,pdf}",
  { eager: true, import: "default" }
);

const formatTitle = (fileName: string) => {
  const name = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/^CertificateOfCompletion_/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return name;
};

const deriveCategoryKey = (path: string): CategoryKey => {
  const segments = path.split("/");
  const certIndex = segments.findIndex((segment) => segment === "certificates");
  const first = segments[certIndex + 1];
  const second = segments[certIndex + 2];
  const candidate = first === "participation" ? second : first;
  
  // Normalize the candidate to match category keys (lowercase, remove spaces)
  const normalizedCandidate = candidate?.toLowerCase().replace(/\s+/g, "");
  
  // Check if the normalized candidate matches or starts with any category key
  if (normalizedCandidate) {
    for (const key in categoryMeta) {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, "");
      if (normalizedCandidate === normalizedKey || normalizedCandidate.startsWith(normalizedKey)) {
        return key as CategoryKey;
      }
    }
  }
  
  return "other";
};

const patentInfo = {
  title: "IoT Weather Monitoring System",
  applicationNo: "202411XXXXXX",
  status: "Filed",
  year: "2024",
  image: "/patent/IOT-Weather-Monitoring-Patent.pdf",
  link: "/patent/IOT-Weather-Monitoring-Patent.pdf",
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const CertificationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const derivedCertifications = useMemo(() => {
    return Object.entries(certificateImports).map(([path, image]) => {
      const category = deriveCategoryKey(path);
      const meta = categoryMeta[category];
      const fileName = path.split("/").pop() ?? "Certificate";

      return {
        title: formatTitle(fileName),
        issuer: meta.issuer,
        badge: meta.badge,
        icon: meta.icon,
        color: meta.color,
        description: meta.description,
        image,
        link: image,
        date: new Date().getFullYear().toString(),
        category,
      };
    });
  }, []);

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showMore, setShowMore] = useState(false);
  const certItemsPerPage = 12;

  const categories = useMemo(() => {
    const unique = new Set<CategoryKey>();
    derivedCertifications.forEach((cert) => unique.add(cert.category));

    return [
      { key: "all", label: "All" },
      ...Array.from(unique).map((key) => ({
        key,
        label: categoryMeta[key]?.label ?? formatTitle(key),
      })),
    ];
  }, [derivedCertifications]);

  const filteredCertifications = useMemo(() => {
    if (activeCategory === "all") {
      return shuffleArray(derivedCertifications);
    }
    return derivedCertifications.filter((cert) => cert.category === activeCategory);
  }, [activeCategory, derivedCertifications]);

  const displayedCertifications = useMemo(() => {
    if (showMore) return filteredCertifications;
    return filteredCertifications.slice(0, certItemsPerPage);
  }, [filteredCertifications, showMore]);

  const openModal = (cert: Certification) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCert(null);
  };

  const totalCertifications = derivedCertifications.length + 1; // +certs +1 for patent


  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />

      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">ACHIEVEMENTS</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Certifications & <span className="gradient-text">Awards</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6" />
          
          {/* Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card"
          >
            <Award className="text-gold" size={24} />
            <span className="font-heading text-2xl font-bold text-foreground">{totalCertifications}</span>
            <span className="text-muted-foreground">Certifications & Awards</span>
          </motion.div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card px-4 py-3 mb-10 flex flex-wrap items-center gap-2"
        >
          <div className="inline-flex items-center gap-2 text-muted-foreground mr-2">
            <LayoutGrid size={18} />
            <span className="text-sm font-medium">Browse by category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                  activeCategory === category.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-foreground/80 border-border hover:border-primary/60"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            Showing {filteredCertifications.length} of {derivedCertifications.length}
          </span>
        </motion.div>

        {/* Patent Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div
            className="glass-card p-8 border-2 border-gold/50 glow-cyan relative overflow-hidden cursor-pointer hover:border-gold transition-colors"
            onClick={() => openModal({
              title: patentInfo.title,
              issuer: "Indian Patent Office",
              badge: "PATENT FILED",
              description: `A patented IoT-based weather monitoring system that provides real-time environmental data through cloud integration. Application No: ${patentInfo.applicationNo}`,
              icon: Award,
              color: "gold",
              image: patentInfo.image,
              link: patentInfo.link,
              date: patentInfo.year,
              category: "other",
            })}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center shrink-0">
                <Award size={40} className="text-gold-foreground" />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-bold">
                    PATENT FILED
                  </span>
                  <span className="text-gold text-sm font-medium">{patentInfo.year}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  {patentInfo.title}
                </h3>
                <p className="text-muted-foreground">
                  Application No: <span className="text-primary">{patentInfo.applicationNo}</span>
                </p>
                <p className="text-sm text-primary mt-2">Click to view details →</p>
              </div>
              
              <div className="shrink-0">
                <span className="px-4 py-2 rounded-lg bg-gold/20 text-gold font-semibold">
                  {patentInfo.status}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {displayedCertifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="glass-card p-4 hover-glow group cursor-pointer"
              onClick={() => openModal(cert)}
            >
              {cert.image && (
                <div className="mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                  {cert.image.toLowerCase().endsWith(".pdf") ? (
                    <PdfThumbnail src={cert.image} alt={cert.title} />
                  ) : (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${cert.color}/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <cert.icon size={20} className={`text-${cert.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <h3 className="font-heading text-sm font-bold text-foreground">
                      {cert.title}
                    </h3>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium bg-${cert.color}/20 text-${cert.color}`}>
                      {cert.badge}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground capitalize">
                      {cert.category}
                    </span>
                  </div>
                  <p className="text-primary text-sm mb-2">{cert.issuer}</p>
                  <p className="text-muted-foreground text-sm line-clamp-2">{cert.description}</p>
                  <p className="text-sm text-primary mt-2">Click to view details →</p>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredCertifications.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              Add certificates to src/assets/certificates to see them here.
            </div>
          )}
        </div>

        {filteredCertifications.length > certItemsPerPage && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowMore(!showMore)}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              {showMore ? "Show Less" : "Load More Certificates"}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <CertificationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        certification={selectedCert}
      />
    </section>
  );
};