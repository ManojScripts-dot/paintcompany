import { Link } from "react-router-dom";
import bg from "../assets/paintcategory/bg.png";
import emulsion from "../assets/paintcategory/emulsion.jpg";
import primer from "../assets/paintcategory/primer.jpg";
import distemper from "../assets/paintcategory/distemper.jpeg";
import metalandwood from "../assets/paintcategory/metalandwood.jpg";
import metal from "../assets/paintcategory/metal.jpg";
import aluminum from "../assets/paintcategory/aluminium.jpg";
import silver from "../assets/paintcategory/silver.jpg";

function PaintCard({ image, alt, title, description, index }) {
  return (
    <div className="relative group w-full max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] md:max-w-[180px] mx-auto">
      <div className="overflow-hidden rounded-lg h-[140px] xs:h-[160px] sm:h-[180px] md:h-[200px] w-full flex items-center justify-center">
        <img
          src={image || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-80"
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center transform translate-y-1/2">
        <button className="bg-popRed text-white font-medium py-1 px-2 xs:px-3 rounded-full transition-all duration-300 text-[10px] xs:text-xs group-hover:opacity-0 group-hover:translate-y-4 shadow-md whitespace-nowrap">
          {title}
        </button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-popRed bg-opacity-85 text-white text-[9px] xs:text-[10px] sm:text-xs px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-4 rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
        <p className="text-center leading-tight">{description}</p>
      </div>
    </div>
  );
}

function PaintCategory() {
  const paintCategories = [
    {
      image: primer,
      alt: "Primer",
      title: "Primer",
      description:
        "Primer: Enhances paint adhesion, seals surfaces, and ensures a smooth, long-lasting finish.",
    },
    {
      image: emulsion,
      alt: "Emulsion",
      title: "Emulsion",
      description:
        "Emulsion: A water-based paint offering a smooth finish, quick drying, and low odor—ideal for interior walls and ceilings.",
    },
    {
      image: distemper,
      alt: "Distemper",
      title: "Distemper",
      description:
        "Distemper: A traditional, economical paint for interior walls—provides a matte finish with decent coverage and breathability.",
    },
    {
      image: metalandwood,
      alt: "Metal & Wood Primer",
      title: "Metal & Wood Primer",
      description:
        "Metal & Wood Primer: Protects surfaces from rust and decay while improving paint adhesion on metal and wooden substrates.",
    },
    {
      image: metal,
      alt: "Metal & Wood Enamel",
      title: "Metal & Wood Enamel",
      description: "Metal & Wood Enamel: A durable, glossy finish that protects and beautifies metal and wooden surfaces—resistant to moisture, stains, and wear.",
    },
    {
      image: aluminum,
      alt: "Aluminium Paints",
      title: "Aluminium Paints",
      description:
        "Aluminium Paint: Provides a reflective, metallic finish that protects against corrosion and UV damage, ideal for metal surfaces and outdoor use.",
    },
    {
      image: silver,
      alt: "Silver/Copper/Gold Color",
      title: "Silver/Copper/Gold Color",
      description:
        "Silver/Copper/Gold Paints: Add a luxurious metallic sheen to any surface, offering a reflective finish that enhances aesthetics and provides long-lasting protection.",
    },
  ];

  const handleSeeMoreClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="w-full h-full rounded-none overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        ></div>
        <div className="relative flex flex-col items-center py-4 sm:py-6 md:py-8 px-3 xs:px-4 sm:px-6 md:px-8 w-full">
          {/* Title */}
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
            Paint <span className="text-black decoration-popRed underline underline-offset-4 sm:underline-offset-6 md:underline-offset-8">Category</span>
          </h1>
          
          {/* Desktop & Tablet Layout (sm and above) */}
          <div className="hidden sm:flex flex-col items-center gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl mx-auto">
            {/* First Row - 5 items for large screens, 3 for tablets */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8 w-full justify-items-center">
              {paintCategories.slice(0, 5).map((category, idx) => (
                <div key={idx} className={`${idx >= 3 ? 'hidden md:block' : ''}`}>
                  <PaintCard {...category} index={`row1-${idx}`} />
                </div>
              ))}
            </div>
            
            {/* Second Row - Responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full items-center max-w-5xl mx-auto">
              {/* Left card - hidden on tablets if showing 3 in first row */}
              <div className="hidden md:flex justify-center">
                <PaintCard {...paintCategories[5]} index="row2-1" />
              </div>
              
              {/* Center content */}
              <div className="text-center px-4 sm:px-6">
                <p className="text-gray-800 mb-4 sm:mb-6 max-w-lg mx-auto leading-relaxed font-bold text-sm sm:text-base md:text-lg">
                  Explore Paint Company's premium range of paints and coatings—designed for lasting durability and stunning aesthetics. Discover the perfect color solution for your home, business, or project.
                </p>
                <Link
                  to="/products"
                  onClick={handleSeeMoreClick}
                  className="bg-popRed hover:bg-red-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block"
                >
                  See More
                </Link>
              </div>
              
              {/* Right card - hidden on tablets if showing 3 in first row */}
              <div className="hidden md:flex justify-center">
                <PaintCard {...paintCategories[6]} index="row2-2" />
              </div>
            </div>
            
            {/* Additional row for tablet - show remaining cards */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full justify-items-center md:hidden max-w-md mx-auto">
              <PaintCard {...paintCategories[3]} index="tablet-row2-1" />
              <PaintCard {...paintCategories[4]} index="tablet-row2-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full justify-items-center md:hidden max-w-md mx-auto">
              <PaintCard {...paintCategories[5]} index="tablet-row3-1" />
              <PaintCard {...paintCategories[6]} index="tablet-row3-2" />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden w-full flex flex-col items-center max-w-sm mx-auto">
            {/* Grid of cards - First 6 cards in 2x3 grid */}
            <div className="grid grid-cols-2 gap-3 xs:gap-4 w-full">
              {paintCategories.slice(0, 6).map((category, idx) => (
                <div key={idx} className="flex justify-center">
                  <PaintCard {...category} index={`mobile-${idx}`} />
                </div>
              ))}
            </div>
            
            {/* Last card centered */}
            <div className="flex justify-center mt-3 xs:mt-4 w-full">
              <PaintCard {...paintCategories[6]} index="mobile-last" />
            </div>
            
            {/* Bottom content */}
            <div className="w-full mt-6 xs:mt-8 text-center px-2">
              <div className="py-4 xs:py-6 px-3 xs:px-4">
                <p className="text-gray-800 mb-4 leading-relaxed font-bold text-xs xs:text-sm">
                  Explore Lubro Paints' premium range of paints and coatings—designed for lasting durability and stunning aesthetics. Discover the perfect color solution for your home, business, or project.
                </p>
                <Link
                  to="/products"
                  onClick={handleSeeMoreClick}
                  className="bg-popRed hover:bg-red-600 text-white font-medium py-2 px-4 xs:px-5 rounded-full transition-colors text-xs xs:text-sm shadow-md inline-block"
                >
                  See More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaintCategory;