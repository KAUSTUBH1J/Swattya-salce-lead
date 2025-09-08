import React from 'react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { useCRUD, FormError } from './UserManagement';
import PermissionDataTable from './PermissionDataTable';
import * as z from 'zod';

const partnersSchema = z.object({
  name: z.string().min(2, 'partners name must be at least 2 characters'),
  is_active: z.boolean().default(true)
});

export const PartnersList = () => {
  const crud = useCRUD('partners', partnersSchema);

  const columns = [
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone_number', label: 'Phone Number', sortable: true },
    { key: 'is_active', label: 'Active', sortable: true },
    { 
      key: 'created_at', 
      label: 'Created', 
      sortable: true,
      render: (item) => new Date(item.created_at).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      <PermissionDataTable
        data={crud.data}
        columns={columns}
        loading={crud.loading}
        error={crud.error}
        searchTerm={crud.searchTerm}
        setSearchTerm={crud.setSearchTerm}
        sortField={crud.sortField}
        sortDirection={crud.sortDirection}
        currentPage={crud.currentPage}
        setCurrentPage={crud.setCurrentPage}
        totalPages={crud.totalPages}
        onSort={crud.handleSort}
        onView={crud.openViewDialog}
        onEdit={crud.openEditDialog}
        onDelete={crud.handleDelete}
        onAdd={crud.openCreateDialog}
        title="Channel Partners"
        modulePath="/channel-partners"
        entityName="channel-partners"
      />

      {/* Create/Edit Dialog */}
      <Dialog open={crud.isDialogOpen} onOpenChange={crud.setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{crud.editingItem ? 'Edit Partners' : 'Create Partners'}</DialogTitle>
            <DialogDescription>
              {crud.editingItem ? 'Update partners details' : 'Add a new partners to the system'}
            </DialogDescription>
          </DialogHeader>
          
          {crud.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{crud.error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={crud.form.handleSubmit(crud.handleSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">First Name *</Label>
              <Input
                {...crud.form.register('first_name')}
                id="first_name"
                placeholder="Enter first name"
              />
              <FormError error={crud.form.formState.errors.first_name} />
            </div>

            <div>
              <Label htmlFor="name">Last Name *</Label>
              <Input
                {...crud.form.register('last_name')}
                id="last_name"
                placeholder="Enter last name"
              />
              <FormError error={crud.form.formState.errors.last_name} />
            </div>

            <div>
              <Label htmlFor="name">Email *</Label>
              <Input
                {...crud.form.register('email')}
                id="email"
                placeholder="Enter email"
              />
              <FormError error={crud.form.formState.errors.email} />
            </div>

            <div>
              <Label htmlFor="name">Phone Number *</Label>
              <Input
                {...crud.form.register('phone_number')}
                id="phone_number"
                placeholder="Enter phone number"
              />
              <FormError error={crud.form.formState.errors.phone_number} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                {...crud.form.register('is_active')}
                id="is_active"
                defaultChecked={true}
              />
              <Label htmlFor="is_active">Is Active</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => crud.setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {crud.editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!crud.viewingItem} onOpenChange={() => crud.setViewingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Partners Details</DialogTitle>
          </DialogHeader>
          {crud.viewingItem && (
            <div className="space-y-3">
              <div>
                <Label className="font-medium">First Name:</Label>
                <p className="text-sm text-gray-600">{crud.viewingItem.first_name}</p>
              </div>

              <div>
                <Label className="font-medium">Last Name:</Label>
                <p className="text-sm text-gray-600">{crud.viewingItem.last_name}</p>
              </div>

              <div>
                <Label className="font-medium">Email:</Label>
                <p className="text-sm text-gray-600">{crud.viewingItem.email}</p>
              </div>

              <div>
                <Label className="font-medium">Phone Number:</Label>
                <p className="text-sm text-gray-600">{crud.viewingItem.phone_number}</p>
              </div>

              <div>
                <Label className="font-medium">Active:</Label>
                <Badge variant={crud.viewingItem.is_active ? 'default' : 'destructive'}>
                  {crud.viewingItem.is_active ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <Label className="font-medium">Created:</Label>
                <p className="text-sm text-gray-600">
                  {new Date(crud.viewingItem.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnersList;