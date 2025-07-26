import logo from "../../assets/logo.png"

export default function Header() {
  const ContactItem = ({ iconPath, title, content, link }) => (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-popRed flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="#EF4444"
          stroke="#EF4444"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sm:w-4 sm:h-4"
        >
          <path d={iconPath}></path>
        </svg>
      </div>
      <a href={link} className="flex flex-col">
        <p className="text-gray-800 font-medium text-[10px] sm:text-xs md:text-sm">{title}</p>
        <p className="text-gray-700 text-[9px] sm:text-[10px] md:text-sm break-all">
          {content}
        </p>
      </a>
    </div>
  )

  return (
    <header className="bg-white shadow-md font-lora w-full">
      <div className="flex justify-between items-center px-2 sm:px-4 md:px-8 py-2 w-full">
        <div className="flex-shrink-0">
          <a href="/">
            <img
              src={logo || "/placeholder.svg"}
              alt="Company Logo"
              className="w-12 sm:w-16 md:w-20 h-auto"
            />
          </a>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          <ContactItem
            iconPath="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            title="Call Us"
            content="9800000000"
            link="https://wa.me/9800000000"
          />
          <div className="h-5 sm:h-8 md:h-10 w-px bg-gray-200 flex-shrink-0"></div>
          <ContactItem
            iconPath="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            title="Mail Us"
            content="paintcompany@gmail.com"
            link="mailto:paintcompany@gmail.com"
          />
        </div>
      </div>
    </header>
  )
}