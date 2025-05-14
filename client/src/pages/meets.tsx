import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet';
import { Calendar, ChevronRight, MapPin, Clock, Users } from 'lucide-react';

export default function Meets() {
  const [isCoach, setIsCoach] = useState(false);
  
  useEffect(() => {
    // Simple check for coach role from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsCoach(user.role === 'coach');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsCoach(false);
      }
    }
  }, []);
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Meets - RipScore</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE]">Dive Meets</h1>
        <p className="text-muted-foreground">View and manage diving competitions</p>
      </div>
      
      <div className="mb-8 flex flex-col gap-6 md:flex-row">
        {isCoach && (
          <div className="rounded-lg border border-border bg-card p-4 md:w-1/3">
            <h2 className="mb-4 text-lg font-medium">Schedule New Meet</h2>
            <form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Meet Name</label>
                <input 
                  type="text" 
                  placeholder="Regional Championship" 
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Location</label>
                <input 
                  type="text" 
                  placeholder="Aquatic Center" 
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Date</label>
                <input 
                  type="date"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button 
                type="submit"
                className="w-full rounded-md bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Create Meet
              </button>
            </form>
          </div>
        )}
        
        <div className={`flex-1 space-y-6 ${!isCoach ? 'w-full' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Upcoming Meets</h2>
            <div className="flex gap-2">
              <button className="rounded-md bg-[#131C2E] px-3 py-1 text-sm text-white">All</button>
              <button className="rounded-md px-3 py-1 text-sm text-[#8A9BA8] hover:bg-[#131C2E]">Upcoming</button>
              <button className="rounded-md px-3 py-1 text-sm text-[#8A9BA8] hover:bg-[#131C2E]">Past</button>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                id: 1, 
                name: 'Spring Regional Championship', 
                status: 'upcoming', 
                date: 'May 15, 2023', 
                location: 'Westlake Aquatic Center', 
                participants: 42,
                time: '9:00 AM'
              },
              { 
                id: 2, 
                name: 'Summer Invitational', 
                status: 'upcoming', 
                date: 'July 8, 2023', 
                location: 'City Pool Complex', 
                participants: 36,
                time: '10:30 AM'
              },
              { 
                id: 3, 
                name: 'State Championships', 
                status: 'upcoming', 
                date: 'August 12, 2023', 
                location: 'Olympic Training Center', 
                participants: 64,
                time: '8:00 AM'
              },
            ].map((meet) => (
              <div key={meet.id} className="rounded-lg border border-[#2D3748] bg-[#111827] overflow-hidden shadow-lg">
                <div className="border-b border-[#2D3748] p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{meet.name}</h3>
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium capitalize text-green-400">
                      {meet.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-[#8A9BA8]" />
                      <span className="text-sm text-[#8A9BA8]">{meet.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-[#8A9BA8]" />
                      <span className="text-sm text-[#8A9BA8]">{meet.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-[#8A9BA8]" />
                      <span className="text-sm text-[#8A9BA8]">{meet.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-[#8A9BA8]" />
                      <span className="text-sm text-[#8A9BA8]">{meet.participants} participants</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    {isCoach && (
                      <button className="rounded-md bg-[#131C2E] px-3 py-1 text-xs font-medium text-white hover:bg-[#1E293B]">
                        Add Divers
                      </button>
                    )}
                    <button className="flex items-center rounded-md bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] px-3 py-1 text-xs font-medium text-white hover:opacity-90 ml-auto">
                      View Details <ChevronRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}