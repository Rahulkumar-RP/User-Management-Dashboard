import { useMemo, useState } from "react";
import "./styles.css";
import { useUsers } from "./hooks/useUsers";
import UsersTable from "./components/UsersTable";
import Pagination from "./components/Pagination";
import FilterPopover, { emptyFilters } from "./components/FilterPopover";
import UserFormModal from "./components/UserFormModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import Toast from "./components/Toast";
import { SearchIcon, PlusIcon } from "./components/Icons";

export default function App() {
  const { users, loading, error, reload, addUser, editUser, removeUser } = useUsers();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState({ key: "id", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formModal, setFormModal] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const haystack = `${u.firstName} ${u.lastName} ${u.email} ${u.department}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.firstName && !u.firstName.toLowerCase().includes(filters.firstName.toLowerCase()))
        return false;
      if (filters.lastName && !u.lastName.toLowerCase().includes(filters.lastName.toLowerCase()))
        return false;
      if (filters.email && !u.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
      if (
        filters.department &&
        !u.department.toLowerCase().includes(filters.department.toLowerCase())
      )
        return false;
      return true;
    });
  }, [users, search, filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.direction === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  function updateSort(next) {
    setSort(next);
    setPage(1);
  }

  function updatePageSize(size) {
    setPageSize(size);
    setPage(1);
  }

  async function handleAdd(values) {
    await addUser(values);
    setFormModal(null);
    setToast({ type: "success", message: "User added." });
  }

  async function handleEdit(values) {
    await editUser(formModal.user.id, values);
    setFormModal(null);
    setToast({ type: "success", message: "Changes saved." });
  }

  async function handleDelete() {
    await removeUser(deleteTarget.id);
    setDeleteTarget(null);
    setToast({ type: "success", message: "User deleted." });
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <h1>User Management Dashboard</h1>
          <span className="brand-tag">JSONPlaceholder /users</span>
        </div>
        <span className="stat-chip">{users.length} total users</span>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button className="btn btn-ghost" onClick={reload}>
              Retry
            </button>
          </div>
        )}

        <div className="toolbar">
          <div className="search-box">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search by name, email or department…"
              aria-label="Search users"
            />
          </div>

          <FilterPopover filters={filters} onApply={updateFilters} />

          <button className="btn btn-primary" onClick={() => setFormModal({ mode: "add" })}>
            <PlusIcon />
            Add user
          </button>
        </div>

        <UsersTable
          users={pageItems}
          loading={loading}
          sort={sort}
          onSortChange={updateSort}
          onEdit={(user) => setFormModal({ mode: "edit", user })}
          onDelete={(user) => setDeleteTarget(user)}
        />

        {!loading && sorted.length > 0 && (
          <Pagination
            page={currentPage}
            pageSize={pageSize}
            total={sorted.length}
            onPageChange={setPage}
            onPageSizeChange={updatePageSize}
          />
        )}
      </main>

      {formModal && (
        <UserFormModal
          mode={formModal.mode}
          initialValues={formModal.mode === "edit" ? formModal.user : undefined}
          onSubmit={formModal.mode === "edit" ? handleEdit : handleAdd}
          onClose={() => setFormModal(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
