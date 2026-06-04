export default function Table({ columns, data, onDelete, emptyMsg = "No records found" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: "1px solid #1e2236",
                  whiteSpace: "nowrap",
                }}
              >
                {column.label}
              </th>
            ))}
            {onDelete && <th style={{ padding: "10px 16px", borderBottom: "1px solid #1e2236" }} />}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ padding: "40px 16px", textAlign: "center", color: "#3d4560" }}>
                {emptyMsg}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ borderBottom: "1px solid #1a1d2e" }}
                onMouseEnter={(event) => (event.currentTarget.style.background = "#181b2a")}
                onMouseLeave={(event) => (event.currentTarget.style.background = "transparent")}
              >
                {columns.map((column) => (
                  <td key={column.key} style={{ padding: "12px 16px", color: "#cbd5e1", verticalAlign: "middle" }}>
                    {column.render ? column.render(row[column.key], row) : row[column.key] ?? "—"}
                  </td>
                ))}
                {onDelete && (
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      onClick={() => onDelete(row)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4a3030",
                        cursor: "pointer",
                        fontSize: 16,
                        padding: "2px 6px",
                        borderRadius: 6,
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(event) => (event.currentTarget.style.color = "#fca5a5")}
                      onMouseLeave={(event) => (event.currentTarget.style.color = "#4a3030")}
                    >
                      🗑
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
