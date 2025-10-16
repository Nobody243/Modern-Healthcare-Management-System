/**
 * CSV Export Utility for CureWell HMS Data Tables
 */

export interface ExportColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => string | number | boolean | null | undefined);
}

export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  data: T[],
  columns: ExportColumn<T>[]
): void {
  if (!data || data.length === 0) {
    return;
  }

  // 1. Build Header Row
  const headerRow = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');

  // 2. Build Data Rows
  const dataRows = data.map((row) => {
    return columns
      .map((col) => {
        let value: any;
        if (typeof col.accessor === 'function') {
          value = col.accessor(row);
        } else {
          value = row[col.accessor];
        }

        if (value === null || value === undefined) {
          return '""';
        }

        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(',');
  });

  // 3. Assemble full CSV text with UTF-8 BOM for Excel compatibility
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');

  // 4. Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
