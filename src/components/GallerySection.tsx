import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

type GalleryItem = {
  title: string;
  file: string;
  description?: string;
};

const GALLERY_FALLBACK = "https://placehold.co/800x600?text=Add+image+to+public/gallery";

const galleryImports = import.meta.glob<string>(
  "../assets/gallery/*.{png,jpg,jpeg,webp,gif}",
  { eager: true, import: "default" }
);

const formatTitle = (fileName: string) => {
  const name = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return name;
};

const discoverGalleryItems = (): GalleryItem[] => {
  if (Object.keys(galleryImports).length === 0) {
    return [
      { title: "Highlight 1", file: "gallery-1.jpg", description: "Featured moment" },
      { title: "Highlight 2", file: "gallery-2.jpg", description: "Creative work" },
      { title: "Highlight 3", file: "gallery-3.jpg", description: "Project showcase" },
      { title: "Highlight 4", file: "gallery-4.jpg", description: "Memorable moment" },
      { title: "Highlight 5", file: "gallery-5.jpg", description: "Gallery item" },
      { title: "Highlight 6", file: "gallery-6.jpg", description: "Visual story" },
    ];
  }

  const items = Object.entries(galleryImports).map(([path, image], index) => ({
    title: formatTitle(path.split("/").pop() ?? "Image"),
    file: image,
    description: `Featured in gallery`,
  }));
  
  // Sort by file name in reverse order to get latest images first
  return items.sort((a, b) => b.file.localeCompare(a.file));
};

export const GallerySection = () => {
  const galleryItems = useMemo(() => discoverGalleryItems(), []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (galleryItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryItems.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-primary">Gallery</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-2">
              My Creative Moments
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Explore a curated collection of my work and experiences
            </p>
          </div>
        </div>

        {/* Dark Container with Slideshow + Grid */}
        <div 
          className="mt-12 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 p-8 transition-all duration-300"
          style={{
            boxShadow: hoveredCard !== null 
              ? "0 0 50px rgba(59, 130, 246, 0.4)"
              : "0 0 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* SLIDESHOW AT TOP */}
          {galleryItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-72 md:h-96 mb-8 group"
            >
              {/* 3D Container */}
              <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1200px" }}>
                {/* Previous Slide (Left Stack) */}
                <motion.div
                  className="absolute left-0 md:left-8 w-1/4 md:w-1/5 h-3/4 rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-gradient-to-br from-slate-800 to-slate-900"
                  style={{
                    transform: "translateZ(-80px) rotateY(20deg) scale(0.85)",
                    opacity: 0.6,
                  }}
                >
                  <img
                    src={galleryItems[(currentSlide - 1 + galleryItems.length) % galleryItems.length].file}
                    alt="Previous"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Current Slide (Center) */}
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-3/5 md:w-2/5 h-full rounded-2xl overflow-hidden border-2 border-primary shadow-2xl cursor-pointer z-10"
                  onClick={() => setSelectedImage(galleryItems[currentSlide].file)}
                >
                  <img
                    src={galleryItems[currentSlide].file}
                    alt={galleryItems[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-mono">
                    {String(currentSlide + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
                  </div>
                </motion.div>

                {/* Next Slide (Right Stack) */}
                <motion.div
                  className="absolute right-0 md:right-8 w-1/4 md:w-1/5 h-3/4 rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-gradient-to-br from-slate-800 to-slate-900"
                  style={{
                    transform: "translateZ(-80px) rotateY(-20deg) scale(0.85)",
                    opacity: 0.6,
                  }}
                >
                  <img
                    src={galleryItems[(currentSlide + 1) % galleryItems.length].file}
                    alt="Next"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Navigation Buttons */}
                <motion.button
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToPrevious}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary text-white p-3 rounded-full transition shadow-lg"
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToNext}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary text-white p-3 rounded-full transition shadow-lg"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {galleryItems.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-primary w-8 h-3"
                        : "bg-white/40 hover:bg-white/60 w-2 h-2"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8" />

          {/* GRID 4x4 WITH SCROLL */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto overflow-x-hidden pr-2">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.file}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 4) * 0.05 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedImage(item.file)}
                  className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square bg-slate-700/50 border border-slate-700/30"
                >
                  {/* Image */}
                  <img
                    src={item.file}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== GALLERY_FALLBACK) {
                        e.currentTarget.src = GALLERY_FALLBACK;
                      }
                    }}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      hoveredCard === index ? "scale-110" : "scale-100"
                    }`}
                  />

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex items-end p-4"
                  >
                    <div className="w-full">
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/70 text-xs mt-1">Click to view</p>
                    </div>
                  </motion.div>

                  {/* Border highlight on hover */}
                  <div 
                    className="absolute inset-0 rounded-xl border border-primary transition-opacity duration-300"
                    style={{
                      opacity: hoveredCard === index ? 1 : 0,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Scroll gradient indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-transparent rounded-full opacity-50" />
          </div>

          {/* Total Count */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            {galleryItems.length} total photos
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <img
                src={selectedImage}
                alt="Gallery fullscreen"
                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur text-white p-2 rounded-lg transition"
              >
                <span className="text-2xl">✕</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
