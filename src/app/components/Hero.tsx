import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: "Fabella Coffee",
    subtitle: "Crafted with Precision",
    description: "Experience the finest specialty coffee, roasted to perfection",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3Mzg3MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Fresh Pastries",
    subtitle: "Baked Daily",
    description: "Indulge in our artisanal pastries and baked goods",
    image: "https://images.unsplash.com/photo-1613559724083-359907cb5cb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Gourmet Menu",
    subtitle: "All Day Dining",
    description: "Explore our carefully curated food menu",
    image: "https://images.unsplash.com/photo-1545418314-7ce0b9b53901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3Mzg3MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] bg-black text-white overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
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
              <button className="px-10 py-4 bg-white text-black hover:bg-white/90 transition-all rounded-full shadow-xl hover:shadow-2xl hover:scale-105">
                Explore Menu
              </button>
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
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
