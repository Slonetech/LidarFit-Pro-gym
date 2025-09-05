import React from 'react';

type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

function DataTable<T extends { id?: string | number }>(props: DataTableProps<T>) {
  const { columns, data } = props;
  return (
    <div className="overflow-x-auto bg-white border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="text-left px-4 py-2 font-semibold text-gray-700">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={String(row.id ?? idx)} className="border-t">
              {columns.map((c) => (
                <td key={String(c.key)} className="px-4 py-2">{c.render ? c.render(row) : String((row as any)[c.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;


