import React, { useState, useEffect } from "react";
import Slider1 from "../assets/Home/Slider1.jpeg";
import Slider2 from "../assets/Home/Slider2.jpeg";
import Slider3 from "../assets/Home/Slider3.jpeg";
import Slider4 from "../assets/Home/Slider4.jpeg";

const Home = () => {
  const carouselImages = [
    {
      src: Slider1,
      alt: "Modern living room with vibrant colors",
    },
    {
      src: Slider2,
      alt: "Cozy bedroom with pastel tones",
    },
    {
      src: Slider3,
      alt: "Decorated home with paintings",
    },
    {
      src: Slider4,
      alt: "Paint cans and supplies",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const prevIndex =
    currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1;
  const nextIndex =
    currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > 50) {
      goToNext();
    } else if (swipeDistance < -50) {
      goToPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleOrderNowClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400?text=Image+Not+Found";
  };

  return (
    <div className="min-h-[90%] bg-white mt-[30px] sm:mt-[50px] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0">
          <div className="w-full lg:w-1/2 lg:pr-8 mb-6 lg:mb-0 text-center lg:text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-6 leading-tight font-Poppins">
              Transform Your <br className="block sm:hidden" />
              Space With Colors
            </h1>
            <p className="text-base sm:text-xl text-black-800 mb-4 sm:mb-8 font-bold font-lora">
              "Premium quality paints designed to
              <br className="hidden sm:block" /> bring your vision to life."
            </p>
            <button
              onClick={handleOrderNowClick}
              className="hidden sm:block bg-red-600 hover:bg-red-700 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-sm transition duration EIA-300 w-full sm:w-auto"
            >
              Order Now
            </button>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div
              className="relative h-[250px] sm:h-[400px] lg:h-[500px] w-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="region"
              aria-label="Image carousel"
            >
              <div className="absolute top-[10%] sm:top-[15%] left-[-5%] sm:left-[-10%] w-[35%] sm:w-[40%] h-[60%] sm:h-[70%] z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transform -rotate-6 opacity-90">
                <img
                  src={carouselImages[prevIndex].src}
                  alt={carouselImages[prevIndex].alt}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="absolute top-0 left-[10%] sm:left-[15%] w-[80%] sm:w-[70%] h-[80%] sm:h-[90%] z-20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-all duration-300">
                <img
                  src={carouselImages[currentIndex].src}
                  alt={carouselImages[currentIndex].alt}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="absolute top-[15%] sm:top-[20%] right-[-5%] sm:right-[-10%] w-[35%] sm:w-[40%] h-[50%] sm:h-[60%] z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transform rotate-6 opacity-90">
                <img
                  src={carouselImages[nextIndex].src}
                  alt={carouselImages[nextIndex].alt}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>

              <button
                onClick={goToPrevious}
                className="hidden sm:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors z-30"
                aria-label="Previous image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="hidden sm:block absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors z-30"
                aria-label="Next image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:hidden">
          <button
            onClick={handleOrderNowClick}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-sm transition duration-300 w-full"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
