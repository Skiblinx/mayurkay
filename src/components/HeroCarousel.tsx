
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const slides = [
  {
    id: 1,
    title: "Premium Electronics",
    subtitle: "Discover the latest in technology",
    image: "/placeholder.svg?height=500&width=1200",
    cta: "Shop Electronics"
  },
  {
    id: 2,
    title: "Fashion Forward",
    subtitle: "Style that makes a statement",
    image: "/placeholder.svg?height=500&width=1200",
    cta: "Shop Fashion"
  },
  {
    id: 3,
    title: "Home & Living",
    subtitle: "Transform your living space",
    image: "/placeholder.svg?height=500&width=1200",
    cta: "Shop Home"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full bg-gradient-to-r from-primary/10 to-primary/5 flex items-center">
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                  {slide.subtitle}
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
