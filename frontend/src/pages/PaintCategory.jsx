"use client"

import { useState } from "react"

import primer from "../assets/paintcategory/primer.jpg"
import emulsion from "../assets/paintcategory/emulsion.png"
import distemper from "../assets/paintcategory/distemper.png"
import metalAndWood from "../assets/paintcategory/wood.png"
import metal from "../assets/paintcategory/metal.png"
import aluminium from "../assets/paintcategory/aluminium.png"
import silver from "../assets/paintcategory/silver.png"

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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-90 leading-relaxed">{description}</p>
      </div>

      {/* Top label */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {title}
      </div>
    </div>
  )
}

function PaintCategory() {
  const paintCategories = [
    {
      image: primer,
      alt: "Primer",
      title: "Primer",
      description: "Enhances paint adhesion, seals surfaces, and ensures a smooth, long-lasting finish.",
    },
    {
      image: emulsion,
      alt: "Emulsion",
      title: "Emulsion",
      description: "Water-based paint offering smooth finish, quick drying, and low odor—ideal for interior walls.",
    },
    {
      image: distemper,
      alt: "Distemper",
      title: "Distemper",
      description: "Traditional, economical paint for interior walls—provides matte finish with decent coverage.",
    },
    {
      image: metalAndWood,
      alt: "Metal & Wood Primer",
      title: "Metal & Wood Primer",
      description: "Protects surfaces from rust and decay while improving paint adhesion on metal and wooden substrates.",
    },
    {
      image: metal,
      alt: "Metal & Wood Enamel",
      title: "Metal & Wood Enamel",
      description: "Durable, glossy finish that protects and beautifies metal and wooden surfaces.",
    },
    {
      image: aluminium,
      alt: "Aluminium Paints",
      title: "Aluminium Paints",
      description: "Reflective, metallic finish that protects against corrosion and UV damage, ideal for metal surfaces.",
    },
    {
      image: silver,
      alt: "Silver/Copper/Gold Color",
      title: "Silver/Copper/Gold Color",
      description: "Add luxurious metallic sheen to any surface, offering reflective finish with long-lasting protection.",
    },
  ]

  const handleSeeMoreClick = () => {
    // For your actual app, use: const navigate = useNavigate(); navigate('/products');
    // For now using window.location as fallback
    window.location.href = '/products'
  }

  // Split categories into two rows: first 3 and remaining 4
  const firstRow = paintCategories.slice(0, 3)
  const secondRow = paintCategories.slice(3)

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            Paint <span className="text-red-500 font-normal">Category</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Explore Paint Company's premium range of paints and coatings—designed for lasting durability and stunning
            aesthetics. Discover the perfect color solution for your project.
          </p>
        </div>

        {/* Categories Grid - Custom Layout */}
        <div className="mb-16">
          {/* First Row - 3 items on laptop and bigger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {firstRow.map((category, idx) => (
              <PaintCard key={idx} {...category} index={idx} />
            ))}
          </div>

          {/* Second Row - 4 items on laptop and bigger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondRow.map((category, idx) => (
              <PaintCard key={idx + 3} {...category} index={idx + 3} />
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
            Ready to explore our complete range?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our comprehensive product catalog to find the perfect paint solution for your next project.
          </p>
          <button
            onClick={handleSeeMoreClick}
            className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-1"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaintCategory