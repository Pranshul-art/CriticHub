import React, { useState } from 'react';

const tourismData = {
  'Maharashtra': {
    coverImage: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/4e/55/e6/chhatrapati-shivaji-terminus.jpg?w=800&h=-1&s=1',
    cities: {
      'Mumbai': {
        destinations: [
          {
            name: 'Gateway of India',
            description: 'Iconic arch monument built during the British Raj',
            rating: 4.7,
            mapsLink: 'https://goo.gl/maps/example'
          },
          {
            name: 'Marine Drive',
            description: 'Scenic seafront promenade known as the Queen\'s Necklace',
            rating: 4.5,
            mapsLink: 'https://goo.gl/maps/example'
          }
        ],
        hotels: [
          {
            name: 'Taj Mahal Palace',
            rating: 4.9,
            pricePerNight: 500,
            amenities: ['Pool', 'Spa', 'Gym'],
            mapsLink: 'https://goo.gl/maps/example'
          },
          {
            name: 'The Oberoi',
            rating: 4.8,
            pricePerNight: 450,
            amenities: ['Sea View', 'Restaurant', 'WiFi'],
            mapsLink: 'https://goo.gl/maps/example'
          }
        ]
      },
      'Pune': {
        destinations: [
          {
            name: 'Aga Khan Palace',
            description: 'Historical palace with significant independence movement history',
            rating: 4.6,
            mapsLink: 'https://goo.gl/maps/example'
          }
        ],
        hotels: [
          {
            name: 'Hyatt Pune',
            rating: 4.7,
            pricePerNight: 350,
            amenities: ['Fitness', 'Restaurant', 'Bar'],
            mapsLink: 'https://goo.gl/maps/example'
          }
        ]
      }
    }
  },
  'Rajasthan': {
    coverImage: 'https://chanoudgarh.com/wp-content/uploads/2023/08/Best-Tourist-Places-to-Visit-in-Rajasthan.jpg',
    cities: {
      'Jaipur': {
        destinations: [
          {
            name: 'Hawa Mahal',
            description: 'Palace of Winds, an iconic Rajasthani architectural marvel',
            rating: 4.8,
            mapsLink: 'https://goo.gl/maps/example'
          }
        ],
        hotels: [
          {
            name: 'Rambagh Palace',
            rating: 4.9,
            pricePerNight: 600,
            amenities: ['Heritage', 'Spa', 'Gardens'],
            mapsLink: 'https://goo.gl/maps/example'
          }
        ]
      },
      'Udaipur': {
        destinations: [
          {
            name: 'City Palace',
            description: 'Magnificent palace complex on Lake Pichola',
            rating: 4.9,
            mapsLink: 'https://goo.gl/maps/example'
          }
        ],
        hotels: [
          {
            name: 'Taj Lake Palace',
            rating: 4.9,
            pricePerNight: 750,
            amenities: ['Lake View', 'Luxury', 'Pool'],
            mapsLink: 'https://goo.gl/maps/example'
          }
        ]
      }
    }
  }
};

const states = Object.keys(tourismData);

const cities = Object.keys(
  Object.values(tourismData).reduce((acc, stateData) => {
    return { ...acc, ...stateData.cities };
  }, {})
);

export { tourismData, states, cities };