import React from 'react';
import { Activity, Clock, CheckCircle, AlertTriangle, Info, Truck, Ship, Plane, Package } from 'lucide-react';

interface ActivityListProps {
  shipmentNo: string;
}

const ActivityList: React.FC<ActivityListProps> = ({ shipmentNo }) => {
  const activities = [
    {
      id: 1,
      title: 'Shipment Status Updated',
      description: 'Status changed from "In Transit" to "Customs Clearance"',
      type: 'status_update',
      timestamp: '2026-11-15 14:30:00',
      user: 'System',
      location: 'New York Port, NY',
      icon: 'info'
    },
    {
      id: 2,
      title: 'Container Arrived at Destination',
      description: 'Container BKSU9898988 has arrived at New York Port',
      type: 'arrival',
      timestamp: '2026-11-15 08:45:00',
      user: 'Port Authority',
      location: 'New York Port, NY',
      icon: 'success'
    },
    {
      id: 3,
      title: 'Customs Documentation Submitted',
      description: 'All required customs documents have been submitted for clearance',
      type: 'documentation',
      timestamp: '2026-11-14 16:20:00',
      user: 'Sarah Johnson',
      location: 'New York Port, NY',
      icon: 'info'
    },
    {
      id: 4,
      title: 'Vessel Departure',
      description: 'Vessel departed from Nhava Sheva Port with container BKSU9898988',
      type: 'departure',
      timestamp: '2026-11-10 22:15:00',
      user: 'Maersk Line',
      location: 'Nhava Sheva Port, MH',
      icon: 'success'
    },
    {
      id: 5,
      title: 'Container Loading Completed',
      description: 'Container successfully loaded onto vessel MSC MEDITERRANEAN',
      type: 'loading',
      timestamp: '2026-11-10 14:30:00',
      user: 'Port Operations',
      location: 'Nhava Sheva Port, MH',
      icon: 'success'
    },
    {
      id: 6,
      title: 'Pre-shipment Inspection',
      description: 'Quality inspection completed for all 260 packages',
      type: 'inspection',
      timestamp: '2026-11-09 11:45:00',
      user: 'Quality Team',
      location: 'Mumbai Warehouse',
      icon: 'success'
    },
    {
      id: 7,
      title: 'Export Documentation Approved',
      description: 'All export documents have been approved by customs',
      type: 'approval',
      timestamp: '2026-11-08 15:20:00',
      user: 'Customs Authority',
      location: 'Mumbai Customs',
      icon: 'success'
    },
    {
      id: 8,
      title: 'Cargo Received at Warehouse',
      description: 'All packages received and verified at export warehouse',
      type: 'receipt',
      timestamp: '2026-11-07 09:30:00',
      user: 'Warehouse Team',
      location: 'Mumbai Warehouse',
      icon: 'success'
    },
    {
      id: 9,
      title: 'Booking Confirmation',
      description: 'Shipping space confirmed with Maersk Line',
      type: 'booking',
      timestamp: '2026-11-05 13:15:00',
      user: 'Mike Chen',
      location: 'Mumbai Office',
      icon: 'info'
    },
    {
      id: 10,
      title: 'Shipment Created',
      description: 'New shipment record created in the system',
      type: 'creation',
      timestamp: '2026-11-01 10:00:00',
      user: 'Emma Wilson',
      location: 'Mumbai Office',
      icon: 'info'
    }
  ];

  const getActivityIcon = (icon: string, type: string) => {
    const iconClass = "w-5 h-5";
    
    switch (icon) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-blue-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
      case 'info':
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getActivityColor = (icon: string) => {
    switch (icon) {
      case 'success':
        return 'border-blue-200 bg-blue-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getTimelineColor = (icon: string) => {
    switch (icon) {
      case 'success':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Activity Timeline ({activities.length})</h2>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Live Updates</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {activities.map((activity, index) => {
              const { date, time } = formatTimestamp(activity.timestamp);
              
              return (
                <div key={activity.id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-3 h-3 rounded-full ${getTimelineColor(activity.icon)} flex-shrink-0 mt-2`}></div>
                  
                  {/* Activity content */}
                  <div className={`flex-1 p-4 rounded-lg border ${getActivityColor(activity.icon)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getActivityIcon(activity.icon, activity.type)}
                          <h3 className="text-lg font-medium text-gray-900">{activity.title}</h3>
                        </div>
                        <p className="text-gray-700 mb-3">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{date} at {time}</span>
                          </div>
                          <span>•</span>
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {activities.length} activities</p>
          <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;