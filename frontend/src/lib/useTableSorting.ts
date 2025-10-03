import { useState, useCallback } from "react";
import type { SortingState } from "@tanstack/react-table";

export function useTableSorting(
  onTableChange: Function,
  initialSorting: SortingState = [],
) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const updateTable = useCallback(
    (pageIndex: number, sort: SortingState = sorting) => {
      onTableChange({
        pageIndex,
        sortBy1: sort[0]?.id,
        sortDirection1: sort[0]?.desc ? "desc" : "asc",
        sortBy2: sort[1]?.id,
        sortDirection2: sort[1]?.desc ? "desc" : "asc",
      });
    },
    [onTableChange, sorting],
  );

  const handleSort = (columnId: string) => {
    let newSorting: SortingState = [];

    const existingSortIndex = sorting.findIndex((sort) => sort.id === columnId);

    if (existingSortIndex >= 0) {
      const currentSort = sorting[existingSortIndex];

      if (!currentSort.desc) {
        newSorting = sorting.map((sort) =>
          sort.id === columnId ? { ...sort, desc: true } : sort,
        );
      } else {
        newSorting = sorting.filter((sort) => sort.id !== columnId);
        if (existingSortIndex === 0 && newSorting.length > 0) {
          newSorting = [newSorting[0]];
        }
      }
    } else {
      if (sorting.length >= 2) {
        newSorting = [{ id: columnId, desc: false }, sorting[0]];
      } else {
        newSorting = [...sorting, { id: columnId, desc: false }];
      }
    }

    setSorting(newSorting);
    updateTable(0, newSorting);
  };

  return { sorting, handleSort, updateTable };
}
