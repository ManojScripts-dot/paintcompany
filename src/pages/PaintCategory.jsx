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
    <div className="relative group w-full max-w-[160px] sm:max-w-[200px]">
      <div className="overflow-hidden rounded-lg h-[200px] sm:h-[250px] w-full flex items-center justify-center">
        <img
          src={image || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-80"
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center transform translate-y-1/2">
        <button className="bg-popRed text-white font-medium py-1 px-3 rounded-full transition-all duration-300 text-xs group-hover:opacity-0 group-hover:translate-y-4 shadow-md">
          {title}
        </button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-popRed bg-opacity-85 text-white text-xs px-4 py-4 rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
        <p>{description}</p>
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
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
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
        <div className="relative flex flex-col items-center py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 w-full h-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 md:mb-6">
            Paint <span className="text-black decoration-popRed underline underline-offset-8">Category</span>
          </h1>
          <div className="relative w-full h-full">
            <div className="hidden sm:flex flex-col items-center gap-10 w-full">
              <div className="grid grid-cols-5 gap-8 w-full">
                {paintCategories.slice(0, 5).map((category, idx) => (
                  <PaintCard key={idx} {...category} index={`row1-${idx}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-8 w-full items-center">
                <div className="flex justify-center">
                  <PaintCard {...paintCategories[5]} index="row2-1" />
                </div>
                <div className="text-center">
                  <p className="text-gray-800 mb-4 max-w-xl mx-auto leading-relaxed font-bold text-sm md:text-base">
                    Explore Paint Company's premium range of paints and coatings—designed for lasting durability and stunning aesthetics. Discover the perfect color solution for your home, business, or project.
                  </p>
                  <Link
                    to="/products"
                    onClick={handleSeeMoreClick}
                    className="bg-popRed hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    See More
                  </Link>
                </div>
                <div className="flex justify-center">
                  <PaintCard {...paintCategories[6]} index="row2-2" />
                </div>
              </div>
            </div>
            <div className="sm:hidden w-full">
              <div className="grid grid-cols-2 gap-6 w-full">
                {paintCategories.slice(0, 6).map((category, idx) => (
                  <div key={idx} className="flex justify-center">
                    <PaintCard {...category} index={`mobile-${idx}`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <PaintCard {...paintCategories[6]} index="mobile-last" />
              </div>
              <div className="w-full mt-8 text-center">
                <div className="py-6 px-4 rounded-xl shadow-sm">
                  <p className="text-gray-800 mb-4 max-w-xs mx-auto leading-relaxed font-bold text-xs">
                    Explore Lubro Paints' premium range of paints and coatings—designed for lasting durability and stunning aesthetics. Discover the perfect color solution for your home, business, or project.
                  </p>
                  <Link
                    to="/products"
                    onClick={handleSeeMoreClick}
                    className="bg-popRed hover:bg-red-600 text-white font-medium py-1.5 px-4 rounded-full transition-colors text-xs shadow-md"
                  >
                    See More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaintCategory;