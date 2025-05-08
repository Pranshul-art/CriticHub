 import Profile from '../../assets/FoodCriticProfile.jpeg';
 import Travel from '../../assets/TravelCriticProfile.jpeg';
 import GN from '../../assets/GN.png'
 import FoodCritic from '../../assets/FoodCritic.png'
 import Cuisine from '../../assets/CuisineGoa.webp';
 import Du from '../../assets/Du.png';
 import Bangkok from '../../assets/Bangkok.mp3'
 import video from '../../assets/videoplayback.mp4'
 
 const dummyItineraries = [
    {
      id: 1,
      author: 'FoodCritic23',
      profilePic: Profile,
      title: '20 Hours in Goa',
      location: 'Goa, India',
      duration: '20 hours',
      timestamp: '2 hours ago',
      content: 'Started my day at the vibrant Anjuna Beach Market, followed by lunch at Thalassa - skip the overpriced cocktails but the Greek salad is a must! Avoid the tourist traps near Baga and head to Morjim for the sunset.',
      media: Cuisine,
      likes: 324,
      comments: 47,
      isVideo: false,
      tags: ['beaches', 'food', 'nightlife']
    },
    {
      id: 2,
      author: 'TravelExpert',
      profilePic: Travel,
      title: 'Hidden Gems in Bangkok',
      location: 'Bangkok, Thailand',
      duration: '3 days',
      timestamp: '1 day ago',
      content: 'Skip the Grand Palace crowds and visit Wat Ratchanatdaram early morning. The locals eat at Thipsamai Pad Thai but be prepared to wait. Airplane Graveyard is worth the visit for photographers!',
      media: video,
      likes: 518,
      comments: 89,
      isVideo: true,
      tags: ['street food', 'temples', 'photography']
    },
    {
      id: 3,
      author: 'GastroNomad',
      profilePic: GN ,
      title: 'Paris Food Tour',
      location: 'Paris, France',
      duration: '2 days',
      timestamp: '3 days ago',
      content: 'Avoid Angelina for hot chocolate - overpriced and not worth the wait. Instead try Café de Flore. The best croissants are at Du Pain et des Idées, not the tourist spots. Lunch at Bouillon Chartier gives authentic experience without breaking the bank.',
      media: Du,
      likes: 756,
      comments: 102,
      isVideo: false,
      tags: ['pastries', 'cafes', 'budget eats']
    }
  ];
  
export default dummyItineraries;