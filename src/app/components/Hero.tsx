import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Hero() {
  const { settings } = useApp();
  const slides = settings.heroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Clamp currentSlide if slides were removed
  const safeIndex = Math.min(currentSlide, slides.length - 1);

  return (
    <div className="relative h-[600px] bg-black text-white overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === safeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10" />

          <div className="relative z-20 h-full flex items-center justify-center px-8">
            <div className="text-center max-w-3xl">
              <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-80">{slide.subtitle}</p>
              <h1 className="text-7xl mb-6 tracking-tight">{slide.title}</h1>
              <p className="text-xl opacity-90 mb-8">{slide.description}</p>
              <a
                href="#coffee"
                className="inline-block px-10 py-4 bg-white text-black hover:bg-white/90 transition-all rounded-full shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Explore Menu
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-2 hover:bg-white/10 transition-colors rounded-full"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-2 hover:bg-white/10 transition-colors rounded-full"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === safeIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
