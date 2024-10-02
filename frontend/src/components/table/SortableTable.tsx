// src/components/table/SortableTable.tsx
import React, { useState } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface SortConfig<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

interface SortableTableProps<T> {
  headers: Column<T>[];
  data: T[];
  rowKey: keyof T; // 用于指定行的唯一键
}

const SortableTable = <T,>({ headers, data, rowKey }: SortableTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      return [...data].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue < bValue) {
          return direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? " 🔼" : " 🔽";
  };

  return (
    <table className="sortable-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={String(header.key)}
              onClick={() => requestSort(header.key)}
              style={{ cursor: "pointer" }}
            >
              {header.label} {getSortIndicator(header.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={String(row[rowKey])}>
            {headers.map((header) => (
              <td key={String(header.key)}>
                {row[header.key] !== null && row[header.key] !== undefined
                  ? String(row[header.key])
                  : ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
