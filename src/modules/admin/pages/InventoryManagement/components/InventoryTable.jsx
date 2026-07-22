// src/modules/admin/pages/InventoryManagement/components/InventoryTable.jsx

import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';
import { ResponsiveTable } from '../../../../admin/components/ResponsiveTable';
import { getCategoryStyle, formatDate, getStatus } from '../utils/helpers';

export default function InventoryTable({
  data,
  onEdit,
  onDelete,
  columns,
  animateRows,
  mobileActions,
}) {
  return (
    <ResponsiveTable
      columns={columns}
      data={data}
      animateRows={animateRows || false}
      emptyMessage="No inventory items found."
      mobileActions={mobileActions}
    />
  );
}