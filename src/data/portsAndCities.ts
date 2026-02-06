export interface Port {
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  type: 'seaport' | 'airport' | 'city';
}

export const portsAndCities: Port[] = [
  // Major Indian Ports
  { code: 'INMAA', name: 'Chennai Port', city: 'Chennai', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INNSA', name: 'Nhava Sheva Port', city: 'Mumbai', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INCCU', name: 'Kolkata Port', city: 'Kolkata', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INKDL', name: 'Kandla Port', city: 'Kandla', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INCOK', name: 'Kochi Port', city: 'Kochi', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INVTZ', name: 'Visakhapatnam Port', city: 'Visakhapatnam', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INMRM', name: 'Marmagao Port', city: 'Goa', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INTUT', name: 'Tuticorin Port', city: 'Tuticorin', country: 'India', countryCode: 'IN', type: 'seaport' },

  // Indian Airports
  { code: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India', countryCode: 'IN', type: 'airport' },

  // Indian Cities
  { code: 'INMUM', name: 'Mumbai', city: 'Mumbai', country: 'India', countryCode: 'IN', type: 'city' },
  { code: 'INDEL', name: 'Delhi', city: 'Delhi', country: 'India', countryCode: 'IN', type: 'city' },
  { code: 'INBLR', name: 'Bangalore', city: 'Bangalore', country: 'India', countryCode: 'IN', type: 'city' },
  { code: 'INHYD', name: 'Hyderabad', city: 'Hyderabad', country: 'India', countryCode: 'IN', type: 'city' },
  { code: 'INPUN', name: 'Pune', city: 'Pune', country: 'India', countryCode: 'IN', type: 'city' },
  { code: 'INAHM', name: 'Ahmedabad', city: 'Ahmedabad', country: 'India', countryCode: 'IN', type: 'city' },

  // USA Ports
  { code: 'USLAX', name: 'Port of Los Angeles', city: 'Los Angeles', country: 'United States', countryCode: 'US', type: 'seaport' },
  { code: 'USLGB', name: 'Port of Long Beach', city: 'Long Beach', country: 'United States', countryCode: 'US', type: 'seaport' },
  { code: 'USNYC', name: 'Port of New York', city: 'New York', country: 'United States', countryCode: 'US', type: 'seaport' },
  { code: 'USSAV', name: 'Port of Savannah', city: 'Savannah', country: 'United States', countryCode: 'US', type: 'seaport' },
  { code: 'USMIA', name: 'Port of Miami', city: 'Miami', country: 'United States', countryCode: 'US', type: 'seaport' },
  { code: 'USSEA', name: 'Port of Seattle', city: 'Seattle', country: 'United States', countryCode: 'US', type: 'seaport' },

  // USA Airports
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', countryCode: 'US', type: 'airport' },

  // European Ports
  { code: 'NLRTM', name: 'Port of Rotterdam', city: 'Rotterdam', country: 'Netherlands', countryCode: 'NL', type: 'seaport' },
  { code: 'DEHAM', name: 'Port of Hamburg', city: 'Hamburg', country: 'Germany', countryCode: 'DE', type: 'seaport' },
  { code: 'BEANR', name: 'Port of Antwerp', city: 'Antwerp', country: 'Belgium', countryCode: 'BE', type: 'seaport' },
  { code: 'FRLEH', name: 'Port of Le Havre', city: 'Le Havre', country: 'France', countryCode: 'FR', type: 'seaport' },
  { code: 'GBFXT', name: 'Port of Felixstowe', city: 'Felixstowe', country: 'United Kingdom', countryCode: 'GB', type: 'seaport' },
  { code: 'ITGOA', name: 'Port of Genoa', city: 'Genoa', country: 'Italy', countryCode: 'IT', type: 'seaport' },

  // European Airports
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', countryCode: 'FR', type: 'airport' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', type: 'airport' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', type: 'airport' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', countryCode: 'BE', type: 'airport' },
  { code: 'FCO', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy', countryCode: 'IT', type: 'airport' },

  // Middle East Ports
  { code: 'AEJEA', name: 'Jebel Ali Port', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', type: 'seaport' },
  { code: 'AESHJ', name: 'Port of Sharjah', city: 'Sharjah', country: 'United Arab Emirates', countryCode: 'AE', type: 'seaport' },
  { code: 'INJNP', name: 'Nhava Sheva Port (JNPT)', city: 'Mumbai', country: 'India', countryCode: 'IN', type: 'seaport' },
  { code: 'INMUN', name: 'Mumbai Port', city: 'Mumbai', country: 'India', countryCode: 'IN', type: 'seaport' },

  // Middle East Airports
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', type: 'airport' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', countryCode: 'QA', type: 'airport' },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', type: 'airport' },

  // Asian Ports
  { code: 'SGSIN', name: 'Port of Singapore', city: 'Singapore', country: 'Singapore', countryCode: 'SG', type: 'seaport' },
  { code: 'HKHKG', name: 'Port of Hong Kong', city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', type: 'seaport' },
  { code: 'CNSHA', name: 'Port of Shanghai', city: 'Shanghai', country: 'China', countryCode: 'CN', type: 'seaport' },
  { code: 'CNSZX', name: 'Port of Shenzhen', city: 'Shenzhen', country: 'China', countryCode: 'CN', type: 'seaport' },
  { code: 'JPYOK', name: 'Port of Yokohama', city: 'Yokohama', country: 'Japan', countryCode: 'JP', type: 'seaport' },

  // Asian Airports
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', countryCode: 'SG', type: 'airport' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', type: 'airport' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', countryCode: 'CN', type: 'airport' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP', type: 'airport' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', countryCode: 'KR', type: 'airport' },

  // Australian Ports
  { code: 'AUSYD', name: 'Port of Sydney', city: 'Sydney', country: 'Australia', countryCode: 'AU', type: 'seaport' },
  { code: 'AUMEL', name: 'Port of Melbourne', city: 'Melbourne', country: 'Australia', countryCode: 'AU', type: 'seaport' },
  { code: 'AUFRE', name: 'Port of Fremantle', city: 'Perth', country: 'Australia', countryCode: 'AU', type: 'seaport' },

  // Australian Airports
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', countryCode: 'AU', type: 'airport' },

  // South American Ports
  { code: 'BRSSZ', name: 'Port of Santos', city: 'Santos', country: 'Brazil', countryCode: 'BR', type: 'seaport' },
  { code: 'BRRIG', name: 'Port of Rio Grande', city: 'Rio Grande', country: 'Brazil', countryCode: 'BR', type: 'seaport' },
  { code: 'CLVAP', name: 'Port of Valparaiso', city: 'Valparaiso', country: 'Chile', countryCode: 'CL', type: 'seaport' },

  // African Ports
  { code: 'ZADUR', name: 'Port of Durban', city: 'Durban', country: 'South Africa', countryCode: 'ZA', type: 'seaport' },
  { code: 'ZACPT', name: 'Port of Cape Town', city: 'Cape Town', country: 'South Africa', countryCode: 'ZA', type: 'seaport' },
  { code: 'EGALY', name: 'Port of Alexandria', city: 'Alexandria', country: 'Egypt', countryCode: 'EG', type: 'seaport' },

  // Southeast Asian Ports
  { code: 'VNVUT', name: 'Vung Tau Port', city: 'Vung Tau', country: 'Vietnam', countryCode: 'VN', type: 'seaport' },
  { code: 'VNSGN', name: 'Ho Chi Minh Port', city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', type: 'seaport' },
  { code: 'THBKK', name: 'Port of Bangkok', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', type: 'seaport' },
  { code: 'MYPEN', name: 'Port of Penang', city: 'Penang', country: 'Malaysia', countryCode: 'MY', type: 'seaport' },

  // Southeast Asian Airports
  { code: 'SGN', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', type: 'airport' },
  { code: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', countryCode: 'VN', type: 'airport' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', type: 'airport' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', type: 'airport' },
  { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', countryCode: 'ID', type: 'airport' },

  // Bangladesh
  { code: 'BDCGP', name: 'Chittagong Port', city: 'Chittagong', country: 'Bangladesh', countryCode: 'BD', type: 'seaport' },
  { code: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', type: 'airport' },

  // Sri Lanka
  { code: 'LKCMB', name: 'Port of Colombo', city: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', type: 'seaport' },
  { code: 'CMB', name: 'Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', type: 'airport' }
];

// Helper functions
export const getPortsByType = (type: 'seaport' | 'airport' | 'city') => {
  return portsAndCities.filter(port => port.type === type);
};

export const getPortsByCountry = (countryCode: string) => {
  return portsAndCities.filter(port => port.countryCode === countryCode);
};

export const searchPorts = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return portsAndCities.filter(port => 
    port.name.toLowerCase().includes(lowerQuery) ||
    port.city.toLowerCase().includes(lowerQuery) ||
    port.country.toLowerCase().includes(lowerQuery) ||
    port.code.toLowerCase().includes(lowerQuery)
  );
};

export const getPortByCode = (code: string) => {
  return portsAndCities.find(port => port.code === code);
};

export const formatPortDisplay = (port: Port) => {
  return `${port.name} - ${port.city}, ${port.countryCode}`;
};