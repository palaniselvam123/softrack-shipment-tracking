import React, { useState } from 'react';
import { X, Edit, Download, Printer, Send, Clock, MapPin, Package, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface BookingDetailsProps {
  bookingNo: string;
  onClose: () => void;
  onEdit: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsProps> = ({ bookingNo, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const mockBookingData: { [key: string]: any } = {
    'SE-S//0036//10.2': {
      bookingNo: 'SE-S//0036//10.2',
      status: 'Pending',
      createdDate: '8th Oct 2025',
      jobOrderNo: '69595583',
      serviceProvider: 'UPS India Pvt Ltd',
      transportMode: 'Sea Import',
      shipper: 'Stark Private Limited',
      consignee: '14square Private Limited',
      origin: 'Shanghai, CN',
      destination: 'Mumbai, IN',
      pickupDate: '2025-10-01',
      deliveryDate: '2025-10-20',
      eta: '29 Oct 2025',
      location: 'Mumbai Port, India',
      cargoType: 'General Cargo',
      movementType: 'FCL (Full Container Load)',
      totalPackages: 120,
      totalWeight: '850 kg',
      totalVolume: '1.8 m³',
      goods: [
        {
          id: 1,
          description: 'Industrial Equipment',
          packages: 120,
          weight: 850,
          volume: 1.8
        }
      ],
      documents: [
        { id: 1, type: 'Commercial Invoice', name: 'Invoice_SE-S_0036.pdf', uploadedDate: '7th Aug 2024' },
        { id: 2, type: 'Packing List', name: 'Packing_List_0036.pdf', uploadedDate: '7th Aug 2024' }
      ],
      remarks: 'Sea import shipment from China.',
      trackingEvents: [
        { date: '2025-10-01', time: '10:30 AM', event: 'Booking Created', location: 'Shanghai, CN' },
        { date: '2025-10-02', time: '2:15 PM', event: 'Cargo Received', location: 'Shanghai Port' },
        { date: '2025-10-05', time: '9:00 AM', event: 'Container Loaded', location: 'Shanghai Port' },
        { date: '2025-10-06', time: '4:00 PM', event: 'Vessel Departed', location: 'Shanghai' }
      ],
      shipperAddress: '123 Business Park, Shanghai, CN',
      shipperContact: '+86 21 1234 5678',
      shipperEmail: 'logistics@stark.cn',
      consigneeAddress: 'Business Park, Mumbai, Maharashtra 400001, India',
      consigneeContact: '+91 22 1234 5678',
      consigneeEmail: 'imports@14square.in'
    },
    'SE-S//0037//11.3': {
      bookingNo: 'SE-S//0037//11.3',
      status: 'Pending',
      createdDate: '9th Oct 2025',
      jobOrderNo: '69595584',
      serviceProvider: 'Maersk India Ltd',
      transportMode: 'Sea Import',
      shipper: 'Global Traders Inc',
      consignee: 'Mumbai Imports Ltd',
      origin: 'Hamburg, DE',
      destination: 'Mumbai, IN',
      pickupDate: '2025-10-02',
      deliveryDate: '2025-10-22',
      eta: '1 Nov 2025',
      location: 'Hamburg Port, Germany',
      cargoType: 'General Cargo',
      movementType: 'FCL (Full Container Load)',
      totalPackages: 200,
      totalWeight: '1200 kg',
      totalVolume: '2.5 m³',
      goods: [
        {
          id: 1,
          description: 'Machinery Parts',
          packages: 200,
          weight: 1200,
          volume: 2.5
        }
      ],
      documents: [],
      remarks: 'Import from Germany - heavy machinery.',
      trackingEvents: [
        { date: '2025-10-02', time: '11:00 AM', event: 'Booking Created', location: 'Hamburg, DE' }
      ],
      shipperAddress: '456 Industrial Area, Hamburg, DE',
      shipperContact: '+49 40 1234 5678',
      shipperEmail: 'export@globatraders.de',
      consigneeAddress: 'Trade Center, Mumbai, Maharashtra 400002, India',
      consigneeContact: '+91 22 2345 6789',
      consigneeEmail: 'operations@mumbaiimports.com'
    },
    'SE-S//0038//12.1': {
      bookingNo: 'SE-S//0038//12.1',
      status: 'Pending',
      createdDate: '10th Oct 2025',
      jobOrderNo: '69595585',
      serviceProvider: 'MSC India Pvt Ltd',
      transportMode: 'Sea Import',
      shipper: 'Continental Exports',
      consignee: 'Bangalore Trading Co',
      origin: 'Rotterdam, NL',
      destination: 'Bangalore, IN',
      pickupDate: '2025-10-03',
      deliveryDate: '2025-10-25',
      eta: '25 Oct 2025',
      location: 'Rotterdam Port, Netherlands',
      cargoType: 'General Cargo',
      movementType: 'FCL (Full Container Load)',
      totalPackages: 150,
      totalWeight: '600 kg',
      totalVolume: '1.2 m³',
      goods: [
        { id: 1, description: 'Electronic Components', packages: 150, weight: 600, volume: 1.2 }
      ],
      documents: [],
      remarks: 'Electronics from Netherlands.',
      trackingEvents: [
        { date: '2025-10-03', time: '1:00 PM', event: 'Booking Created', location: 'Rotterdam' }
      ],
      shipperAddress: '789 Trade Complex, Rotterdam, NL',
      shipperContact: '+31 10 1234 5678',
      shipperEmail: 'export@continentalexp.nl',
      consigneeAddress: 'Industrial Area, Bangalore, Karnataka 560001, India',
      consigneeContact: '+91 80 1234 5678',
      consigneeEmail: 'imports@bangaloretrading.in'
    },
    'SE-S//0039//13.2': {
      bookingNo: 'SE-S//0039//13.2',
      status: 'Pending',
      createdDate: '11th Oct 2025',
      jobOrderNo: '69595586',
      serviceProvider: 'CMA CGM India',
      transportMode: 'Sea Export',
      shipper: 'Export Masters Ltd',
      consignee: 'International Trading Co',
      origin: 'Mumbai, IN',
      destination: 'New York, US',
      pickupDate: '2025-10-11',
      deliveryDate: '2025-11-05',
      eta: '5 Nov 2025',
      location: 'Mumbai Port, India',
      cargoType: 'General Cargo',
      movementType: 'FCL (Full Container Load)',
      totalPackages: 180,
      totalWeight: '950 kg',
      totalVolume: '2.1 m³',
      goods: [
        { id: 1, description: 'Export Goods', packages: 180, weight: 950, volume: 2.1 }
      ],
      documents: [
        { id: 1, type: 'Bill of Lading', name: 'BOL_SE-S_0039.pdf', uploadedDate: '10th Aug 2024' }
      ],
      remarks: 'Export shipment to USA.',
      trackingEvents: [
        { date: '2025-10-11', time: '9:00 AM', event: 'Booking Created', location: 'Mumbai' }
      ],
      shipperAddress: '321 Export Hub, Mumbai, India',
      shipperContact: '+91 22 5678 9012',
      shipperEmail: 'export@exportmasters.in',
      consigneeAddress: '555 Trade Street, New York, US',
      consigneeContact: '+1 212 1234 5678',
      consigneeEmail: 'imports@intltradingco.com'
    },
    'SE-S//0040//14.5': {
      bookingNo: 'SE-S//0040//14.5',
      status: 'Pending',
      createdDate: '12th Oct 2025',
      jobOrderNo: '69595587',
      serviceProvider: 'Hapag Lloyd India',
      transportMode: 'Sea Export',
      shipper: 'Maritime Exports Pvt Ltd',
      consignee: 'Global Logistics Singapore',
      origin: 'Chennai, IN',
      destination: 'Singapore, SG',
      pickupDate: '2025-10-15',
      deliveryDate: '2025-10-28',
      eta: '28 Oct 2025',
      location: 'Chennai Port, India',
      cargoType: 'General Cargo',
      movementType: 'LCL (Less than Container Load)',
      totalPackages: 95,
      totalWeight: '480 kg',
      totalVolume: '0.9 m³',
      goods: [
        { id: 1, description: 'Marine Goods', packages: 95, weight: 480, volume: 0.9 }
      ],
      documents: [],
      remarks: 'Export to Southeast Asia.',
      trackingEvents: [
        { date: '2025-10-15', time: '10:00 AM', event: 'Booking Created', location: 'Chennai' }
      ],
      shipperAddress: '654 Maritime Zone, Chennai, India',
      shipperContact: '+91 44 1234 5678',
      shipperEmail: 'exports@maritimeexp.in',
      consigneeAddress: '123 Trade Hub, Singapore',
      consigneeContact: '+65 6234 5678',
      consigneeEmail: 'logistics@globallogsg.com'
    },
    'AI//0041//15.1': {
      bookingNo: 'AI//0041//15.1',
      status: 'Pending',
      createdDate: '13th Oct 2025',
      jobOrderNo: '69595588',
      serviceProvider: 'DHL Express India',
      transportMode: 'Air Import',
      shipper: 'European Electronics GmbH',
      consignee: 'Tech Solutions India',
      origin: 'London, GB',
      destination: 'Delhi, IN',
      pickupDate: '2025-11-01',
      deliveryDate: '2025-11-02',
      eta: '2 Nov 2025',
      location: 'Delhi Airport, India',
      cargoType: 'Electronics',
      movementType: 'Air Express',
      totalPackages: 20,
      totalWeight: '100 kg',
      totalVolume: '0.5 m³',
      goods: [
        { id: 1, description: 'Electronic Components', packages: 20, weight: 100, volume: 0.5 }
      ],
      documents: [],
      remarks: 'Fast air shipment from Europe.',
      trackingEvents: [
        { date: '2025-11-01', time: '9:00 AM', event: 'Booking Created', location: 'London' },
        { date: '2025-11-01', time: '2:30 PM', event: 'Cargo Collected', location: 'London' }
      ],
      shipperAddress: 'Tech Park, London, GB',
      shipperContact: '+44 20 1234 5678',
      shipperEmail: 'export@eurelectronics.de',
      consigneeAddress: 'Tech Hub, Delhi, India',
      consigneeContact: '+91 11 9876 5432',
      consigneeEmail: 'logistics@techsolutions.in'
    },
    'AI//0042//16.3': {
      bookingNo: 'AI//0042//16.3',
      status: 'Pending',
      createdDate: '14th Oct 2025',
      jobOrderNo: '69595589',
      serviceProvider: 'FedEx India',
      transportMode: 'Air Import',
      shipper: 'American Auto Parts Inc',
      consignee: 'Chennai Motors Ltd',
      origin: 'New York, US',
      destination: 'Chennai, IN',
      pickupDate: '2025-11-05',
      deliveryDate: '2025-11-07',
      eta: '7 Nov 2025',
      location: 'Chennai Airport, India',
      cargoType: 'Automotive Parts',
      movementType: 'Air Express',
      totalPackages: 50,
      totalWeight: '250 kg',
      totalVolume: '1.0 m³',
      goods: [
        { id: 1, description: 'Auto Parts Shipment', packages: 50, weight: 250, volume: 1.0 }
      ],
      documents: [],
      remarks: 'Priority air shipment from USA.',
      trackingEvents: [
        { date: '2025-11-05', time: '8:00 AM', event: 'Booking Created', location: 'New York' }
      ],
      shipperAddress: '999 Industrial Way, New York, US',
      shipperContact: '+1 212 9876 5432',
      shipperEmail: 'export@autopartsinc.com',
      consigneeAddress: 'Motors Complex, Chennai, India',
      consigneeContact: '+91 44 5678 9012',
      consigneeEmail: 'logistics@chennaimotors.in'
    },
    'AE//0043//17.2': {
      bookingNo: 'AE//0043//17.2',
      status: 'Pending',
      createdDate: '15th Oct 2025',
      jobOrderNo: '69595590',
      serviceProvider: 'Emirates SkyCargo',
      transportMode: 'Air Export',
      shipper: 'Pharma Exports India Ltd',
      consignee: 'Healthcare Dubai LLC',
      origin: 'Mumbai, IN',
      destination: 'Dubai, AE',
      pickupDate: '2025-11-08',
      deliveryDate: '2025-11-09',
      eta: '9 Nov 2025',
      location: 'Dubai Airport, UAE',
      cargoType: 'Pharmaceuticals',
      movementType: 'Air Express',
      totalPackages: 40,
      totalWeight: '180 kg',
      totalVolume: '0.6 m³',
      goods: [
        { id: 1, description: 'Pharmaceutical Products', packages: 40, weight: 180, volume: 0.6 }
      ],
      documents: [],
      remarks: 'Temperature-controlled pharma export to UAE.',
      trackingEvents: [
        { date: '2025-11-08', time: '7:30 AM', event: 'Booking Created', location: 'Mumbai' }
      ],
      shipperAddress: '101 Pharma Hub, Mumbai, India',
      shipperContact: '+91 22 3456 7890',
      shipperEmail: 'exports@pharmaexp.in',
      consigneeAddress: 'Healthcare District, Dubai, UAE',
      consigneeContact: '+971 4 1234 5678',
      consigneeEmail: 'imports@healthcaredubai.ae'
    },
    'AE//0044//18.4': {
      bookingNo: 'AE//0044//18.4',
      status: 'Pending',
      createdDate: '16th Oct 2025',
      jobOrderNo: '69595591',
      serviceProvider: 'Qatar Airways Cargo',
      transportMode: 'Air Export',
      shipper: 'Fresh Foods Exports',
      consignee: 'Middle East Grocers',
      origin: 'Delhi, IN',
      destination: 'Doha, QA',
      pickupDate: '2025-11-10',
      deliveryDate: '2025-11-11',
      eta: '11 Nov 2025',
      location: 'Doha Airport, Qatar',
      cargoType: 'Perishables',
      movementType: 'Air Express',
      totalPackages: 30,
      totalWeight: '120 kg',
      totalVolume: '0.4 m³',
      goods: [
        { id: 1, description: 'Fresh Food Products', packages: 30, weight: 120, volume: 0.4 }
      ],
      documents: [],
      remarks: 'Perishable goods - cold chain required.',
      trackingEvents: [
        { date: '2025-11-10', time: '5:00 AM', event: 'Booking Created', location: 'Delhi' }
      ],
      shipperAddress: '202 Food Park, Delhi, India',
      shipperContact: '+91 11 2345 6789',
      shipperEmail: 'export@freshfoods.in',
      consigneeAddress: 'Market District, Doha, Qatar',
      consigneeContact: '+974 4 1234 5678',
      consigneeEmail: 'imports@megrocers.qa'
    },
    'LI//0045//19.1': {
      bookingNo: 'LI//0045//19.1',
      status: 'Pending',
      createdDate: '17th Oct 2025',
      jobOrderNo: '69595592',
      serviceProvider: 'VRL Logistics',
      transportMode: 'Land Import',
      shipper: 'Nepal Trading Co',
      consignee: 'Delhi Distributors Pvt Ltd',
      origin: 'Kathmandu, NP',
      destination: 'Delhi, IN',
      pickupDate: '2025-10-20',
      deliveryDate: '2025-10-27',
      eta: '27 Oct 2025',
      location: 'Delhi Distribution Center, India',
      cargoType: 'General Cargo',
      movementType: 'Door-to-Door',
      totalPackages: 75,
      totalWeight: '400 kg',
      totalVolume: '0.8 m³',
      goods: [
        { id: 1, description: 'Land Freight', packages: 75, weight: 400, volume: 0.8 }
      ],
      documents: [],
      remarks: 'Overland import from Nepal.',
      trackingEvents: [
        { date: '2025-10-20', time: '6:00 AM', event: 'Booking Created', location: 'Kathmandu' }
      ],
      shipperAddress: '456 Trade Way, Kathmandu, NP',
      shipperContact: '+977 1 1234 5678',
      shipperEmail: 'export@nepaltrading.np',
      consigneeAddress: 'Delhi Distribution Hub, Delhi, India',
      consigneeContact: '+91 11 1234 5678',
      consigneeEmail: 'imports@delhidist.in'
    },
    'LI//0046//20.3': {
      bookingNo: 'LI//0046//20.3',
      status: 'Pending',
      createdDate: '18th Oct 2025',
      jobOrderNo: '69595593',
      serviceProvider: 'TCI Freight',
      transportMode: 'Land Import',
      shipper: 'Bangladesh Textiles Ltd',
      consignee: 'Mumbai Fashion House',
      origin: 'Dhaka, BD',
      destination: 'Mumbai, IN',
      pickupDate: '2025-10-25',
      deliveryDate: '2025-11-02',
      eta: '2 Nov 2025',
      location: 'Mumbai Warehouse, India',
      cargoType: 'Textiles',
      movementType: 'Door-to-Door',
      totalPackages: 200,
      totalWeight: '1000 kg',
      totalVolume: '2.2 m³',
      goods: [
        { id: 1, description: 'Textile Goods', packages: 200, weight: 1000, volume: 2.2 }
      ],
      documents: [],
      remarks: 'Textile import from Bangladesh.',
      trackingEvents: [
        { date: '2025-10-25', time: '7:00 AM', event: 'Booking Created', location: 'Dhaka' }
      ],
      shipperAddress: '789 Textile Park, Dhaka, BD',
      shipperContact: '+880 2 1234 5678',
      shipperEmail: 'export@bdtextiles.bd',
      consigneeAddress: 'Fashion Hub, Mumbai, India',
      consigneeContact: '+91 22 9876 5432',
      consigneeEmail: 'imports@mumbaifashion.in'
    },
    'LE//0047//21.2': {
      bookingNo: 'LE//0047//21.2',
      status: 'Pending',
      createdDate: '19th Oct 2025',
      jobOrderNo: '69595594',
      serviceProvider: 'Blue Dart Express',
      transportMode: 'Land Export',
      shipper: 'Bangalore Tech Solutions',
      consignee: 'Sri Lanka Electronics',
      origin: 'Bangalore, IN',
      destination: 'Colombo, LK',
      pickupDate: '2025-11-01',
      deliveryDate: '2025-11-08',
      eta: '8 Nov 2025',
      location: 'Colombo Port, Sri Lanka',
      cargoType: 'Electronics',
      movementType: 'Door-to-Door',
      totalPackages: 85,
      totalWeight: '450 kg',
      totalVolume: '1.1 m³',
      goods: [
        { id: 1, description: 'Tech Products', packages: 85, weight: 450, volume: 1.1 }
      ],
      documents: [],
      remarks: 'Export to Sri Lanka.',
      trackingEvents: [
        { date: '2025-11-01', time: '9:00 AM', event: 'Booking Created', location: 'Bangalore' }
      ],
      shipperAddress: '321 Tech Park, Bangalore, India',
      shipperContact: '+91 80 1234 5678',
      shipperEmail: 'export@bangaloretech.in',
      consigneeAddress: '654 Electronics Zone, Colombo, LK',
      consigneeContact: '+94 11 1234 5678',
      consigneeEmail: 'imports@srielec.lk'
    },
    'LE//0048//22.5': {
      bookingNo: 'LE//0048//22.5',
      status: 'Pending',
      createdDate: '20th Oct 2025',
      jobOrderNo: '69595595',
      serviceProvider: 'Gati KWE',
      transportMode: 'Land Export',
      shipper: 'Chennai Manufacturing Ltd',
      consignee: 'Colombo Trading Co',
      origin: 'Chennai, IN',
      destination: 'Colombo, LK',
      pickupDate: '2025-11-03',
      deliveryDate: '2025-11-10',
      eta: '10 Nov 2025',
      location: 'Colombo, Sri Lanka',
      cargoType: 'Manufacturing Goods',
      movementType: 'Door-to-Door',
      totalPackages: 120,
      totalWeight: '650 kg',
      totalVolume: '1.5 m³',
      goods: [
        { id: 1, description: 'Manufactured Items', packages: 120, weight: 650, volume: 1.5 }
      ],
      documents: [],
      remarks: 'Manufacturing export to Sri Lanka.',
      trackingEvents: [
        { date: '2025-11-03', time: '8:30 AM', event: 'Booking Created', location: 'Chennai' }
      ],
      shipperAddress: '987 Manufacturing Complex, Chennai, India',
      shipperContact: '+91 44 9876 5432',
      shipperEmail: 'export@chennamfg.in',
      consigneeAddress: '321 Trade Center, Colombo, LK',
      consigneeContact: '+94 11 9876 5432',
      consigneeEmail: 'imports@colombotrading.lk'
    }
  };

  const booking = mockBookingData[bookingNo];

  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Booking Not Found</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600">No booking found with number: {bookingNo}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{booking.bookingNo}</h2>
              <p className="text-sm text-gray-600 mt-1">Job Order: {booking.jobOrderNo}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'overview'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'tracking'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Tracking
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'documents'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Documents ({booking.documents.length})
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">ETA: <span className="font-semibold">{booking.eta}</span></p>
                    <p className="text-sm text-blue-600 mt-1">Current Location: <span className="font-semibold">{booking.location}</span></p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Service Details</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Provider:</span> <span className="font-medium">{booking.serviceProvider}</span></p>
                    <p><span className="text-gray-600">Transport Mode:</span> <span className="font-medium">{booking.transportMode}</span></p>
                    <p><span className="text-gray-600">Cargo Type:</span> <span className="font-medium">{booking.cargoType}</span></p>
                    <p><span className="text-gray-600">Movement Type:</span> <span className="font-medium">{booking.movementType}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Route</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Origin:</span> <span className="font-medium">{booking.origin}</span></p>
                    <p><span className="text-gray-600">Destination:</span> <span className="font-medium">{booking.destination}</span></p>
                    <p><span className="text-gray-600">Pickup Date:</span> <span className="font-medium">{booking.pickupDate}</span></p>
                    <p><span className="text-gray-600">Delivery Date:</span> <span className="font-medium">{booking.deliveryDate}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipper</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{booking.shipper}</p>
                    <p className="text-gray-600">{booking.shipperAddress}</p>
                    <p className="text-gray-600">{booking.shipperContact}</p>
                    <p className="text-blue-600">{booking.shipperEmail}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Consignee</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{booking.consignee}</p>
                    <p className="text-gray-600">{booking.consigneeAddress}</p>
                    <p className="text-gray-600">{booking.consigneeContact}</p>
                    <p className="text-blue-600">{booking.consigneeEmail}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Cargo Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Packages</p>
                    <p className="font-semibold text-lg text-gray-900">{booking.totalPackages}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Weight</p>
                    <p className="font-semibold text-lg text-gray-900">{booking.totalWeight}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Volume</p>
                    <p className="font-semibold text-lg text-gray-900">{booking.totalVolume}</p>
                  </div>
                </div>
              </div>

              {booking.remarks && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900"><span className="font-semibold">Remarks:</span> {booking.remarks}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-4">
              {booking.trackingEvents.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
                  <div className="space-y-6 pl-12">
                    {booking.trackingEvents.map((event, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-8 mt-1 w-6 h-6 bg-blue-600 rounded-full border-4 border-white" />
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{event.event}</h4>
                            <span className="text-sm text-gray-600">{event.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{event.date} • {event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No tracking events available yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {booking.documents.length > 0 ? (
                <div className="space-y-3">
                  {booking.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-600">{doc.type} • Uploaded {doc.uploadedDate}</p>
                        </div>
                      </div>
                      <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No documents uploaded</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
