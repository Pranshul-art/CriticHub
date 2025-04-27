import React, { useEffect, useState } from "react";
import OptionsDesign from "../components2/itineraries/OptionsBar";
import dummyItineraries from "../components2/demoData/Itineraries";
import ItineraryCard from "../components2/itineraries/ItinerariesCard";
import { User } from "lucide-react";
const Itineraries=()=>{
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItineraries, setFilteredItineraries] = useState(dummyItineraries);
    
    useEffect(() => {
      // Filter itineraries based on search query and active filter
      let filtered = dummyItineraries;
      
      if (searchQuery) {
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      if (activeFilter !== 'all') {
        if (activeFilter === 'videos') {
          filtered = filtered.filter(item => item.isVideo);
        } else {
          filtered = filtered.filter(item => 
            item.tags.includes(activeFilter) || 
            item.location.toLowerCase().includes(activeFilter) ||
            item.duration.toLowerCase().includes(activeFilter)
          );
        }
      }
      
      setFilteredItineraries(filtered);
    }, [searchQuery, activeFilter]);
    return <div className="   ">
        <div className="container  bg-slate-200 pt-20 ">
            
            
           
            
            <div className="bg-purple-50 min-h-screen pt-8">
                <h1 className="font-bold text-3xl pb-6">Featured Itineraries</h1>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        
                        {filteredItineraries.length > 0 ? (
                            filteredItineraries.map(itinerary => (
                            <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold mb-2">No Results Found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 ">
                            <h3 className="text-xl font-bold mb-4">Top Critics</h3>
                            
                            <div className="space-y-4">
                            {['FoodCritic23', 'TravelExpert', 'GastroNomad', 'UrbanExplorer'].map((critic, index) => (
                                <div key={index} className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                                    <User size={20} className="text-gray-600" />
                                </div>
                                <div>
                                    <div className="font-medium">{critic}</div>
                                    <div className="text-xs text-gray-500">{100 - index * 20}+ itineraries</div>
                                </div>
                                <button className="ml-auto text-sm font-medium text-coral hover:text-coral-dark">
                                    Follow
                                </button>
                                </div>
                            ))}
                            </div>
                            
                            <button className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700">
                            View All Critics {`->`}
                            </button>
                        </div>
                    
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4">Popular Destinations</h3>
                            <div className="space-y-3">
                            {['Bali, Indonesia', 'Kyoto, Japan', 'Barcelona, Spain', 'New York City, USA'].map((place, index) => (
                                <div key={index} className="flex items-center">
                                <div className="h-12 w-12 rounded-lg bg-gray-200 mr-3 overflow-hidden">
                                    <img src={`/api/placeholder/${50+index}/${50+index}`} alt={place} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-medium">{place}</div>
                                    <div className="text-xs text-gray-500">{30 - index * 5} itineraries</div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            
            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6">
                <button className="bg-coral hover:bg-dark text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-105">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                </button>
            </div>
            
      
        
        

        
    </div>
}

export default Itineraries;