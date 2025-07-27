import NnE from "./NnE";
import NewArrival from "./NewArrival";

function NewsAndEventsMain() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* News & Events */}
          <div className="space-y-8">
            <NnE />
          </div>

          {/* New Arrival */}
          <div className="space-y-8">
            <NewArrival />
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsAndEventsMain