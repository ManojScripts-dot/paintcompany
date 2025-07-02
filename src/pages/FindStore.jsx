import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

const LocationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl text-center font-bold text-gray-800">
            Find Us
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Visit our store in Itahari
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-800">Address</h3>
                    <p className="text-gray-600">
                      Corporate Office: Itahari-9, Sunsari, Buspark
                    </p>
                    <p className="text-gray-600">
                      Factory: Duhabi-3, Sunsari,Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-800">Phone</h3>
                    <p className="text-gray-600"> +977 9852068305</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">lubropaints@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-2">
                  Get Directions
                </h3>
                <a
                  href="https://www.google.com/maps/dir//Itahari-9+buspark/@26.6623731,87.228269,13z?entry=ttu&g_ep=EgoyMDI1MDQwMi4xIKXMDSoJLDEwMjExNjQwSAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="rounded-lg overflow-hidden h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d7131.131741980732!2d87.26431894226344!3d26.662378957188704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sItahari-9%20buspark!5e0!3m2!1sen!2snp!4v1744011470750!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Itahari-9 Buspark Map"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationPage;
