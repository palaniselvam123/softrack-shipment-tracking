import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, Plus, X, Calendar, MapPin } from 'lucide-react';

interface BookingData {
  // Service Selection
  serviceProvider: string;
  transportMode: string;
  shipmentType: string;
  services: string[];
  movementType: string;
  
  // Consignee Details
  consigneeId: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeContact: string;
  consigneeEmail: string;
  
  // Route & Dates
  originLocation: string;
  destinationLocation: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDate: string;
  deliveryDate: string;
  
  // Cargo Details
  cargoType: string;
  
  // Goods Details
  goods: Array<{
    id: string;
    description: string;
    packages: number;
    weight: number;
    volume: number;
  }>;
  
  // Documents
  documents: Array<{
    id: string;
    type: string;
    name: string;
    file?: File;
  }>;
  
  // Remarks
  remarks: string;
}
import LocationSelector from './LocationSelector';

interface BookingWizardProps {
  bookingNo?: string;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ bookingNo }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTemplates, setShowTemplates] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceProvider: '',
    transportMode: '',
    shipmentType: '',
    services: [],
    movementType: '',
    consigneeId: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeContact: '',
    consigneeEmail: '',
    originLocation: '',
    destinationLocation: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    deliveryDate: '',
    cargoType: '',
    goods: [],
    documents: [],
    remarks: ''
  });

  // Mock booking data for pre-filling (in real app, this would come from API)
  const getBookingData = (bookingNo: string) => {
    console.log('getBookingData called with:', bookingNo);

    const mockBookingData: { [key: string]: any } = {
      'BKG/2025/001': {
        serviceProvider: 'Maersk Line',
        transportMode: 'sea',
        shipmentType: 'Export',
        services: ['Forwarding', 'Customs Clearance', 'Transportation'],
        consigneeId: '6',
        consigneeName: 'Australian Fine Wines',
        consigneeAddress: '88 Wine Valley Road, East Perth, WA 6004, Australia',
        consigneeContact: '+61 8 9876 5432',
        consigneeEmail: 'export@ausfinewines.com.au',
        originLocation: 'East Perth, AU',
        destinationLocation: 'Mumbai, IN',
        pickupDate: '2025-10-10',
        deliveryDate: '2025-10-29',
        cargoType: 'General Cargo',
        movementType: 'FCL (Full Container Load)',
        goods: [
          {
            id: '1',
            description: 'Non-Alcoholic Wine',
            packages: 260,
            weight: 500,
            volume: 0.5
          }
        ],
        documents: [
          {
            id: '1',
            type: 'Commercial Invoice',
            name: 'Commercial_Invoice_AWF_001.pdf'
          },
          {
            id: '2',
            type: 'Packing List',
            name: 'Packing_List_AWF_001.pdf'
          }
        ],
        remarks: 'Temperature-sensitive cargo. Handle with care.'
      },
      'SE-S//0036//10.2': {
        serviceProvider: 'UPS India Pvt Ltd',
        transportMode: 'sea',
        shipmentType: 'Import',
        services: ['Forwarding', 'Customs Clearance'],
        consigneeId: '1',
        consigneeName: '14square Private Limited',
        consigneeAddress: 'Business Park, Mumbai, Maharashtra 400001, India',
        consigneeContact: '+91 22 1234 5678',
        consigneeEmail: 'imports@14square.in',
        originLocation: 'Shanghai, CN',
        destinationLocation: 'Mumbai, IN',
        pickupDate: '2025-10-01',
        deliveryDate: '2025-10-20',
        cargoType: 'General Cargo',
        movementType: 'FCL (Full Container Load)',
        goods: [
          {
            id: '1',
            description: 'Industrial Equipment',
            packages: 120,
            weight: 850,
            volume: 1.8
          }
        ],
        documents: [],
        remarks: 'Sea import shipment from China.'
      },
      'SE-S//0037//11.3': {
        serviceProvider: 'Maersk India Ltd',
        transportMode: 'sea',
        shipmentType: 'Import',
        services: ['Forwarding', 'Customs Clearance', 'Transportation'],
        consigneeId: '2',
        consigneeName: 'Mumbai Imports Ltd',
        consigneeAddress: 'Trade Center, Mumbai, Maharashtra 400002, India',
        consigneeContact: '+91 22 2345 6789',
        consigneeEmail: 'operations@mumbaiimports.com',
        originLocation: 'Hamburg, DE',
        destinationLocation: 'Mumbai, IN',
        pickupDate: '2025-10-02',
        deliveryDate: '2025-10-22',
        cargoType: 'General Cargo',
        movementType: 'FCL (Full Container Load)',
        goods: [
          {
            id: '1',
            description: 'Machinery Parts',
            packages: 200,
            weight: 1200,
            volume: 2.5
          }
        ],
        documents: [],
        remarks: 'Import from Germany - heavy machinery.'
      },
      'SE-S//0038//12.1': {
        serviceProvider: 'MSC India Pvt Ltd',
        transportMode: 'sea',
        shipmentType: 'Import',
        services: ['Forwarding', 'Customs Clearance'],
        consigneeId: '3',
        consigneeName: 'Bangalore Trading Co',
        consigneeAddress: 'Industrial Area, Bangalore, Karnataka 560001, India',
        consigneeContact: '+91 80 1234 5678',
        consigneeEmail: 'info@bangaloretrading.in',
        originLocation: 'Rotterdam, NL',
        destinationLocation: 'Bangalore, IN',
        pickupDate: '2025-10-03',
        deliveryDate: '2025-10-25',
        cargoType: 'General Cargo',
        movementType: 'FCL (Full Container Load)',
        goods: [
          {
            id: '1',
            description: 'Electronic Components',
            packages: 150,
            weight: 600,
            volume: 1.2
          }
        ],
        documents: [],
        remarks: 'Electronics from Netherlands.'
      },
      'AI//0041//15.1': {
        serviceProvider: 'DHL Express India',
        transportMode: 'air',
        shipmentType: 'Import',
        services: ['Forwarding', 'Customs Clearance', 'Express Delivery'],
        consigneeId: '4',
        consigneeName: 'Tech Solutions India',
        consigneeAddress: 'Tech Hub, Delhi, India',
        consigneeContact: '+91 11 9876 5432',
        consigneeEmail: 'logistics@techsolutions.in',
        originLocation: 'London, GB',
        destinationLocation: 'Delhi, IN',
        pickupDate: '2025-11-01',
        deliveryDate: '2025-11-02',
        cargoType: 'Electronics',
        movementType: 'Air Express',
        goods: [
          {
            id: '1',
            description: 'Electronic Components',
            packages: 20,
            weight: 100,
            volume: 0.5
          }
        ],
        documents: [],
        remarks: 'Fast air shipment from Europe.'
      },
      'AE//0043//17.2': {
        serviceProvider: 'Emirates SkyCargo',
        transportMode: 'air',
        shipmentType: 'Export',
        services: ['Forwarding', 'Customs Clearance', 'Insurance'],
        consigneeId: '5',
        consigneeName: 'Dubai Tech Hub',
        consigneeAddress: 'Technology Park, Dubai, UAE',
        consigneeContact: '+971 4 567 8901',
        consigneeEmail: 'imports@dubaitech.ae',
        originLocation: 'Bangalore, IN',
        destinationLocation: 'Dubai, AE',
        pickupDate: '2025-11-15',
        deliveryDate: '2025-11-16',
        cargoType: 'Electronics',
        movementType: 'Air Express',
        goods: [
          {
            id: '1',
            description: 'IT Equipment',
            packages: 50,
            weight: 250,
            volume: 1.0
          }
        ],
        documents: [],
        remarks: 'High-value electronics export.'
      },
      'SE-S//0039//13.2': {
        serviceProvider: 'CMA CGM India',
        transportMode: 'sea',
        shipmentType: 'Export',
        services: ['Forwarding', 'Customs Clearance', 'Transportation'],
        consigneeId: '6',
        consigneeName: 'International Trading Co',
        consigneeAddress: '555 Trade Street, New York, US',
        consigneeContact: '+1 212 1234 5678',
        consigneeEmail: 'imports@intltradingco.com',
        originLocation: 'Mumbai, IN',
        destinationLocation: 'New York, US',
        pickupDate: '2025-10-11',
        deliveryDate: '2025-11-05',
        cargoType: 'General Cargo',
        movementType: 'FCL (Full Container Load)',
        goods: [
          {
            id: '1',
            description: 'Export Goods',
            packages: 180,
            weight: 950,
            volume: 2.1
          }
        ],
        documents: [],
        remarks: 'Export shipment to USA.'
      },
      'SE-S//0040//14.5': {
        serviceProvider: 'Hapag Lloyd India',
        transportMode: 'sea',
        shipmentType: 'Export',
        services: ['Forwarding', 'Documentation'],
        consigneeId: '7',
        consigneeName: 'Global Logistics Singapore',
        consigneeAddress: '123 Trade Hub, Singapore',
        consigneeContact: '+65 6234 5678',
        consigneeEmail: 'logistics@globallogsg.com',
        originLocation: 'Chennai, IN',
        destinationLocation: 'Singapore, SG',
        pickupDate: '2025-10-15',
        deliveryDate: '2025-10-28',
        cargoType: 'General Cargo',
        movementType: 'LCL (Less than Container Load)',
        goods: [
          {
            id: '1',
            description: 'Marine Goods',
            packages: 95,
            weight: 480,
            volume: 0.9
          }
        ],
        documents: [],
        remarks: 'Export to Southeast Asia.'
      },
      'AI//0042//16.3': {
        serviceProvider: 'FedEx India',
        transportMode: 'air',
        shipmentType: 'Import',
        services: ['Forwarding', 'Customs Clearance'],
        consigneeId: '8',
        consigneeName: 'Chennai Motors Ltd',
        consigneeAddress: 'Motors Complex, Chennai, India',
        consigneeContact: '+91 44 5678 9012',
        consigneeEmail: 'logistics@chennaimotors.in',
        originLocation: 'New York, US',
        destinationLocation: 'Chennai, IN',
        pickupDate: '2025-11-05',
        deliveryDate: '2025-11-07',
        cargoType: 'Automotive Parts',
        movementType: 'Air Express',
        goods: [
          {
            id: '1',
            description: 'Auto Parts Shipment',
            packages: 50,
            weight: 250,
            volume: 1.0
          }
        ],
        documents: [],
        remarks: 'Priority air shipment from USA.'
      },
      'LI//0045//19.1': {
        serviceProvider: 'VRL Logistics',
        transportMode: 'land',
        shipmentType: 'Import',
        services: ['Transportation', 'Customs Clearance'],
        consigneeId: '9',
        consigneeName: 'Delhi Distributors Pvt Ltd',
        consigneeAddress: 'Delhi Distribution Hub, Delhi, India',
        consigneeContact: '+91 11 1234 5678',
        consigneeEmail: 'imports@delhidist.in',
        originLocation: 'Kathmandu, NP',
        destinationLocation: 'Delhi, IN',
        pickupDate: '2025-10-20',
        deliveryDate: '2025-10-27',
        cargoType: 'General Cargo',
        movementType: 'Door-to-Door',
        goods: [
          {
            id: '1',
            description: 'Land Freight',
            packages: 75,
            weight: 400,
            volume: 0.8
          }
        ],
        documents: [],
        remarks: 'Overland import from Nepal.'
      },
      'LI//0046//20.3': {
        serviceProvider: 'TCI Freight',
        transportMode: 'land',
        shipmentType: 'Import',
        services: ['Transportation', 'Warehousing'],
        consigneeId: '10',
        consigneeName: 'Mumbai Fashion House',
        consigneeAddress: 'Fashion Hub, Mumbai, India',
        consigneeContact: '+91 22 9876 5432',
        consigneeEmail: 'imports@mumbaifashion.in',
        originLocation: 'Dhaka, BD',
        destinationLocation: 'Mumbai, IN',
        pickupDate: '2025-10-25',
        deliveryDate: '2025-11-02',
        cargoType: 'Textiles',
        movementType: 'Door-to-Door',
        goods: [
          {
            id: '1',
            description: 'Textile Goods',
            packages: 200,
            weight: 1000,
            volume: 2.2
          }
        ],
        documents: [],
        remarks: 'Textile import from Bangladesh.'
      },
      'LE//0047//21.2': {
        serviceProvider: 'Blue Dart Express',
        transportMode: 'land',
        shipmentType: 'Export',
        services: ['Transportation', 'Customs Clearance'],
        consigneeId: '11',
        consigneeName: 'Sri Lanka Electronics',
        consigneeAddress: '654 Electronics Zone, Colombo, LK',
        consigneeContact: '+94 11 1234 5678',
        consigneeEmail: 'imports@srielec.lk',
        originLocation: 'Bangalore, IN',
        destinationLocation: 'Colombo, LK',
        pickupDate: '2025-11-01',
        deliveryDate: '2025-11-08',
        cargoType: 'Electronics',
        movementType: 'Door-to-Door',
        goods: [
          {
            id: '1',
            description: 'Tech Products',
            packages: 85,
            weight: 450,
            volume: 1.1
          }
        ],
        documents: [],
        remarks: 'Export to Sri Lanka.'
      },
      'LE//0048//22.5': {
        serviceProvider: 'Gati KWE',
        transportMode: 'land',
        shipmentType: 'Export',
        services: ['Transportation', 'Customs Clearance'],
        consigneeId: '12',
        consigneeName: 'Colombo Trading Co',
        consigneeAddress: '321 Trade Center, Colombo, LK',
        consigneeContact: '+94 11 9876 5432',
        consigneeEmail: 'imports@colombotrading.lk',
        originLocation: 'Chennai, IN',
        destinationLocation: 'Colombo, LK',
        pickupDate: '2025-11-03',
        deliveryDate: '2025-11-10',
        cargoType: 'Manufacturing Goods',
        movementType: 'Door-to-Door',
        goods: [
          {
            id: '1',
            description: 'Manufactured Items',
            packages: 120,
            weight: 650,
            volume: 1.5
          }
        ],
        documents: [],
        remarks: 'Manufacturing export to Sri Lanka.'
      }
    };

    const result = mockBookingData[bookingNo] || null;
    console.log('getBookingData result:', result);
    return result;
  };

  // Pre-fill booking data when editing existing booking
  React.useEffect(() => {
    console.log('BookingWizard useEffect - bookingNo prop:', bookingNo);
    
    // Check URL params for booking number
    const urlParams = new URLSearchParams(window.location.search);
    const editBookingNo = urlParams.get('edit');
    const finalBookingNo = editBookingNo || bookingNo;
    
    console.log('URL edit param:', editBookingNo);
    console.log('Final booking number:', finalBookingNo);
    
    if (finalBookingNo) {
      const existingBookingData = getBookingData(finalBookingNo);
      console.log('Found booking data:', existingBookingData);
      
      if (existingBookingData) {
        setBookingData(prev => ({
          ...prev,
          ...existingBookingData
        }));
        console.log('Booking data updated');
      } else {
        console.log('No booking data found for:', finalBookingNo);
      }
    }
  }, [bookingNo]);

  // Pre-stored consignee data
  const preStoredConsignees = [
    {
      id: '1',
      name: 'ANL Industries Pvt Ltd',
      address: '123 Industrial Area, Sector 15, Mumbai, Maharashtra 400001, India',
      contact: '+91 98765 43210',
      email: 'logistics@anlindustries.com'
    },
    {
      id: '2',
      name: 'Kalpataru Logistics Solutions',
      address: '456 Export House, MIDC Area, Pune, Maharashtra 411019, India',
      contact: '+91 87654 32109',
      email: 'operations@kalpatarulogistics.com'
    },
    {
      id: '3',
      name: 'Global Trading Company',
      address: '789 Trade Center, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India',
      contact: '+91 76543 21098',
      email: 'shipping@globaltradingco.in'
    },
    {
      id: '4',
      name: '3PL Logistics Hub',
      address: '321 Warehouse District, Gurgaon, Haryana 122001, India',
      contact: '+91 65432 10987',
      email: 'bookings@3pllogistics.com'
    },
    {
      id: '5',
      name: 'South Asia Trading Company',
      address: 'Plot 15, Industrial Zone, Mumbai, Maharashtra 400703, India',
      contact: '+91 22 3456 7890',
      email: 'imports@southasiatrading.in'
    },
    {
      id: '6',
      name: 'Australian Fine Wines',
      address: '88 Wine Valley Road, East Perth, WA 6004, Australia',
      contact: '+61 8 9876 5432',
      email: 'export@ausfinewines.com.au'
    }
  ];

  // Booking templates
  const bookingTemplates = [
    {
      id: 1,
      name: 'Standard Export - Sea Freight',
      description: 'Common export shipment via sea freight',
      data: {
        serviceProvider: 'Maersk Line',
        transportMode: 'sea',
        shipmentType: 'Export',
        services: ['Forwarding', 'Customs Clearance', 'Transportation'],
        cargoType: 'General Cargo',
        movementType: 'FCL (Full Container Load)'
      }
    },
    {
      id: 2,
      name: 'Air Freight Import',
      description: 'Fast air freight import shipment',
      data: {
        serviceProvider: 'CMA CGM',
        transportMode: 'air',
        shipmentType: 'Import',
        services: ['Forwarding', 'Customs Clearance', 'Warehousing'],
        cargoType: 'General Cargo',
        movementType: 'Direct Shipment'
      }
    },
    {
      id: 3,
      name: 'Dangerous Goods Export',
      description: 'Special handling for dangerous goods',
      data: {
        serviceProvider: 'Hapag-Lloyd',
        transportMode: 'sea',
        shipmentType: 'Export',
        services: ['Forwarding', 'Customs Clearance', 'Transportation', 'Insurance'],
        cargoType: 'Dangerous Goods',
        movementType: 'FCL (Full Container Load)'
      }
    }
  ];
  const steps = [
    { id: 1, title: 'Service Selection', description: 'Choose your logistics services' },
    { id: 2, title: 'Consignee Details', description: 'Enter consignee information' },
    { id: 3, title: 'Route & Dates', description: 'Set pickup and delivery details' },
    { id: 4, title: 'Cargo & Goods', description: 'Specify cargo and goods details' },
    { id: 5, title: 'Documents', description: 'Upload required documents' },
    { id: 6, title: 'Review & Confirm', description: 'Review and submit booking' }
  ];

  // Recent bookings for reuse
  const recentBookings = [
    {
      id: 'MUM/SE/SHP/0024',
      consignee: 'Global Trading Company',
      route: 'Mumbai → New York',
      date: '2025-11-15',
      data: {
        serviceProvider: 'Maersk Line',
        transportMode: 'sea',
        shipmentType: 'Export',
        services: ['Forwarding', 'Customs Clearance'],
        consigneeId: '3',
        consigneeName: 'Global Trading Company',
        consigneeAddress: '789 Trade Center, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India',
        consigneeContact: '+91 76543 21098',
        consigneeEmail: 'shipping@globaltradingco.in',
        originLocation: 'Mumbai, India',
        destinationLocation: 'New York, USA',
        cargoType: 'General Cargo',
        movementType: 'FCL (Full Container Load)'
      }
    },
    {
      id: 'MUM/AE/SHP/0013',
      consignee: 'ANL Industries',
      route: 'Chennai → Hanoi',
      date: '2025-11-10',
      data: {
        serviceProvider: 'MSC Mediterranean Shipping',
        transportMode: 'air',
        shipmentType: 'Export',
        services: ['Forwarding', 'Transportation'],
        consigneeId: '1',
        consigneeName: 'ANL Industries Pvt Ltd',
        consigneeAddress: '123 Industrial Area, Sector 15, Mumbai, Maharashtra 400001, India',
        consigneeContact: '+91 98765 43210',
        consigneeEmail: 'logistics@anlindustries.com',
        originLocation: 'Chennai, India',
        destinationLocation: 'Hanoi, Vietnam',
        cargoType: 'General Cargo',
        movementType: 'Direct Shipment'
      }
    }
  ];

  const serviceProviders = [
    'Maersk Line',
    'MSC Mediterranean Shipping',
    'CMA CGM',
    'CMA CGM India',
    'COSCO Shipping',
    'Hapag-Lloyd',
    'Hapag Lloyd India',
    'ONE (Ocean Network Express)',
    'Evergreen Line',
    'UPS India Pvt Ltd',
    'Maersk India Ltd',
    'MSC India Pvt Ltd',
    'DHL Express India',
    'FedEx India',
    'Air India Cargo',
    'Emirates SkyCargo',
    'VRL Logistics',
    'TCI Freight',
    'Blue Dart Express',
    'Gati KWE',
    'KLN India Pvt Ltd'
  ];

  const transportModes = [
    { value: 'sea', label: 'Sea Freight', icon: '🚢' },
    { value: 'air', label: 'Air Freight', icon: '✈️' },
    { value: 'road', label: 'Road Transport', icon: '🚛' },
    { value: 'rail', label: 'Rail Transport', icon: '🚂' }
  ];

  const availableServices = [
    'Forwarding',
    'Warehousing',
    'Customs Clearance',
    'Transportation',
    'Insurance',
    'Documentation'
  ];

  const cargoTypes = [
    'General Cargo',
    'Perishable Goods',
    'Dangerous Goods',
    'Fragile Items',
    'Bulk Cargo',
    'Containerized Cargo'
  ];

  const movementTypes = [
    'FCL (Full Container Load)',
    'LCL (Less than Container Load)',
    'Door-to-Door',
    'Port-to-Port',
    'Direct Shipment',
    'Transshipment'
  ];

  const documentTypes = [
    'Commercial Invoice',
    'Packing List',
    'Bill of Lading',
    'Certificate of Origin',
    'Export License',
    'Insurance Certificate',
    'Customs Declaration'
  ];

  const updateBookingData = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsigneeSelection = (consigneeId: string) => {
    const selectedConsignee = preStoredConsignees.find(c => c.id === consigneeId);
    if (selectedConsignee) {
      setBookingData(prev => ({
        ...prev,
        consigneeId: consigneeId,
        consigneeName: selectedConsignee.name,
        consigneeAddress: selectedConsignee.address,
        consigneeContact: selectedConsignee.contact,
        consigneeEmail: selectedConsignee.email
      }));
    } else if (consigneeId === 'new') {
      // Clear fields for new consignee
      setBookingData(prev => ({
        ...prev,
        consigneeId: 'new',
        consigneeName: '',
        consigneeAddress: '',
        consigneeContact: '',
        consigneeEmail: ''
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    const services = bookingData.services.includes(service)
      ? bookingData.services.filter(s => s !== service)
      : [...bookingData.services, service];
    updateBookingData('services', services);
  };

  const addGoodsItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      packages: 0,
      weight: 0,
      volume: 0
    };
    updateBookingData('goods', [...bookingData.goods, newItem]);
  };

  const updateGoodsItem = (id: string, field: string, value: any) => {
    const updatedGoods = bookingData.goods.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateBookingData('goods', updatedGoods);
  };

  const removeGoodsItem = (id: string) => {
    const updatedGoods = bookingData.goods.filter(item => item.id !== id);
    updateBookingData('goods', updatedGoods);
  };

  const addDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      type: '',
      name: ''
    };
    updateBookingData('documents', [...bookingData.documents, newDoc]);
  };

  const updateDocument = (id: string, field: string, value: any) => {
    const updatedDocs = bookingData.documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    );
    updateBookingData('documents', updatedDocs);
  };

  const removeDocument = (id: string) => {
    const updatedDocs = bookingData.documents.filter(doc => doc.id !== id);
    updateBookingData('documents', updatedDocs);
  };

  const applyTemplate = (template: any) => {
    setBookingData(prev => ({
      ...prev,
      ...template.data
    }));
    setShowTemplates(false);
  };

  const reuseBooking = (booking: any) => {
    setBookingData(prev => ({
      ...prev,
      ...booking.data
    }));
    setShowTemplates(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', bookingData);
    alert('Booking submitted successfully!');
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => goToStep(step.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-105 ${
              step.id < currentStep 
                ? 'bg-green-500 border-green-500 text-white' 
                : step.id === currentStep
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
            </button>
            <button
              onClick={() => goToStep(step.id)}
              className="ml-3 hidden sm:block text-left hover:bg-gray-50 rounded-md p-2 transition-colors"
              title={`Go to ${step.title}`}
            >
              <p className={`text-sm font-medium transition-colors ${
                step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
              } hover:text-blue-600`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 hover:text-gray-700 transition-colors">{step.description}</p>
            </button>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Service Selection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Provider *
                  </label>
                  <select
                    value={bookingData.serviceProvider}
                    onChange={(e) => updateBookingData('serviceProvider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a provider</option>
                    {serviceProviders.map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipment Type *
                  </label>
                  <div className="flex space-x-4">
                    {['Export', 'Import'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="shipmentType"
                          value={type}
                          checked={bookingData.shipmentType === type}
                          onChange={(e) => updateBookingData('shipmentType', e.target.value)}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Mode *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {transportModes.map(mode => (
                    <label key={mode.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="transportMode"
                        value={mode.value}
                        checked={bookingData.transportMode === mode.value}
                        onChange={(e) => updateBookingData('transportMode', e.target.value)}
                        className="mr-3"
                      />
                      <span className="mr-2">{mode.icon}</span>
                      <span className="text-sm">{mode.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Required
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableServices.map(service => (
                    <label key={service} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={bookingData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="mr-3"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movement Type *
                </label>
                <select
                  value={bookingData.movementType}
                  onChange={(e) => updateBookingData('movementType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select movement type</option>
                  {movementTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Consignee Information</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Consignee *
                </label>
                <select
                  value={bookingData.consigneeId}
                  onChange={(e) => handleConsigneeSelection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose from existing consignees or add new</option>
                  {preStoredConsignees.map(consignee => (
                    <option key={consignee.id} value={consignee.id}>
                      {consignee.name} - {consignee.contact}
                    </option>
                  ))}
                  <option value="new">+ Add New Consignee</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consignee Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.consigneeName}
                    onChange={(e) => updateBookingData('consigneeName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter consignee name"
                    disabled={bookingData.consigneeId && bookingData.consigneeId !== 'new'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.consigneeContact}
                    onChange={(e) => updateBookingData('consigneeContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact number"
                    disabled={bookingData.consigneeId && bookingData.consigneeId !== 'new'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={bookingData.consigneeEmail}
                    onChange={(e) => updateBookingData('consigneeEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    disabled={bookingData.consigneeId && bookingData.consigneeId !== 'new'}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consignee Address *
                  </label>
                  <textarea
                    value={bookingData.consigneeAddress}
                    onChange={(e) => updateBookingData('consigneeAddress', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter complete address"
                    disabled={bookingData.consigneeId && bookingData.consigneeId !== 'new'}
                    required
                  />
                </div>
              </div>
              
              {bookingData.consigneeId && bookingData.consigneeId !== 'new' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    ✓ Consignee details auto-filled from stored records. Select "Add New Consignee" to enter custom details.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Route & Dates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <LocationSelector
                    value={bookingData.originLocation}
                    onChange={(value) => updateBookingData('originLocation', value)}
                    label="Origin Location"
                    placeholder="Select origin location"
                    transportMode={bookingData.transportMode === 'air' ? 'air' : 
                                 bookingData.transportMode === 'sea' ? 'sea' : 'all'}
                    required
                  />
                </div>

                <div>
                  <LocationSelector
                    value={bookingData.destinationLocation}
                    onChange={(value) => updateBookingData('destinationLocation', value)}
                    label="Destination Location"
                    placeholder="Select destination location"
                    transportMode={bookingData.transportMode === 'air' ? 'air' : 
                                 bookingData.transportMode === 'sea' ? 'sea' : 'all'}
                    required
                  />
                </div>

                {bookingData.movementType === 'Door-to-Door' && (
                  <>
                    <div>
                      <LocationSelector
                        value={bookingData.pickupLocation || ''}
                        onChange={(value) => updateBookingData('pickupLocation', value)}
                        label="Pickup Location"
                        placeholder="Select pickup address"
                        transportMode="all"
                        required
                      />
                    </div>

                    <div>
                      <LocationSelector
                        value={bookingData.deliveryLocation || ''}
                        onChange={(value) => updateBookingData('deliveryLocation', value)}
                        label="Delivery Location"
                        placeholder="Select delivery address"
                        transportMode="all"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Pickup Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={bookingData.pickupDate}
                      onChange={(e) => updateBookingData('pickupDate', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={bookingData.deliveryDate}
                      onChange={(e) => updateBookingData('deliveryDate', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Cargo Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo Type *
                  </label>
                  <select
                    value={bookingData.cargoType}
                    onChange={(e) => updateBookingData('cargoType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select cargo type</option>
                    {cargoTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Goods Details</h4>
                  <button
                    onClick={addGoodsItem}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Goods</span>
                  </button>
                </div>

                {bookingData.goods.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No goods added yet. Click "Add Goods" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookingData.goods.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Goods Item</h5>
                          <button
                            onClick={() => removeGoodsItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description *
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateGoodsItem(item.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Describe the goods"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Packages *
                            </label>
                            <input
                              type="number"
                              value={item.packages}
                              onChange={(e) => updateGoodsItem(item.id, 'packages', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              min="0"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Weight (kg) *
                            </label>
                            <input
                              type="number"
                              value={item.weight}
                              onChange={(e) => updateGoodsItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Document Upload</h3>
                <button
                  onClick={addDocument}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Document</span>
                </button>
              </div>

              {bookingData.documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No documents uploaded yet. Click "Add Document" to start.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookingData.documents.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Document</h5>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Document Type
                          </label>
                          <select
                            value={doc.type}
                            onChange={(e) => updateDocument(doc.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select type</option>
                            {documentTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Document Name
                          </label>
                          <input
                            type="text"
                            value={doc.name}
                            onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter document name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload File
                          </label>
                          <input
                            type="file"
                            onChange={(e) => updateDocument(doc.id, 'file', e.target.files?.[0])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Provider:</span> {bookingData.serviceProvider}</p>
                      <p><span className="text-gray-600">Transport:</span> {bookingData.transportMode}</p>
                      <p><span className="text-gray-600">Type:</span> {bookingData.shipmentType}</p>
                      <p><span className="text-gray-600">Services:</span> {bookingData.services.join(', ')}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Consignee</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Name:</span> {bookingData.consigneeName}</p>
                      <p><span className="text-gray-600">Contact:</span> {bookingData.consigneeContact}</p>
                      <p><span className="text-gray-600">Email:</span> {bookingData.consigneeEmail}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Route & Dates</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">From:</span> {bookingData.originLocation}</p>
                      <p><span className="text-gray-600">To:</span> {bookingData.destinationLocation}</p>
                      <p><span className="text-gray-600">Pickup:</span> {bookingData.pickupDate}</p>
                      <p><span className="text-gray-600">Delivery:</span> {bookingData.deliveryDate}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Cargo Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Type:</span> {bookingData.cargoType}</p>
                      <p><span className="text-gray-600">Movement:</span> {bookingData.movementType}</p>
                      <p><span className="text-gray-600">Goods Items:</span> {bookingData.goods.length}</p>
                      <p><span className="text-gray-600">Documents:</span> {bookingData.documents.length}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Additional Remarks</h4>
                  <textarea
                    value={bookingData.remarks}
                    onChange={(e) => updateBookingData('remarks', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter any additional remarks or special instructions..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const editBookingNo = urlParams.get('edit') || bookingNo;
              return editBookingNo ? `Edit Booking - ${editBookingNo}` : 'Book New Shipment';
            })()}
          </h1>
          <p className="mt-2 text-gray-600">
            {(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const editBookingNo = urlParams.get('edit') || bookingNo;
              return editBookingNo
                ? 'Review and modify the booking details below. Required fields are marked with *'
                : 'Fill in the details below to initiate a new cargo booking. Required fields are marked with *';
            })()}
          </p>
          
          {/* Debug info - remove in production */}
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
            <p>Debug Info:</p>
            <p>Booking No Prop: {bookingNo || 'null'}</p>
            <p>URL Edit Param: {new URLSearchParams(window.location.search).get('edit') || 'null'}</p>
            <p>Service Provider: {bookingData.serviceProvider || 'empty'}</p>
            <p>Consignee Name: {bookingData.consigneeName || 'empty'}</p>
          </div>
          
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              Use Template
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              Reuse Previous Booking
            </button>
          </div>
        </div>

        {renderProgressBar()}
        {renderStepContent()}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Save as Draft
            </button>
            
            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{(() => {
                  const urlParams = new URLSearchParams(window.location.search);
                  const editBookingNo = urlParams.get('edit') || bookingNo;
                  return editBookingNo ? 'Update Booking' : 'Submit Booking';
                })()}</span>
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Templates and Reuse Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Choose Template or Reuse Booking</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Templates */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Templates</h3>
                  <div className="space-y-3">
                    {bookingTemplates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <button
                            onClick={() => applyTemplate(template)}
                            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            Use Template
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Provider: {template.data.serviceProvider}</p>
                          <p>Mode: {template.data.transportMode} | Type: {template.data.shipmentType}</p>
                          <p>Services: {template.data.services.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{booking.id}</h4>
                          <button
                            onClick={() => reuseBooking(booking)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                          >
                            Reuse Booking
                          </button>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Consignee: {booking.consignee}</p>
                          <p>Route: {booking.route}</p>
                          <p>Date: {booking.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;