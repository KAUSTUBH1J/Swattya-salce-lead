/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Plus, Building, FileDown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import PermissionDataTable from './PermissionDataTable';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1); // keep totalPages (just no setter)
  const [viewingCompany, setViewingCompany] = useState(null);

  // Master data for display purposes
  const [masterData, setMasterData] = useState({});

  useEffect(() => {
    fetchCompanies();
    fetchMasterData();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/companies`);
      setCompanies(response.data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies');
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const response = await axios.get(`${API}/master-data`);
      setMasterData(response.data || {});
    } catch (err) {
      console.error('Error fetching master data:', err);
      toast.error('Failed to load master data');
    }
  };

  const handleView = (company) => {
    setViewingCompany(company);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building className="h-6 w-6" />
          Companies
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/register-company')}>
            <Plus className="h-4 w-4 mr-2" /> Add Company
          </Button>
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PermissionDataTable
        data={sortedCompanies}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onView={handleView}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        loading={loading}
      />

      <Dialog open={!!viewingCompany} onOpenChange={() => setViewingCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>
          {viewingCompany && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p>{viewingCompany.name}</p>
              </div>
              <div>
                <Label>Address</Label>
                <p>{viewingCompany.address}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p>{viewingCompany.phone}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p>{viewingCompany.email}</p>
              </div>
              <div>
                <Label>Website</Label>
                <p>
                  <a
                    href={viewingCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    {viewingCompany.website}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={viewingCompany.is_active ? 'success' : 'secondary'}>
                  {viewingCompany.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyList;
