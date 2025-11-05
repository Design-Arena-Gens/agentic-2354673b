"use client";

import { useState, useEffect } from "react";
import {
  Laptop,
  Monitor,
  Smartphone,
  Server,
  HardDrive,
  Printer,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

type AssetStatus = "verified" | "pending" | "failed" | "retired";
type AssetType =
  | "laptop"
  | "desktop"
  | "monitor"
  | "server"
  | "phone"
  | "tablet"
  | "storage"
  | "printer"
  | "other";

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  model: string;
  manufacturer: string;
  location: string;
  assignedTo: string;
  purchaseDate: string;
  verificationStatus: AssetStatus;
  lastVerified: string;
  notes: string;
}

const assetTypeIcons: Record<AssetType, any> = {
  laptop: Laptop,
  desktop: Monitor,
  monitor: Monitor,
  server: Server,
  phone: Smartphone,
  tablet: Smartphone,
  storage: HardDrive,
  printer: Printer,
  other: HardDrive,
};

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<AssetStatus | "all">("all");
  const [filterType, setFilterType] = useState<AssetType | "all">("all");

  useEffect(() => {
    const stored = localStorage.getItem("assets");
    if (stored) {
      setAssets(JSON.parse(stored));
    } else {
      const sampleAssets: Asset[] = [
        {
          id: "1",
          name: "MacBook Pro 16\"",
          type: "laptop",
          serialNumber: "C02XG0PHLVCF",
          model: "MacBook Pro 16-inch 2023",
          manufacturer: "Apple",
          location: "Office - Floor 3",
          assignedTo: "John Smith",
          purchaseDate: "2023-06-15",
          verificationStatus: "verified",
          lastVerified: "2024-10-20",
          notes: "Standard developer laptop",
        },
        {
          id: "2",
          name: "Dell Latitude 7420",
          type: "laptop",
          serialNumber: "ABCD1234567",
          model: "Latitude 7420",
          manufacturer: "Dell",
          location: "Remote - New York",
          assignedTo: "Sarah Johnson",
          purchaseDate: "2023-03-10",
          verificationStatus: "pending",
          lastVerified: "2024-09-15",
          notes: "Awaiting quarterly verification",
        },
        {
          id: "3",
          name: "Dell UltraSharp U2720Q",
          type: "monitor",
          serialNumber: "CN-0P2KW0-742",
          model: "U2720Q",
          manufacturer: "Dell",
          location: "Office - Floor 2",
          assignedTo: "Mike Davis",
          purchaseDate: "2023-01-20",
          verificationStatus: "verified",
          lastVerified: "2024-10-18",
          notes: "27-inch 4K monitor",
        },
        {
          id: "4",
          name: "HPE ProLiant DL380",
          type: "server",
          serialNumber: "2M34567890",
          model: "ProLiant DL380 Gen10",
          manufacturer: "HPE",
          location: "Data Center - Rack A4",
          assignedTo: "IT Infrastructure",
          purchaseDate: "2022-08-15",
          verificationStatus: "verified",
          lastVerified: "2024-10-25",
          notes: "Production web server",
        },
        {
          id: "5",
          name: "iPhone 14 Pro",
          type: "phone",
          serialNumber: "F2L1234567",
          model: "iPhone 14 Pro",
          manufacturer: "Apple",
          location: "Remote - California",
          assignedTo: "Emily Chen",
          purchaseDate: "2023-09-25",
          verificationStatus: "failed",
          lastVerified: "2024-09-30",
          notes: "Device not responding to verification",
        },
      ];
      setAssets(sampleAssets);
      localStorage.setItem("assets", JSON.stringify(sampleAssets));
    }
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      localStorage.setItem("assets", JSON.stringify(assets));
    }
  }, [assets]);

  const [formData, setFormData] = useState<Partial<Asset>>({
    name: "",
    type: "laptop",
    serialNumber: "",
    model: "",
    manufacturer: "",
    location: "",
    assignedTo: "",
    purchaseDate: "",
    verificationStatus: "pending",
    notes: "",
  });

  const handleAddAsset = () => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: formData.name || "",
      type: formData.type || "laptop",
      serialNumber: formData.serialNumber || "",
      model: formData.model || "",
      manufacturer: formData.manufacturer || "",
      location: formData.location || "",
      assignedTo: formData.assignedTo || "",
      purchaseDate: formData.purchaseDate || "",
      verificationStatus: formData.verificationStatus || "pending",
      lastVerified: new Date().toISOString().split("T")[0],
      notes: formData.notes || "",
    };
    setAssets([...assets, newAsset]);
    setShowAddModal(false);
    setFormData({
      name: "",
      type: "laptop",
      serialNumber: "",
      model: "",
      manufacturer: "",
      location: "",
      assignedTo: "",
      purchaseDate: "",
      verificationStatus: "pending",
      notes: "",
    });
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
    setShowDetailModal(false);
  };

  const handleUpdateStatus = (id: string, status: AssetStatus) => {
    setAssets(
      assets.map((a) =>
        a.id === id
          ? {
              ...a,
              verificationStatus: status,
              lastVerified: new Date().toISOString().split("T")[0],
            }
          : a
      )
    );
    if (selectedAsset?.id === id) {
      setSelectedAsset({
        ...selectedAsset,
        verificationStatus: status,
        lastVerified: new Date().toISOString().split("T")[0],
      });
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || asset.verificationStatus === filterStatus;
    const matchesType = filterType === "all" || asset.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusCounts = {
    all: assets.length,
    verified: assets.filter((a) => a.verificationStatus === "verified").length,
    pending: assets.filter((a) => a.verificationStatus === "pending").length,
    failed: assets.filter((a) => a.verificationStatus === "failed").length,
    retired: assets.filter((a) => a.verificationStatus === "retired").length,
  };

  const getStatusIcon = (status: AssetStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "retired":
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  IT Asset Verification CRM
                </h1>
                <p className="text-sm text-slate-500">
                  Track and verify your IT assets
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Asset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {(["all", "verified", "pending", "failed", "retired"] as const).map(
            (status) => (
              <div
                key={status}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 capitalize">{status}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {statusCounts[status]}
                    </p>
                  </div>
                  {status !== "all" &&
                    getStatusIcon(status as AssetStatus)}
                </div>
              </div>
            )
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as AssetStatus | "all")
              }
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="retired">Retired</option>
            </select>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as AssetType | "all")
              }
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="monitor">Monitor</option>
              <option value="server">Server</option>
              <option value="phone">Phone</option>
              <option value="tablet">Tablet</option>
              <option value="storage">Storage</option>
              <option value="printer">Printer</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAssets.map((asset) => {
                  const Icon = assetTypeIcons[asset.type];
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Icon className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {asset.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {asset.manufacturer} {asset.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 capitalize">
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-slate-600">
                          {asset.serialNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {asset.assignedTo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {asset.location}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            asset.verificationStatus
                          )}`}
                        >
                          <span className="capitalize">
                            {asset.verificationStatus}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowDetailModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(asset.id, "verified")
                            }
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Mark Verified"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No assets found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Add New Asset
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., MacBook Pro 16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as AssetType,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop</option>
                    <option value="monitor">Monitor</option>
                    <option value="server">Server</option>
                    <option value="phone">Phone</option>
                    <option value="tablet">Tablet</option>
                    <option value="storage">Storage</option>
                    <option value="printer">Printer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., C02XG0PHLVCF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., MacBook Pro 16-inch 2023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Apple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Office - Floor 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAsset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Asset Details
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Asset Name
                  </label>
                  <p className="text-slate-900 font-medium">
                    {selectedAsset.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Type
                  </label>
                  <p className="text-slate-900 capitalize">
                    {selectedAsset.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Serial Number
                  </label>
                  <p className="text-slate-900 font-mono">
                    {selectedAsset.serialNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Model
                  </label>
                  <p className="text-slate-900">{selectedAsset.model}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Manufacturer
                  </label>
                  <p className="text-slate-900">{selectedAsset.manufacturer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Location
                  </label>
                  <p className="text-slate-900">{selectedAsset.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Assigned To
                  </label>
                  <p className="text-slate-900">{selectedAsset.assignedTo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Purchase Date
                  </label>
                  <p className="text-slate-900">
                    {selectedAsset.purchaseDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Verification Status
                  </label>
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedAsset.verificationStatus
                    )}`}
                  >
                    <span className="capitalize">
                      {selectedAsset.verificationStatus}
                    </span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Last Verified
                  </label>
                  <p className="text-slate-900">
                    {selectedAsset.lastVerified}
                  </p>
                </div>
              </div>
              {selectedAsset.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Notes
                  </label>
                  <p className="text-slate-900">{selectedAsset.notes}</p>
                </div>
              )}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Update Status
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedAsset.id, "verified")
                    }
                    className="flex-1 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Verified
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedAsset.id, "pending")
                    }
                    className="flex-1 px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedAsset.id, "failed")
                    }
                    className="flex-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Failed
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedAsset.id, "retired")
                    }
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Retired
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => handleDeleteAsset(selectedAsset.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Asset
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
