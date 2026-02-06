import React, { useState } from 'react';
import CustomsDetailModal from './CustomsDetailModal';
import ColumnCustomizer from './ColumnCustomizer';
import {
  Search,
  Download,
  Filter,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Upload,
  LayoutGrid,
  List
} from 'lucide-react';

interface CustomsDeclaration {
  id: string;
  declarationNo: string;
  shipmentRef: string;
  status: 'pending' | 'submitted' | 'under-review' | 'cleared' | 'hold' | 'rejected' | 'delayed';
  declarationType: 'import' | 'export';
  submissionDate: string;
  dueDate: string;
  clearanceDate?: string;
  dutyAmount: number;
  currency: string;
  shipper: string;
  consignee: string;
  origin: string;
  destination: string;
  commodityCode: string;
  commodityDescription: string;
  value: number;
  weight: number;
  customsOfficer?: string;
  remarks?: string;
  milestone: string;
  lob: string;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
}

type ViewType = 'dashboard' | 'list';

const CustomsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [milestoneFilter, setMilestoneFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<CustomsDeclaration | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedLOB, setSelectedLOB] = useState('AIR IMPORT');

  const [columns, setColumns] = useState<Column[]>([
    { key: 'declarationNo', label: 'Declaration No', visible: true },
    { key: 'shipmentRef', label: 'Shipment Ref', visible: true },
    { key: 'milestone', label: 'Milestone', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'submissionDate', label: 'Submission Date', visible: false },
    { key: 'dueDate', label: 'Due Date / Clearance Date', visible: true },
    { key: 'dutyAmount', label: 'Duty Amount', visible: true },
    { key: 'commodity', label: 'Commodity', visible: true },
    { key: 'value', label: 'Value', visible: true }
  ]);

  // Generate dummy data for all LOBs
  const generateDeclarations = (): CustomsDeclaration[] => {
    const declarations: CustomsDeclaration[] = [];
    let id = 1;
    const today = new Date();

    // AIR IMPORT declarations
    const airImportMilestones = ['BE Filed', 'BE Receipt', 'Assessed', 'Duty Paid', 'DO Collect', 'Examined', 'Out of charge', 'Delivery', 'Bonded', 'Gatepass Received'];
    airImportMilestones.forEach((milestone, idx) => {
      const pending = idx < 7 ? 4 : 3;
      const completed = 75 - (idx * 5);

      for (let i = 0; i < pending; i++) {
        const submissionDate = new Date(today);
        // Mix of recent and older submissions
        const daysAgo = i % 2 === 0 ? Math.floor(Math.random() * 3) : (5 + Math.floor(Math.random() * 10));
        submissionDate.setDate(today.getDate() - daysAgo);
        const dueDate = new Date(submissionDate);
        // Vary due date periods
        const dueDateOffset = 3 + Math.floor(Math.random() * 3);
        dueDate.setDate(submissionDate.getDate() + dueDateOffset);
        const isDelayed = today > dueDate;

        declarations.push({
          id: `${id++}`,
          declarationNo: `AI/IMP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/AI/SHP/${String(id).padStart(4, '0')}`,
          status: isDelayed ? 'delayed' : 'pending',
          declarationType: 'import',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          dutyAmount: 8000 + (Math.random() * 7000),
          currency: 'USD',
          shipper: 'International Traders Ltd',
          consignee: 'Indian Import Solutions',
          origin: 'Singapore, SG',
          destination: 'Mumbai, IN',
          commodityCode: 'HS8471.30',
          commodityDescription: 'Electronic Equipment',
          value: 75000 + (Math.random() * 50000),
          weight: 300 + (Math.random() * 400),
          milestone: milestone,
          lob: 'AIR IMPORT'
        });
      }

      for (let i = 0; i < Math.min(completed, 5); i++) {
        const submissionDate = new Date(today);
        submissionDate.setDate(today.getDate() - (10 + Math.floor(Math.random() * 5)));
        const dueDate = new Date(submissionDate);
        dueDate.setDate(submissionDate.getDate() + 3);
        const clearanceDate = new Date(dueDate);
        clearanceDate.setDate(dueDate.getDate() - 1);

        declarations.push({
          id: `${id++}`,
          declarationNo: `AI/IMP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/AI/SHP/${String(id).padStart(4, '0')}`,
          status: 'cleared',
          declarationType: 'import',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          clearanceDate: clearanceDate.toISOString().split('T')[0],
          dutyAmount: 8000 + (Math.random() * 7000),
          currency: 'USD',
          shipper: 'Global Electronics Inc',
          consignee: 'Tech Distribution India',
          origin: 'Hong Kong, HK',
          destination: 'Mumbai, IN',
          commodityCode: 'HS8542.31',
          commodityDescription: 'Integrated Circuits',
          value: 75000 + (Math.random() * 50000),
          weight: 300 + (Math.random() * 400),
          customsOfficer: 'Officer Kumar',
          remarks: 'Cleared successfully',
          milestone: milestone,
          lob: 'AIR IMPORT'
        });
      }
    });

    // SEA IMPORT declarations
    const seaImportMilestones = ['Document Received', 'BE Filed', 'BE Receipt', 'Assessed', 'Duty Paid', 'DO Collect', 'Examined', 'Out of charge', 'Delivery', 'Bonded', 'Empty Container Received', 'Billing'];
    seaImportMilestones.forEach((milestone, idx) => {
      const pending = idx < 8 ? 3 : 2;
      const completed = 65 - (idx * 4);

      for (let i = 0; i < pending; i++) {
        const submissionDate = new Date(today);
        // Mix of recent and older submissions
        const daysAgo = i % 2 === 0 ? Math.floor(Math.random() * 3) : (5 + Math.floor(Math.random() * 10));
        submissionDate.setDate(today.getDate() - daysAgo);
        const dueDate = new Date(submissionDate);
        // Vary due date periods
        const dueDateOffset = 4 + Math.floor(Math.random() * 3);
        dueDate.setDate(submissionDate.getDate() + dueDateOffset);
        const isDelayed = today > dueDate;

        declarations.push({
          id: `${id++}`,
          declarationNo: `SI/IMP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/SE/SHP/${String(id).padStart(4, '0')}`,
          status: isDelayed ? 'delayed' : 'pending',
          declarationType: 'import',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          dutyAmount: 10000 + (Math.random() * 8000),
          currency: 'USD',
          shipper: 'Ocean Freight Ltd',
          consignee: 'Import Warehouse India',
          origin: 'Shanghai, CN',
          destination: 'Mumbai, IN',
          commodityCode: 'HS8471.60',
          commodityDescription: 'Computer Peripherals',
          value: 95000 + (Math.random() * 60000),
          weight: 500 + (Math.random() * 700),
          milestone: milestone,
          lob: 'SEA IMPORT'
        });
      }

      for (let i = 0; i < Math.min(completed, 4); i++) {
        const submissionDate = new Date(today);
        submissionDate.setDate(today.getDate() - (10 + Math.floor(Math.random() * 5)));
        const dueDate = new Date(submissionDate);
        dueDate.setDate(submissionDate.getDate() + 4);
        const clearanceDate = new Date(dueDate);
        clearanceDate.setDate(dueDate.getDate() - 1);

        declarations.push({
          id: `${id++}`,
          declarationNo: `SI/IMP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/SE/SHP/${String(id).padStart(4, '0')}`,
          status: 'cleared',
          declarationType: 'import',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          clearanceDate: clearanceDate.toISOString().split('T')[0],
          dutyAmount: 10000 + (Math.random() * 8000),
          currency: 'USD',
          shipper: 'Maritime Traders Co',
          consignee: 'Bulk Import India',
          origin: 'Busan, KR',
          destination: 'Mumbai, IN',
          commodityCode: 'HS8473.30',
          commodityDescription: 'Industrial Parts',
          value: 95000 + (Math.random() * 60000),
          weight: 500 + (Math.random() * 700),
          customsOfficer: 'Officer Patel',
          remarks: 'All checks completed',
          milestone: milestone,
          lob: 'SEA IMPORT'
        });
      }
    });

    // AIR EXPORT declarations
    const airExportMilestones = ['SB Filed', 'SB Receipt', 'Assessed', 'Goods Receipt', 'Carted', 'Examined', 'L.E.O', 'Hand over to carrier', 'Loaded', 'EP Copy', 'Billing', 'Reach at Destination', 'Delivery to Consignee'];
    airExportMilestones.forEach((milestone, idx) => {
      const pending = idx < 9 ? 3 : 2;
      const completed = 60 - (idx * 3);

      for (let i = 0; i < pending; i++) {
        const submissionDate = new Date(today);
        // Mix of recent and older submissions
        const daysAgo = i % 2 === 0 ? Math.floor(Math.random() * 3) : (5 + Math.floor(Math.random() * 10));
        submissionDate.setDate(today.getDate() - daysAgo);
        const dueDate = new Date(submissionDate);
        // Vary due date periods
        const dueDateOffset = 3 + Math.floor(Math.random() * 3);
        dueDate.setDate(submissionDate.getDate() + dueDateOffset);
        const isDelayed = today > dueDate;

        declarations.push({
          id: `${id++}`,
          declarationNo: `AE/EXP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/AE/SHP/${String(id).padStart(4, '0')}`,
          status: isDelayed ? 'delayed' : 'pending',
          declarationType: 'export',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          dutyAmount: 0,
          currency: 'USD',
          shipper: 'Indian Exporters Ltd',
          consignee: 'Global Buyers Inc',
          origin: 'Mumbai, IN',
          destination: 'Dubai, AE',
          commodityCode: 'HS6204.62',
          commodityDescription: 'Textile Products',
          value: 45000 + (Math.random() * 35000),
          weight: 250 + (Math.random() * 350),
          milestone: milestone,
          lob: 'AIR EXPORT'
        });
      }

      for (let i = 0; i < Math.min(completed, 3); i++) {
        const submissionDate = new Date(today);
        submissionDate.setDate(today.getDate() - (10 + Math.floor(Math.random() * 5)));
        const dueDate = new Date(submissionDate);
        dueDate.setDate(submissionDate.getDate() + 3);
        const clearanceDate = new Date(dueDate);
        clearanceDate.setDate(dueDate.getDate() - 1);

        declarations.push({
          id: `${id++}`,
          declarationNo: `AE/EXP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/AE/SHP/${String(id).padStart(4, '0')}`,
          status: 'cleared',
          declarationType: 'export',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          clearanceDate: clearanceDate.toISOString().split('T')[0],
          dutyAmount: 0,
          currency: 'USD',
          shipper: 'Export House India',
          consignee: 'International Traders',
          origin: 'Mumbai, IN',
          destination: 'London, GB',
          commodityCode: 'HS5208.32',
          commodityDescription: 'Cotton Fabrics',
          value: 45000 + (Math.random() * 35000),
          weight: 250 + (Math.random() * 350),
          customsOfficer: 'Officer Singh',
          remarks: 'Export cleared',
          milestone: milestone,
          lob: 'AIR EXPORT'
        });
      }
    });

    // SEA EXPORT declarations
    const seaExportMilestones = ['SB Filed', 'SB Receipt', 'Assessed', 'Goods Receipt', 'Carted', 'Examined', 'L.E.O', 'Hand over to carrier', 'Loaded', 'EP Copy', 'Billing', 'Reach at Destination', 'Delivery to Consignee', 'Empty Container Received'];
    seaExportMilestones.forEach((milestone, idx) => {
      const pending = idx < 10 ? 2 : 1;
      const completed = 50 - (idx * 2);

      for (let i = 0; i < pending; i++) {
        const submissionDate = new Date(today);
        // Mix of recent and older submissions
        const daysAgo = i % 2 === 0 ? Math.floor(Math.random() * 3) : (5 + Math.floor(Math.random() * 10));
        submissionDate.setDate(today.getDate() - daysAgo);
        const dueDate = new Date(submissionDate);
        // Vary due date periods
        const dueDateOffset = 4 + Math.floor(Math.random() * 3);
        dueDate.setDate(submissionDate.getDate() + dueDateOffset);
        const isDelayed = today > dueDate;

        declarations.push({
          id: `${id++}`,
          declarationNo: `SE/EXP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/SE/SHP/${String(id).padStart(4, '0')}`,
          status: isDelayed ? 'delayed' : 'pending',
          declarationType: 'export',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          dutyAmount: 0,
          currency: 'USD',
          shipper: 'Bulk Export India',
          consignee: 'Overseas Importers Co',
          origin: 'Mumbai, IN',
          destination: 'Rotterdam, NL',
          commodityCode: 'HS7308.90',
          commodityDescription: 'Metal Structures',
          value: 85000 + (Math.random() * 70000),
          weight: 800 + (Math.random() * 1200),
          milestone: milestone,
          lob: 'SEA EXPORT'
        });
      }

      for (let i = 0; i < Math.min(completed, 2); i++) {
        const submissionDate = new Date(today);
        submissionDate.setDate(today.getDate() - (10 + Math.floor(Math.random() * 5)));
        const dueDate = new Date(submissionDate);
        dueDate.setDate(submissionDate.getDate() + 4);
        const clearanceDate = new Date(dueDate);
        clearanceDate.setDate(dueDate.getDate() - 1);

        declarations.push({
          id: `${id++}`,
          declarationNo: `SE/EXP/2026/${String(id).padStart(3, '0')}`,
          shipmentRef: `MUM/SE/SHP/${String(id).padStart(4, '0')}`,
          status: 'cleared',
          declarationType: 'export',
          submissionDate: submissionDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          clearanceDate: clearanceDate.toISOString().split('T')[0],
          dutyAmount: 0,
          currency: 'USD',
          shipper: 'Marine Export Ltd',
          consignee: 'Continental Buyers',
          origin: 'Mumbai, IN',
          destination: 'Hamburg, DE',
          commodityCode: 'HS8479.89',
          commodityDescription: 'Industrial Machinery',
          value: 85000 + (Math.random() * 70000),
          weight: 800 + (Math.random() * 1200),
          customsOfficer: 'Officer Sharma',
          remarks: 'Successfully exported',
          milestone: milestone,
          lob: 'SEA EXPORT'
        });
      }
    });

    return declarations;
  };

  const customsDeclarations = generateDeclarations();

  const getMilestonesForLOB = (lob: string) => {
    switch (lob) {
      case 'AIR IMPORT':
        return [
          { id: 'be-filed', name: 'BE Filed', key: 'BE Filed' },
          { id: 'be-receipt', name: 'BE Receipt', key: 'BE Receipt' },
          { id: 'assessed', name: 'Assessed', key: 'Assessed' },
          { id: 'duty-paid', name: 'Duty Paid', key: 'Duty Paid' },
          { id: 'do-collect', name: 'DO Collect', key: 'DO Collect' },
          { id: 'examined', name: 'Examined', key: 'Examined' },
          { id: 'out-of-charge', name: 'Out of charge', key: 'Out of charge' },
          { id: 'delivery', name: 'Delivery', key: 'Delivery' },
          { id: 'bonded', name: 'Bonded', key: 'Bonded' },
          { id: 'gatepass', name: 'Gatepass Received', key: 'Gatepass Received' }
        ];
      case 'SEA IMPORT':
        return [
          { id: 'doc-received', name: 'Document Received', key: 'Document Received' },
          { id: 'be-filed', name: 'BE Filed', key: 'BE Filed' },
          { id: 'be-receipt', name: 'BE Receipt', key: 'BE Receipt' },
          { id: 'assessed', name: 'Assessed', key: 'Assessed' },
          { id: 'duty-paid', name: 'Duty Paid', key: 'Duty Paid' },
          { id: 'do-collect', name: 'DO Collect', key: 'DO Collect' },
          { id: 'examined', name: 'Examined', key: 'Examined' },
          { id: 'out-of-charge', name: 'Out of charge', key: 'Out of charge' },
          { id: 'delivery', name: 'Delivery', key: 'Delivery' },
          { id: 'bonded', name: 'Bonded', key: 'Bonded' },
          { id: 'empty-container', name: 'Empty Container Received', key: 'Empty Container Received' },
          { id: 'billing', name: 'Billing', key: 'Billing' }
        ];
      case 'AIR EXPORT':
        return [
          { id: 'sb-filed', name: 'SB Filed', key: 'SB Filed' },
          { id: 'sb-receipt', name: 'SB Receipt', key: 'SB Receipt' },
          { id: 'assessed', name: 'Assessed', key: 'Assessed' },
          { id: 'goods-receipt', name: 'Goods Receipt', key: 'Goods Receipt' },
          { id: 'carted', name: 'Carted', key: 'Carted' },
          { id: 'examined', name: 'Examined', key: 'Examined' },
          { id: 'leo', name: 'L.E.O', key: 'L.E.O' },
          { id: 'handover', name: 'Hand over to carrier', key: 'Hand over to carrier' },
          { id: 'loaded', name: 'Loaded', key: 'Loaded' },
          { id: 'ep-copy', name: 'EP Copy', key: 'EP Copy' },
          { id: 'billing', name: 'Billing', key: 'Billing' },
          { id: 'reach-destination', name: 'Reach at Destination', key: 'Reach at Destination' },
          { id: 'delivery-consignee', name: 'Delivery to Consignee', key: 'Delivery to Consignee' }
        ];
      case 'SEA EXPORT':
        return [
          { id: 'sb-filed', name: 'SB Filed', key: 'SB Filed' },
          { id: 'sb-receipt', name: 'SB Receipt', key: 'SB Receipt' },
          { id: 'assessed', name: 'Assessed', key: 'Assessed' },
          { id: 'goods-receipt', name: 'Goods Receipt', key: 'Goods Receipt' },
          { id: 'carted', name: 'Carted', key: 'Carted' },
          { id: 'examined', name: 'Examined', key: 'Examined' },
          { id: 'leo', name: 'L.E.O', key: 'L.E.O' },
          { id: 'handover', name: 'Hand over to carrier', key: 'Hand over to carrier' },
          { id: 'loaded', name: 'Loaded', key: 'Loaded' },
          { id: 'ep-copy', name: 'EP Copy', key: 'EP Copy' },
          { id: 'billing', name: 'Billing', key: 'Billing' },
          { id: 'reach-destination', name: 'Reach at Destination', key: 'Reach at Destination' },
          { id: 'delivery-consignee', name: 'Delivery to Consignee', key: 'Delivery to Consignee' },
          { id: 'empty-container', name: 'Empty Container Received', key: 'Empty Container Received' }
        ];
      default:
        return [];
    }
  };

  const milestones = getMilestonesForLOB(selectedLOB);

  const getMilestoneStats = (milestone: string) => {
    const filtered = customsDeclarations.filter(d => d.lob === selectedLOB && d.milestone === milestone);
    const pending = filtered.filter(d => d.status === 'pending' || d.status === 'submitted' || d.status === 'under-review' || d.status === 'hold').length;
    const delayed = filtered.filter(d => d.status === 'delayed').length;
    const completed = filtered.filter(d => d.status === 'cleared').length;
    return { pending, delayed, completed };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'hold':
        return 'bg-amber-100 text-amber-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cleared':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'submitted':
      case 'under-review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'hold':
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'import' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredDeclarations = customsDeclarations.filter(declaration => {
    const matchesSearch = Object.values(declaration).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !statusFilter || declaration.status === statusFilter;
    const matchesType = !typeFilter || declaration.declarationType === typeFilter;
    const matchesMilestone = !milestoneFilter || declaration.milestone === milestoneFilter;
    const matchesLOB = declaration.lob === selectedLOB;

    return matchesSearch && matchesStatus && matchesType && matchesMilestone && matchesLOB;
  });

  const handleViewDeclaration = (declaration: CustomsDeclaration) => {
    setSelectedDeclaration(declaration);
    setShowDetailModal(true);
  };

  const handleMilestoneClick = (milestone: string, status: 'pending' | 'delayed' | 'completed') => {
    setMilestoneFilter(milestone);
    if (status === 'pending') {
      setStatusFilter('pending');
    } else if (status === 'delayed') {
      setStatusFilter('delayed');
    } else {
      setStatusFilter('cleared');
    }
    setCurrentView('list');
  };

  const downloadExcel = () => {
    const headers = [
      'Declaration No', 'Shipment Ref', 'Milestone', 'Status', 'Type', 'Submission Date',
      'Clearance Date', 'Duty Amount', 'Shipper', 'Consignee', 'Commodity Code', 'Value'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredDeclarations.map(declaration => [
        declaration.declarationNo,
        declaration.shipmentRef,
        declaration.milestone,
        declaration.status,
        declaration.declarationType,
        declaration.submissionDate,
        declaration.clearanceDate || '',
        declaration.dutyAmount,
        declaration.shipper,
        declaration.consignee,
        declaration.commodityCode,
        declaration.value
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customs_declarations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Customs Jobs & Milestones</h1>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedLOB}
                onChange={(e) => {
                  setSelectedLOB(e.target.value);
                  setMilestoneFilter('');
                  setStatusFilter('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="AIR IMPORT">AIR IMPORT</option>
                <option value="SEA IMPORT">SEA IMPORT</option>
                <option value="AIR EXPORT">AIR EXPORT</option>
                <option value="SEA EXPORT">SEA EXPORT</option>
              </select>
              <div className="flex items-center space-x-0 bg-gray-100 rounded p-1">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentView('list')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded transition-colors ${
                    currentView === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>
          {currentView === 'dashboard' && (
            <div className="text-sm text-gray-600">
              Dashboard: pending vs completed
            </div>
          )}
        </div>

        {currentView === 'dashboard' ? (
          /* Dashboard View */
          <div className="p-6">
            {/* Color Legend */}
            <div className="mb-6 flex items-center justify-center space-x-8 p-4 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm text-gray-700">Delayed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm text-gray-700">Completed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone) => {
                const stats = getMilestoneStats(milestone.key);

                return (
                  <div key={milestone.id} className="border border-gray-200 rounded">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">{milestone.name}</h3>
                      <span className="text-xs text-gray-500">Milestone</span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleMilestoneClick(milestone.key, 'pending')}
                          className="bg-yellow-50 rounded p-3 text-left hover:bg-yellow-100 transition-colors"
                        >
                          <div className="text-xs text-gray-600 mb-1">Pending</div>
                          <div className="text-2xl font-semibold text-yellow-700 mb-1">{stats.pending}</div>
                          <div className="text-xs text-gray-500">active</div>
                        </button>
                        <button
                          onClick={() => handleMilestoneClick(milestone.key, 'delayed')}
                          className="bg-red-50 rounded p-3 text-left hover:bg-red-100 transition-colors border-2 border-red-300"
                        >
                          <div className="text-xs text-gray-600 mb-1">Delayed</div>
                          <div className="text-2xl font-semibold text-red-700 mb-1">{stats.delayed}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>overdue</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleMilestoneClick(milestone.key, 'completed')}
                          className="bg-green-50 rounded p-3 text-left hover:bg-green-100 transition-colors"
                        >
                          <div className="text-xs text-gray-600 mb-1">Completed</div>
                          <div className="text-2xl font-semibold text-green-700 mb-1">{stats.completed}</div>
                          <div className="text-xs text-gray-500">finished</div>
                        </button>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 text-center">
                        Click any card to view jobs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <>
            {/* Search and Filters */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadExcel}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border rounded transition-colors ${
                      showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                  <button
                    onClick={() => setShowColumnCustomizer(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Customise Columns</span>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Milestone</label>
                    <select
                      value={milestoneFilter}
                      onChange={(e) => setMilestoneFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Milestones</option>
                      {milestones.map(m => (
                        <option key={m.id} value={m.key}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="delayed">Delayed</option>
                      <option value="submitted">Submitted</option>
                      <option value="under-review">Under Review</option>
                      <option value="cleared">Cleared</option>
                      <option value="hold">On Hold</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="import">Import</option>
                      <option value="export">Export</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setStatusFilter('');
                        setTypeFilter('');
                        setMilestoneFilter('');
                        setSearchTerm('');
                      }}
                      className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Declarations Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    {columns.filter(col => col.visible).map((column) => (
                      <th key={column.key} className="px-6 py-3 text-left text-sm font-semibold text-black">
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDeclarations.map((declaration) => (
                    <tr key={declaration.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      {columns.filter(col => col.visible).map((column) => {
                        switch (column.key) {
                          case 'declarationNo':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-black font-medium">{declaration.declarationNo}</span>
                              </td>
                            );
                          case 'shipmentRef':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-black font-medium">{declaration.shipmentRef}</span>
                              </td>
                            );
                          case 'milestone':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-black">{declaration.milestone}</span>
                              </td>
                            );
                          case 'status':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded ${getStatusColor(declaration.status)}`}>
                                  {declaration.status.charAt(0).toUpperCase() + declaration.status.slice(1).replace('-', ' ')}
                                </span>
                              </td>
                            );
                          case 'type':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded ${getTypeColor(declaration.declarationType)}`}>
                                  {declaration.declarationType.charAt(0).toUpperCase() + declaration.declarationType.slice(1)}
                                </span>
                              </td>
                            );
                          case 'submissionDate':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-black">{declaration.submissionDate}</span>
                              </td>
                            );
                          case 'dueDate':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                {(declaration.status === 'pending' || declaration.status === 'delayed' || declaration.status === 'submitted' || declaration.status === 'under-review' || declaration.status === 'hold') ? (
                                  <span className={`text-sm ${declaration.status === 'delayed' ? 'text-red-700 font-semibold' : 'text-black'}`}>
                                    {declaration.dueDate}
                                  </span>
                                ) : (
                                  <span className="text-sm text-black">{declaration.clearanceDate}</span>
                                )}
                              </td>
                            );
                          case 'dutyAmount':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-black">
                                  {formatCurrency(declaration.dutyAmount, declaration.currency)}
                                </span>
                              </td>
                            );
                          case 'commodity':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm text-black">{declaration.commodityCode}</div>
                                  <div className="text-xs text-gray-500 truncate max-w-32" title={declaration.commodityDescription}>
                                    {declaration.commodityDescription}
                                  </div>
                                </div>
                              </td>
                            );
                          case 'value':
                            return (
                              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-black">
                                  {formatCurrency(declaration.value, declaration.currency)}
                                </span>
                              </td>
                            );
                          default:
                            return null;
                        }
                      })}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDeclaration(declaration)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {filteredDeclarations.length} of {customsDeclarations.filter(d => d.lob === selectedLOB).length} declarations
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <CustomsDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        declaration={selectedDeclaration}
      />

      <ColumnCustomizer
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </div>
  );
};

export default CustomsPage;
