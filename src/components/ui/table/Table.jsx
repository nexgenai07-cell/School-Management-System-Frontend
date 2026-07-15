/*
======================================================
Reusable Table Component

Purpose:
- Displays tabular data in a reusable and configurable way.
- Supports custom columns and cell rendering.
- Shows loading and empty states.
- Provides horizontal scrolling for responsive layouts.

Props:
- columns      : Array of column configurations
- data         : Array of row objects
- loading      : Displays loading state
- emptyMessage : Message shown when data is empty
- className    : Additional custom classes
- bgColor      : Background color classes

Column Structure:
{
  key: "full_name",
  label: "Full Name"
}

Custom Render Example:
{
  key: "status",
  label: "Status",
  render: (row) => (
    <Badge>{row.status}</Badge>
  )
}

Usage Example:

const columns = [
  {
    key: "full_name",
    label: "Full Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge>
        {row.status}
      </Badge>
    ),
  },
];

<Table
  columns={columns}
  data={students}
/>

Features:
- Dynamic columns
- Custom cell rendering
- Loading state
- Empty state
- Responsive horizontal scrolling
======================================================
*/

function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data found.",
  className = "",
  bgColor = "bg-white",
}) {
  /*
  ======================================================
  Loading State
  Displayed while data is being fetched
  ======================================================
  */
  if (loading) {
    return (
      <div className="rounded-card border border-slate-200 bg-surface p-8 text-center">
        <p className="text-text-secondary">
          Loading...
        </p>
      </div>
    );
  }

  return (
    /*
    ======================================================
    Table Container
    Provides border, background, shadow,
    and responsive overflow handling
    ======================================================
    */
    <div
      className={`
        overflow-hidden
        rounded-card
        border
        border-slate-200
        ${bgColor}
        shadow-soft
        ${className}
      `}
    >
      {/* Horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          {/* ==================================================
              Table Header
          ================================================== */}
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="
                    border-b
                    border-slate-200
                    px-5
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-text-primary
                  "
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ==================================================
              Table Body
          ================================================== */}
          <tbody>
            {/* Empty State */}
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="
                    px-5
                    py-10
                    text-center
                    text-text-secondary
                  "
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              /*
              ==================================================
              Render Table Rows
              ==================================================
              */
              data.map((row, index) => (
                <tr
                  key={index}
                  className="
                    transition-colors
                    hover:bg-slate-50
                  "
                >
                  {/* Render Table Cells */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="
                        border-b
                        border-slate-100
                        px-5
                        py-4
                        text-sm
                        text-text-secondary
                      "
                    >
                      {/* Use custom renderer if available,
                          otherwise display field value */}
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;