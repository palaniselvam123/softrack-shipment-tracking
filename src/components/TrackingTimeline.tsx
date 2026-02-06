import React from 'react';
import { CheckCircle, Circle, Clock, Ship, MapPin, Plus } from 'lucide-react';

const TrackingTimeline = () => {
  const timelineEvents = [
    {
      status: 'Pickup Location',
      location: 'Australian Fine Wines',
      completed: true,
      current: false,
      icon: 'pickup'
    },
    {
      status: 'Port of Loading',
      location: 'Auckland - NZAKL',
      date: '09-Oct-2026 10:40',
      time: 'On-Time',
      completed: true,
      current: false,
      icon: 'port'
    },
    {
      status: 'Leg 1 of 1',
      location: 'MSC Alabama III',
      details: {
        mode: 'Sea',
        carrier: 'MEDITERRANEAN SHIPPING COMPANY',
        voyage: 'KE340R',
        departure: '09-Oct-2026 10:40',
        arrival: '29-Nov-2026 20:00'
      },
      completed: false,
      current: true,
      icon: 'vessel'
    },
    {
      status: 'Port of Discharge',
      location: 'Nhava Sheva Port/Mumbai - INJNP',
      date: '29-Jan-2026 20:00',
      completed: false,
      current: false,
      icon: 'port'
    },
    {
      status: 'Delivery Location',
      location: 'South Asia Trading Company',
      completed: false,
      current: false,
      icon: 'delivery'
    }
  ];

  const getIcon = (iconType: string, completed: boolean, current: boolean) => {
    const iconClass = `w-5 h-5 ${completed ? 'text-green-500' : current ? 'text-blue-500' : 'text-gray-400'}`;
    
    switch (iconType) {
      case 'pickup':
        return <CheckCircle className={iconClass} />;
      case 'port':
        return <MapPin className={iconClass} />;
      case 'vessel':
        return <Ship className={iconClass} />;
      case 'delivery':
        return <Circle className={iconClass} />;
      default:
        return <Circle className={iconClass} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Route Details</h3>
        </div>
        <div className="mt-2 bg-blue-900 text-white p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Estimated Delivery to Destination Port</span>
          </div>
          <p className="text-lg font-semibold">Wed, 29 November 2026</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(event.icon, event.completed, event.current)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    event.completed ? 'text-green-700' : 
                    event.current ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {event.status}
                  </p>
                  <p className="text-sm text-gray-900 font-medium">{event.location}</p>
                  {event.date && (
                    <p className="text-xs text-gray-500">{event.date}</p>
                  )}
                  {event.time && (
                    <p className="text-xs text-gray-500">{event.time}</p>
                  )}
                  {event.details && (
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>Mode: {event.details.mode}</span>
                        <span>Carrier: {event.details.carrier}</span>
                        <span>Voyage #: {event.details.voyage}</span>
                      </div>
                      <div>Actual Time Departure: {event.details.departure}</div>
                      <div>Estimated Time Arrival: {event.details.arrival}</div>
                    </div>
                  )}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;