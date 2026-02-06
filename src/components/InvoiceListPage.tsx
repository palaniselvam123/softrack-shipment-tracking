import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, Settings, Star, Calendar, DollarSign, Eye, FileText, ChevronUp, ChevronDown, Mail, AlertTriangle } from 'lucide-react';
import ColumnCustomizer from './ColumnCustomizer';
import InvoiceDetailModal from './InvoiceDetailModal';
import SendMailModal from './SendMailModal';

interface Invoice {
  id: string;
  invoiceRef: string;
  invoiceStatus: string;
  invoiceDate: string;
  amount: number;
  currency: string;
  dueDate: string;
  shipmentRef: string;
  vendor: string;
  description: string;
  paymentTerms: string;
  createdBy: string;
  lastUpdated: string;
  pol: string;
  pod: string;
  containerNumbers: string[];
  shipper: string;
  consignee: string;
  poRefNo: string;
  vessel: string;
  voyage: string;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
}

const InvoiceListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['IDDEC026748', 'IDDIC006490']));
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showSendMail, setShowSendMail] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState({ from: '', to: '' });
  const [amountRangeFilter, setAmountRangeFilter] = useState({ min: '', max: '' });

  const [columns, setColumns] = useState<Column[]>([
    { key: 'invoiceRef', label: 'Invoice Ref.', visible: true, sortable: true },
    { key: 'invoiceStatus', label: 'Invoice Status', visible: true, sortable: true },
    { key: 'invoiceDate', label: 'Invoice Date', visible: true, sortable: true },
    { key: 'amount', label: 'Amount', visible: true, sortable: true },
    { key: 'currency', label: 'Currency', visible: true, sortable: true },
    { key: 'dueDate', label: 'Due Date', visible: true, sortable: true },
    { key: 'shipmentRef', label: 'Shipment Ref.', visible: true, sortable: true },
    { key: 'shipper', label: 'Shipper', visible: true, sortable: false },
    { key: 'consignee', label: 'Consignee', visible: true, sortable: false },
    { key: 'poRefNo', label: 'PO Ref No.', visible: true, sortable: false },
    { key: 'pol', label: 'POL', visible: true, sortable: false },
    { key: 'pod', label: 'POD', visible: true, sortable: false },
    { key: 'vendor', label: 'Vendor', visible: true, sortable: false },
    { key: 'description', label: 'Description', visible: false, sortable: false },
    { key: 'paymentTerms', label: 'Payment Terms', visible: false, sortable: false },
    { key: 'createdBy', label: 'Created By', visible: false, sortable: false },
    { key: 'lastUpdated', label: 'Last Updated', visible: false, sortable: true }
  ]);

  // Mock invoice data based on the screenshot
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoiceRef: 'IDDEC026748',
      invoiceStatus: 'OPEN',
      invoiceDate: '28-JUL-2025',
      amount: 2588500,
      currency: 'IDR',
      dueDate: '27-AUG-2025',
      shipmentRef: 'DJA1390437',
      vendor: 'PT Logistics Indonesia',
      description: 'Ocean freight charges for FCL shipment',
      paymentTerms: '30 Days',
      createdBy: 'Sarah Johnson',
      lastUpdated: '2025-07-28 14:30',
      pol: 'INMAA (Chennai)',
      pod: 'IDJKT (Jakarta)',
      containerNumbers: ['MEDU6997206', 'BKSU9898988'],
      shipper: 'Textile Exports India Ltd',
      consignee: 'PT Jakarta Trading Co',
      poRefNo: 'PO-2025-001234',
      vessel: 'MSC MEDITERRANEAN',
      voyage: 'KE340R'
    },
    {
      id: '2',
      invoiceRef: 'IDDEC026093',
      invoiceStatus: 'OPEN',
      invoiceDate: '25-JUL-2025',
      amount: 5523720,
      currency: 'IDR',
      dueDate: '24-AUG-2025',
      shipmentRef: 'DJA1388031',
      vendor: 'Jakarta Port Services',
      description: 'Port handling and customs clearance',
      paymentTerms: '30 Days',
      createdBy: 'Mike Chen',
      lastUpdated: '2025-07-25 09:15',
      pol: 'SGSIN (Singapore)',
      pod: 'IDJKT (Jakarta)',
      containerNumbers: ['COSCO123456'],
      shipper: 'Singapore Electronics Pte Ltd',
      consignee: 'Indonesian Tech Solutions',
      poRefNo: 'PO-2025-005678',
      vessel: 'COSCO SHIPPING',
      voyage: 'CS445W'
    },
    {
      id: '3',
      invoiceRef: 'IDDEC025953',
      invoiceStatus: 'OPEN',
      invoiceDate: '25-JUL-2025',
      amount: 95402465,
      currency: 'IDR',
      dueDate: '24-AUG-2025',
      shipmentRef: 'DJA1387686',
      vendor: 'Maersk Line Indonesia',
      description: 'Container shipping and documentation',
      paymentTerms: '30 Days',
      createdBy: 'Emma Wilson',
      lastUpdated: '2025-07-25 16:45',
      pol: 'INMAA (Chennai)',
      pod: 'IDSBY (Surabaya)',
      containerNumbers: ['MAEU8547321', 'HLCUBO9876'],
      shipper: 'Chennai Manufacturing Ltd',
      consignee: 'Surabaya Import House',
      poRefNo: 'PO-2025-009876',
      vessel: 'MAERSK ALABAMA',
      voyage: 'MA234E'
    },
    {
      id: '4',
      invoiceRef: 'IDDEC024256',
      invoiceStatus: 'OPEN',
      invoiceDate: '18-JUL-2025',
      amount: 687250,
      currency: 'IDR',
      dueDate: '17-AUG-2025',
      shipmentRef: 'DJA1383869',
      vendor: 'Indonesian Customs',
      description: 'Import duty and taxes',
      paymentTerms: '30 Days',
      createdBy: 'David Brown',
      lastUpdated: '2025-07-18 11:20',
      pol: 'USNYC (New York)',
      pod: 'IDJKT (Jakarta)',
      containerNumbers: ['TEMU4567890'],
      shipper: 'American Steel Corp',
      consignee: 'Jakarta Steel Industries',
      poRefNo: 'PO-2025-012345',
      vessel: 'EVERGREEN STAR',
      voyage: 'EG567N'
    },
    {
      id: '5',
      invoiceRef: 'IDDIC006490',
      invoiceStatus: 'OPEN',
      invoiceDate: '09-JUL-2025',
      amount: 92311020,
      currency: 'IDR',
      dueDate: '08-AUG-2025',
      shipmentRef: 'AYN1257932',
      vendor: 'CMA CGM Indonesia',
      description: 'LCL consolidation and delivery',
      paymentTerms: '30 Days',
      createdBy: 'Lisa Garcia',
      lastUpdated: '2025-07-09 13:10',
      pol: 'DEHAM (Hamburg)',
      pod: 'IDJKT (Jakarta)',
      containerNumbers: ['CCLU1234567'],
      shipper: 'German Auto Parts GmbH',
      consignee: 'Indonesian Auto Assembly',
      poRefNo: 'PO-2025-054321',
      vessel: 'CMA CGM MARCO POLO',
      voyage: 'MP789W'
    },
    {
      id: '6',
      invoiceRef: 'IDDEC016813',
      invoiceStatus: 'OVERDUE',
      invoiceDate: '19-JUN-2025',
      amount: 666000,
      currency: 'IDR',
      dueDate: '19-JUL-2025',
      shipmentRef: 'DJA1365665',
      vendor: 'Surabaya Logistics Hub',
      description: 'Warehousing and distribution services',
      paymentTerms: '30 Days',
      createdBy: 'Robert Taylor',
      lastUpdated: '2025-06-19 08:45',
      pol: 'NLRTM (Rotterdam)',
      pod: 'IDSBY (Surabaya)',
      containerNumbers: ['OOLU7654321'],
      shipper: 'Dutch Flower Exports BV',
      consignee: 'Surabaya Garden Center',
      poRefNo: 'PO-2025-098765',
      vessel: 'OOCL TOKYO',
      voyage: 'OT123E'
    },
    {
      id: '7',
      invoiceRef: 'IDDEC014804',
      invoiceStatus: 'PAID',
      invoiceDate: '02-JUN-2025',
      amount: 666000,
      currency: 'IDR',
      dueDate: '02-JUL-2025',
      shipmentRef: 'DJA1366375',
      vendor: 'Bali Freight Services',
      description: 'Air freight and express delivery',
      paymentTerms: '30 Days',
      createdBy: 'Anna Martinez',
      lastUpdated: '2025-06-02 15:20',
      pol: 'SGSIN (Singapore)',
      pod: 'IDDPS (Denpasar)',
      containerNumbers: ['AIRFREIGHT001'],
      shipper: 'Singapore Fashion House',
      consignee: 'Bali Boutique Collection',
      poRefNo: 'PO-2025-111222',
      vessel: 'AIR FREIGHT',
      voyage: 'AF001'
    },
    {
      id: '8',
      invoiceRef: 'IDDEC012456',
      invoiceStatus: 'PROCESSING',
      invoiceDate: '15-MAY-2025',
      amount: 1234567,
      currency: 'IDR',
      dueDate: '14-JUN-2025',
      shipmentRef: 'DJA1345678',
      vendor: 'Medan Port Authority',
      description: 'Terminal handling charges',
      paymentTerms: '30 Days',
      createdBy: 'James Anderson',
      lastUpdated: '2025-05-15 10:30',
      pol: 'MYPEN (Penang)',
      pod: 'IDMDN (Medan)',
      containerNumbers: ['EVERGREEN789'],
      shipper: 'Malaysian Palm Oil Ltd',
      consignee: 'Medan Oil Processing',
      poRefNo: 'PO-2025-333444',
      vessel: 'EVERGREEN HARMONY',
      voyage: 'EH456S'
    },
    {
      id: '9',
      invoiceRef: 'IDDEC011234',
      invoiceStatus: 'CANCELLED',
      invoiceDate: '01-MAY-2025',
      amount: 987654,
      currency: 'IDR',
      dueDate: '31-MAY-2025',
      shipmentRef: 'DJA1334567',
      vendor: 'Batam Shipping Co',
      description: 'Cancelled shipment refund',
      paymentTerms: '30 Days',
      createdBy: 'Maria Rodriguez',
      lastUpdated: '2025-05-01 12:15',
      pol: 'SGSIN (Singapore)',
      pod: 'IDBTM (Batam)',
      containerNumbers: ['CANCELLED001'],
      shipper: 'Singapore Machinery Pte',
      consignee: 'Batam Industrial Park',
      poRefNo: 'PO-2025-555666',
      vessel: 'CANCELLED',
      voyage: 'CANCELLED'
    },
    {
      id: '10',
      invoiceRef: 'IDDEC009876',
      invoiceStatus: 'DISPUTED',
      invoiceDate: '20-APR-2025',
      amount: 2345678,
      currency: 'IDR',
      dueDate: '20-MAY-2025',
      shipmentRef: 'DJA1323456',
      vendor: 'Palembang Logistics',
      description: 'Disputed charges under review',
      paymentTerms: '30 Days',
      createdBy: 'Kevin Lee',
      lastUpdated: '2025-04-20 14:45',
      pol: 'THBKK (Bangkok)',
      pod: 'IDPLG (Palembang)',
      containerNumbers: ['DISPUTED001', 'DISPUTED002'],
      shipper: 'Thai Rice Exporters Co',
      consignee: 'Palembang Food Distributors',
      poRefNo: 'PO-2025-777888',
      vessel: 'THAI NAVIGATOR',
      voyage: 'TN789N'
    }
  ];

  const toggleFavorite = (invoiceRef: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(invoiceRef)) {
      newFavorites.delete(invoiceRef);
    } else {
      newFavorites.add(invoiceRef);
    }
    setFavorites(newFavorites);
  };

  const toggleSelectInvoice = (invoiceId: string) => {
    const newSelected = new Set(selectedInvoices);
    if (newSelected.has(invoiceId)) {
      newSelected.delete(invoiceId);
    } else {
      newSelected.add(invoiceId);
    }
    setSelectedInvoices(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(filteredInvoices.map(inv => inv.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'disputed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const filteredInvoices = useMemo(() => {
    let filtered = mockInvoices.filter(invoice => {
      const matchesSearch = Object.values(invoice).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesStatus = !statusFilter || invoice.invoiceStatus.toLowerCase() === statusFilter.toLowerCase();
      const matchesCurrency = !currencyFilter || invoice.currency === currencyFilter;
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRangeFilter.from || dateRangeFilter.to) {
        const invoiceDate = new Date(invoice.invoiceDate);
        if (dateRangeFilter.from) {
          matchesDateRange = matchesDateRange && invoiceDate >= new Date(dateRangeFilter.from);
        }
        if (dateRangeFilter.to) {
          matchesDateRange = matchesDateRange && invoiceDate <= new Date(dateRangeFilter.to);
        }
      }
      
      // Amount range filter
      let matchesAmountRange = true;
      if (amountRangeFilter.min || amountRangeFilter.max) {
        if (amountRangeFilter.min) {
          matchesAmountRange = matchesAmountRange && invoice.amount >= parseFloat(amountRangeFilter.min);
        }
        if (amountRangeFilter.max) {
          matchesAmountRange = matchesAmountRange && invoice.amount <= parseFloat(amountRangeFilter.max);
        }
      }

      return matchesSearch && matchesStatus && matchesCurrency && matchesDateRange && matchesAmountRange;
    });

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof Invoice];
        let bValue = b[sortField as keyof Invoice];
        
        // Handle numeric sorting for amount
        if (sortField === 'amount') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }
        
        // Handle date sorting
        if (sortField === 'invoiceDate' || sortField === 'dueDate') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [mockInvoices, searchTerm, statusFilter, currencyFilter, dateRangeFilter, amountRangeFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    const column = columns.find(col => col.key === field);
    if (!column?.sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const downloadExcel = () => {
    const headers = columns.filter(col => col.visible).map(col => col.label);
    
    const csvContent = [
      headers.join(','),
      ...filteredInvoices.map(invoice => 
        columns.filter(col => col.visible).map(col => {
          const value = invoice[col.key as keyof Invoice];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrencyFilter('');
    setDateRangeFilter({ from: '', to: '' });
    setAmountRangeFilter({ min: '', max: '' });
    setSortField('');
    setSortDirection('asc');
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleSendMail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowSendMail(true);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // Generate PDF content
    const pdfContent = generateInvoicePDF(invoice);
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${invoice.invoiceRef}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRaiseDispute = (invoice: Invoice) => {
    // In a real app, this would open a dispute form or modal
    const confirmed = window.confirm(`Are you sure you want to raise a dispute for invoice ${invoice.invoiceRef}?`);
    if (confirmed) {
      console.log('Raising dispute for invoice:', invoice.invoiceRef);
      // Here you would typically:
      // 1. Open a dispute form modal
      // 2. Send API request to create dispute
      // 3. Update invoice status to 'DISPUTED'
      alert(`Dispute raised for invoice ${invoice.invoiceRef}. Our team will review it within 24 hours.`);
    }
  };
  const generateInvoicePDF = (invoice: Invoice): string => {
    // Simple PDF-like content (in a real app, use a PDF library like jsPDF)
    return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(INVOICE: ${invoice.invoiceRef}) Tj
0 -20 Td
(Date: ${invoice.invoiceDate}) Tj
0 -20 Td
(Amount: ${formatCurrency(invoice.amount, invoice.currency)} ${invoice.currency}) Tj
0 -20 Td
(Status: ${invoice.status}) Tj
0 -20 Td
(Vendor: ${invoice.vendor}) Tj
0 -20 Td
(Description: ${invoice.description}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
456
%%EOF`;
  };
  const visibleColumns = columns.filter(col => col.visible);
  const uniqueStatuses = [...new Set(mockInvoices.map(inv => inv.invoiceStatus))];
  const uniqueCurrencies = [...new Set(mockInvoices.map(inv => inv.currency))];

  const renderSortIcon = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return null;
    
    if (sortField === columnKey) {
      return sortDirection === 'asc' ? 
        <ChevronUp className="w-4 h-4 text-blue-600" /> : 
        <ChevronDown className="w-4 h-4 text-blue-600" />;
    }
    return <ChevronUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
  };

  const renderCellContent = (invoice: Invoice, columnKey: string) => {
    switch (columnKey) {
      case 'invoiceRef':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(invoice.invoiceRef);
              }}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Star 
                className={`w-4 h-4 ${
                  favorites.has(invoice.invoiceRef) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : ''
                }`} 
              />
            </button>
            <span className="text-sm font-medium text-blue-600">{invoice.invoiceRef}</span>
          </div>
        );
      case 'invoiceStatus':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.invoiceStatus)}`}>
            {invoice.invoiceStatus}
          </span>
        );
      case 'amount':
        return (
          <div className="text-right">
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(invoice.amount, invoice.currency)}
            </span>
          </div>
        );
      case 'invoiceDate':
      case 'dueDate':
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{formatDate(invoice[columnKey])}</span>
          </div>
        );
      case 'shipmentRef':
        return (
          <span className="text-sm font-medium text-blue-600">{invoice.shipmentRef}</span>
        );
      case 'shipper':
      case 'consignee':
        return (
          <div className="max-w-xs">
            <span className="text-sm text-gray-900 truncate block" title={invoice[columnKey]}>
              {invoice[columnKey]}
            </span>
          </div>
        );
      case 'poRefNo':
        return (
          <span className="text-sm font-medium text-gray-900">{invoice.poRefNo}</span>
        );
      case 'pol':
      case 'pod':
        return (
          <span className="text-sm text-gray-900">{invoice[columnKey]}</span>
        );
      case 'currency':
        return (
          <span className="text-sm font-medium text-gray-900">{invoice.currency}</span>
        );
      default:
        return <span className="text-sm text-gray-900">{invoice[columnKey as keyof Invoice] || ''}</span>;
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          </div>
          
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={downloadExcel}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button 
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span>Clear All</span>
                </button>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                    showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <button 
                  onClick={() => setShowColumnCustomizer(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Columns</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select 
                    value={currencyFilter}
                    onChange={(e) => setCurrencyFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Currencies</option>
                    {uniqueCurrencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={dateRangeFilter.from}
                    onChange={(e) => setDateRangeFilter(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={dateRangeFilter.to}
                    onChange={(e) => setDateRangeFilter(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {selectedInvoices.size > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  {selectedInvoices.size} invoice{selectedInvoices.size !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                    Bulk Actions
                  </button>
                  <button 
                    onClick={() => setSelectedInvoices(new Set())}
                    className="px-3 py-1 border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.size === filteredInvoices.length && filteredInvoices.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  {visibleColumns.map((column) => (
                    <th 
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      } transition-colors`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-2">
                        {column.key === 'invoiceRef' && <Star className="w-4 h-4" />}
                        <span>{column.label}</span>
                        {renderSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleInvoiceClick(invoice)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.has(invoice.id)}
                        onChange={() => toggleSelectInvoice(invoice.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        {renderCellContent(invoice, column.key)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewInvoice(invoice);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPDF(invoice);
                          }}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendMail(invoice);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRaiseDispute(invoice);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Raise Dispute"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredInvoices.length} of {mockInvoices.length} invoices
                {selectedInvoices.size > 0 && ` (${selectedInvoices.size} selected)`}
              </p>
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">‹ Previous</button>
                <span className="px-3 py-1 text-sm">Page 1 of 1</span>
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next ›</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <ColumnCustomizer
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        columns={columns}
        onColumnsChange={setColumns}
      />
      
      <InvoiceDetailModal
        isOpen={showInvoiceDetail}
        onClose={() => setShowInvoiceDetail(false)}
        invoice={selectedInvoice}
      />
      
      <SendMailModal
        isOpen={showSendMail}
        onClose={() => setShowSendMail(false)}
        invoice={selectedInvoice}
      />
    </>
  );
};

export default InvoiceListPage;