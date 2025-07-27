"use client"

import { useState } from "react"

function PaintCard({ image, alt, title, description, index }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image || `/placeholder.svg?height=300&width=300&text=${title}`}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-90 leading-relaxed">{description}</p>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {title}
      </div>
    </div>
  )
}

function PaintCategory() {
  const paintCategories = [
    {
      image: "/src/assets/paintcategory/primer.jpg",
      alt: "Primer",
      title: "Primer",
      description: "Enhances paint adhesion, seals surfaces, and ensures a smooth, long-lasting finish.",
    },
    {
      image: "/src/assets/paintcategory/emulsion.jpg",
      alt: "Emulsion",
      title: "Emulsion",
      description: "Water-based paint offering smooth finish, quick drying, and low odor—ideal for interior walls.",
    },
    {
      image: "/src/assets/paintcategory/distemper.jpeg",
      alt: "Distemper",
      title: "Distemper",
      description: "Traditional, economical paint for interior walls—provides matte finish with decent coverage.",
    },
    {
      image: "/src/assets/paintcategory/metalandwood.jpg",
      alt: "Metal & Wood Primer",
      title: "Metal & Wood Primer",
      description:
        "Protects surfaces from rust and decay while improving paint adhesion on metal and wooden substrates.",
    },
    {
      image: "/src/assets/paintcategory/metal.jpg",
      alt: "Metal & Wood Enamel",
      title: "Metal & Wood Enamel",
      description: "Durable, glossy finish that protects and beautifies metal and wooden surfaces.",
    },
    {
      image: "/src/assets/paintcategory/aluminium.jpg",
      alt: "Aluminium Paints",
      title: "Aluminium Paints",
      description:
        "Reflective, metallic finish that protects against corrosion and UV damage, ideal for metal surfaces.",
    },
    {
      image: "/src/assets/paintcategory/silver.jpg",
      alt: "Silver/Copper/Gold Color",
      title: "Silver/Copper/Gold Color",
      description:
        "Add luxurious metallic sheen to any surface, offering reflective finish with long-lasting protection.",
    },
  ]

  const handleSeeMoreClick = () => {
    window.scrollTo(0, 0)
  }

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            Paint <span className="text-red-500 font-normal">Category</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Explore Paint Company's premium range of paints and coatings—designed for lasting durability and stunning
            aesthetics. Discover the perfect color solution for your project.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paintCategories.map((category, idx) => (
            <PaintCard key={idx} {...category} index={idx} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleSeeMoreClick}
            className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            See More
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaintCategory
