import React, { useEffect, useState } from 'react';
import { tourismData, states, cities } from './TempData';

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MountainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const HotelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.618V7.382a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);
const WeatherIcons = {
  Sunny: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.929 5.93m12.728 12.728L18.07 18.07M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Cloudy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  Rainy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  )
};
const TourismWebsite = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [travelTipsOpen, setTravelTipsOpen] = useState(false);
  const [budgetCalculator, setBudgetCalculator] = useState({
    travelers: 1,
    days: 1,
    estimatedCost: 0
  });
  const [userReviews, setUserReviews] = useState({
    destinations: [],
    hotels: []
  });

  useEffect(() => {
    if (selectedCity) {
      const weatherConditions = ['Sunny', 'Cloudy', 'Rainy'];
      setWeather({
        temperature: Math.floor(Math.random() * 30) + 20,
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
      });
    }
  }, [selectedCity]);

  const calculateBudget = () => {
    if (!selectedState || !selectedCity) return;

    const cityData = tourismData[selectedState].cities[selectedCity];
    const averageHotelPrice = cityData.hotels.reduce((sum, hotel) => sum + hotel.pricePerNight, 0) / cityData.hotels.length;
    const averageDestinationCost = cityData.destinations.reduce((sum, dest) => sum + (dest.entranceFee || 0), 0) / cityData.destinations.length;

    const totalCost = (
      (averageHotelPrice * budgetCalculator.days) + 
      (averageDestinationCost * budgetCalculator.days) +
      (500 * budgetCalculator.travelers) 
    );

    setBudgetCalculator(prev => ({
      ...prev,
      estimatedCost: Math.round(totalCost)
    }));
  };

  useEffect(() => {
    if (selectedCity) {
      const cityData = tourismData[selectedState].cities[selectedCity];
      
      const generateReviews = (items) => {
        return items.map(item => ({
          name: item.name,
          reviews: [
            {
              author: 'Anonymous Traveler',
              rating: Math.floor(Math.random() * 5) + 1,
              comment: `Great experience at ${item.name}. Highly recommended!`
            }
          ]
        }));
      };

      setUserReviews({
        destinations: generateReviews(cityData.destinations),
        hotels: generateReviews(cityData.hotels)
      });
    }
  }, [selectedCity, selectedState]);


  const renderCard = (item, type) => {
    return (
      <div 
        key={item.name} 
        className="bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
            <div className="flex items-center text-yellow-500">
              <StarIcon />
              <span className="ml-1 text-gray-700">{item.rating}</span>
            </div>
          </div>

          {type === 'destination' && (
            <p className="text-gray-600 mb-2">{item.description}</p>
          )}

          {type === 'hotel' && (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Amenities:</p>
                <div className="flex space-x-2 mt-1">
                  {item.amenities.map((amenity, idx) => (
                    <span 
                      key={idx} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Price</p>
                <p className="font-bold text-green-600">${item.pricePerNight}/night</p>
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-between items-center">
            <a 
              href={item.mapsLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <MapIcon />
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!selectedState || !selectedCity) {
      return (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            Explore India's Beautiful Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a state and city to discover amazing destinations, historic landmarks, 
            and top-rated hotels across India.
          </p>
        </div>
      );
    }

    const stateData = tourismData[selectedState];
    const cityData = stateData.cities[selectedCity];

    return (
      <div>
        <div 
          className="h-64 bg-cover bg-center rounded-lg mb-6 relative"
          style={{backgroundImage: `url(${stateData.coverImage})`}}
        >
          <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h2 className="text-3xl font-bold">{selectedState}</h2>
            <p className="text-xl">{selectedCity}</p>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MountainIcon /> 
            Top Destinations
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityData.destinations.map(dest => renderCard(dest, 'destination'))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <HotelIcon /> 
            Featured Hotels
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityData.hotels.map(hotel => renderCard(hotel, 'hotel'))}
          </div>
        </section>
      </div>
    );
  };

  const renderTravelTips = () => {
    if (!selectedState) return null;

    const travelTips = {
      'Maharashtra': {
        bestTimeToVisit: 'October to March',
        localCustoms: 'Respect local Marathi traditions and greet with "Namaste"',
        transportation: 'Local trains in Mumbai, state buses for intercity travel'
      },
      'default': {
        bestTimeToVisit: 'Varies by region',
        localCustoms: 'Respect local traditions and dress modestly',
        transportation: 'Check local transportation options'
      }
    };
    const tips = travelTips[selectedState] || travelTips['default'];

    return (
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setTravelTipsOpen(!travelTipsOpen)}
        >
          <h4 className="text-xl font-bold text-gray-800">Travel Tips</h4>
          <span>{travelTipsOpen ? '▲' : '▼'}</span>
        </div>
        {travelTipsOpen && (
          <div className="mt-4">
            <div className="mb-2">
              <strong>Best Time to Visit:</strong> {tips.bestTimeToVisit}
            </div>
            <div className="mb-2">
              <strong>Local Customs:</strong> {tips.localCustoms}
            </div>
            <div>
              <strong>Transportation:</strong> {tips.transportation}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWeatherWidget = () => {
    if (!weather) return null;

    const WeatherIcon = WeatherIcons[weather.condition];

    return (
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
        <div className="mr-4">
          <WeatherIcon />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-800">Current Weather</h4>
          <p className="text-gray-600">{weather.temperature}°C, {weather.condition}</p>
        </div>
      </div>
    );
  };

  const renderBudgetCalculator = () => {
    if (!selectedState || !selectedCity) return null;

    return (
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h4 className="text-xl font-bold text-gray-800 mb-4">Trip Budget Estimator</h4>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Number of Travelers</label>
            <input 
              type="number" 
              min="1" 
              value={budgetCalculator.travelers}
              onChange={(e) => setBudgetCalculator(prev => ({
                ...prev, 
                travelers: parseInt(e.target.value)
              }))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Days of Stay</label>
            <input 
              type="number" 
              min="1" 
              value={budgetCalculator.days}
              onChange={(e) => setBudgetCalculator(prev => ({
                ...prev, 
                days: parseInt(e.target.value)
              }))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button 
          onClick={calculateBudget}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Calculate Estimated Cost
        </button>
        {budgetCalculator.estimatedCost > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xl font-bold text-green-600">
              Estimated Total Cost: ₹{budgetCalculator.estimatedCost}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderUserReviews = () => {
    if (!selectedCity) return null;

    const renderReviewSection = (title, reviews) => (
      <div className="mt-4">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
        {reviews.map((item, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
            <h5 className="font-semibold">{item.name}</h5>
            {item.reviews.map((review, reviewIdx) => (
              <div key={reviewIdx} className="mt-2">
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        {renderReviewSection('Destination Reviews', userReviews.destinations)}
        {renderReviewSection('Hotel Reviews', userReviews.hotels)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">TravelExplorer</div>
          <p className="text-sm">Discover. Explore. Experience.</p>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 flex items-center">
                  <MapPinIcon /> Select State
                </label>
                <select 
                  value={selectedState} 
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Choose State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  <MapPinIcon /> Select City
                </label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={!selectedState}
                >
                  <option value="">Choose City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {renderWeatherWidget()}
              {renderTravelTips()}
              {renderBudgetCalculator()}
            </div>
          </div>

          <div className="md:col-span-2">
            

            {renderContent()}
            {renderUserReviews()}
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 TravelExplorer. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TourismWebsite;