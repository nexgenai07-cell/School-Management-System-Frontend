// src/modules/admin/pages/InventoryManagement/components/CategoryList.jsx

import { getCategoryStyle } from '../utils/helpers';

export default function CategoryList({ categories, onCategoryClick, totalCategories }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Categories</h4>
        <span className="text-xs text-[var(--color-text-muted)]">{totalCategories} total</span>
      </div>
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No categories</p>
        ) : (
          categories.map((cat) => {
            const { Icon, bg, text } = getCategoryStyle(cat.name);
            return (
              <div
                key={cat.name}
                className="flex items-center justify-between p-2.5 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-admin-light)] transition-colors cursor-pointer"
                onClick={() => onCategoryClick(cat.name)}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${bg}`}>
                    <Icon size={14} className={text} />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {cat.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-[var(--color-text-muted)]">{cat.count}</span>
              </div>
            );
          })
        )}
      </div>
      
    </div>
  );
}