import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

function PopularRoutes() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/destinations`);
        setDestinations(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="bg-[#f8f6f1] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-bold text-black">
              Popular Destinations
            </h2>

            <p className="mt-5 text-lg text-[#5f6368]">
              Frequently searched commute destinations around Metro Manila.
            </p>
          </div>

          <button className="hidden text-lg font-semibold text-[#f4b400] md:block transition hover:text-black">
            View all →
          </button>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <p className="text-lg font-semibold text-[#5f6368] animate-pulse">
              Loading destinations...
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((place) => (
              <div
                key={place._id}
                className="group overflow-hidden rounded-[32px] border border-[#ece7dc] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#ffe082] to-[#fff4d6]">
                  {place.imageUrl ? (
                    <img
                      src={`${BACKEND_URL}${place.imageUrl}`}
                      alt={place.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  )}

                  <div className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                    Metro Manila
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-3xl font-bold text-black">
                    {place.name}
                  </h3>

                  <p className="mt-4 leading-relaxed text-[#5f6368]">
                    {place.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && destinations.length === 0 && (
          <div className="mt-16 flex justify-center">
            <p className="text-lg text-[#5f6368]">No routes available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularRoutes;
