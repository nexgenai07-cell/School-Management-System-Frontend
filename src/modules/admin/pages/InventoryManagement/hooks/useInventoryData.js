// src/modules/admin/pages/InventoryManagement/hooks/useInventoryData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePagination } from '../../UserProfileManagement/hooks/usePagination';
import {
  fetchInventory,
  fetchInventorySummary,
} from '../../../../../store/admin/academicsThunks';
import { CATEGORIES, getStatus, LOW_STOCK_THRESHOLD, ITEMS_PER_PAGE } from '../utils/helpers';

export function useInventoryData() {
  const dispatch = useDispatch();
  const { inventory, inventorySummary, inventoryLoading, inventoryUpdating, error } =
    useSelector((state) => state.academics);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // ─── Fetch Data ──────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchInventorySummary());
  }, [dispatch]);

  // ─── Category Options ──────────────────────────────────────────────
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(inventory.map((i) => i.category))];
    return [
      { value: 'all', label: 'All Categories' },
      ...unique
        .filter((c) => c)
        .map((c) => ({ value: c, label: c })),
    ];
  }, [inventory]);

  // ─── Filtered Data ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = inventory;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.item_name?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q) ||
          i.assigned_to_room?.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') {
      list = list.filter((i) => i.category === filterCategory);
    }
    return list;
  }, [inventory, search, filterCategory]);

  // ─── Stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const categories = {};
    inventory.forEach((item) => {
      if (item.category) {
        categories[item.category] = (categories[item.category] || 0) + 1;
      }
    });
    const lowStock = inventory.filter((i) => getStatus(i.total_quantity).color === 'warning' || getStatus(i.total_quantity).color === 'danger').length;
    return {
      total: inventory.length,
      categories: Object.keys(categories).length,
      lowStock,
      categoriesList: Object.entries(categories).map(([name, count]) => ({ name, count })),
    };
  }, [inventory]);

  // ─── Low Stock Items ──────────────────────────────────────────────
  const lowStockItems = useMemo(() => {
    return inventory
      .filter((i) => i.total_quantity <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.total_quantity - b.total_quantity)
      .slice(0, 2);
  }, [inventory]);

  // ─── Pagination ────────────────────────────────────────────────────
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    resetPage,
    totalItems,
  } = usePagination(filtered, ITEMS_PER_PAGE);

  useEffect(() => {
    resetPage();
  }, [search, filterCategory]);

  const refetch = useCallback(() => {
    dispatch(fetchInventory());
    dispatch(fetchInventorySummary());
  }, [dispatch]);

  return {
    inventory,
    inventorySummary,
    inventoryLoading,
    inventoryUpdating,
    error,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    categoryOptions,
    filtered,
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    resetPage,
    itemsPerPage: ITEMS_PER_PAGE,
    stats,
    lowStockItems,
    refetch,
  };
}