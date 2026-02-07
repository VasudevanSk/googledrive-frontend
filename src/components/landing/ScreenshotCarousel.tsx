import React, { useEffect, useState } from 'react';
import dashboardPreview from '@/assets/screenshots/dashboard-preview.png';
import loginPreview from '@/assets/screenshots/login-preview.png';
import uploadPreview from '@/assets/screenshots/upload-preview.png';
import registerPreview from '@/assets/screenshots/register-preview.png';

const screenshots = [
  {
    src: dashboardPreview,
    title: 'Dashboard',
    description: 'Organize all your files and folders in one place',
  },
  {
    src: loginPreview,
    title: 'Secure Login',
    description: 'Enterprise-grade authentication to protect your data',
  },
  {
    src: uploadPreview,
    title: 'Easy Upload',
    description: 'Drag and drop files with real-time progress tracking',
  },
  {
    src: registerPreview,
    title: 'Quick Registration',
    description: 'Create your account in seconds and start storing',
  },
];

const ScreenshotCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            See CloudDrive in Action
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take a tour of our intuitive interface designed for seamless file management
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Screenshots */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border bg-card">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="min-w-full relative"
                >
                  <img
                    src={screenshot.src}
                    alt={screenshot.title}
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay with title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white text-xl font-semibold mb-1">
                      {screenshot.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {screenshot.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail Strip */}
          <div className="hidden md:flex justify-center gap-4 mt-8">
            {screenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={screenshot.src}
                  alt={screenshot.title}
                  className="w-32 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotCarousel;
