import { EditIcon, TrashIcon, UsersEmptyIcon } from "./Icons";
import { colorForDepartment } from "../utils/tagColor";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
];

function DeptTag({ department }) {
  const c = colorForDepartment(department);
  return (
    <span className="dept-tag" style={{ background: c.bg, color: c.fg }}>
      {department || "—"}
    </span>
  );
}

export default function UsersTable({ users, loading, sort, onSortChange, onEdit, onDelete }) {
  function toggleSort(key) {
    if (sort.key === key) {
      onSortChange({ key, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, direction: "asc" });
    }
  }

  if (loading) {
    return (
      <div className="table-card">
        <div className="loading-state">Loading users…</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <UsersEmptyIcon />
          <h3>No users found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key}>
                  <span className="sort-th" onClick={() => toggleSort(col.key)}>
                    {col.label}
                    <span className={`sort-arrow ${sort.key === col.key ? "active" : ""}`}>
                      {sort.key === col.key ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </span>
                </th>
              ))}
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="cell-id mono">{u.id}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td className="cell-email mono">{u.email}</td>
                <td>
                  <DeptTag department={u.department} />
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-icon btn-ghost" onClick={() => onEdit(u)} aria-label={`Edit ${u.firstName}`}>
                      <EditIcon />
                    </button>
                    <button className="btn btn-icon btn-ghost" onClick={() => onDelete(u)} aria-label={`Delete ${u.firstName}`}>
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="user-cards">
        {users.map((u) => (
          <div className="user-card" key={u.id}>
            <div className="user-card-top">
              <div>
                <div className="user-card-name">{u.firstName} {u.lastName}</div>
                <div className="user-card-email mono">{u.email}</div>
              </div>
              <span className="cell-id mono">#{u.id}</span>
            </div>
            <DeptTag department={u.department} />
            <div className="user-card-actions">
              <button className="btn" onClick={() => onEdit(u)}>
                <EditIcon /> Edit
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(u)}>
                <TrashIcon /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
