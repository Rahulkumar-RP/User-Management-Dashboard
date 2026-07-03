import { useEffect, useRef, useState } from "react";
import { FilterIcon } from "./Icons";

const emptyFilters = { firstName: "", lastName: "", email: "", department: "" };

export default function FilterPopover({ filters, onApply }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  function handleChange(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function apply() {
    onApply(draft);
    setOpen(false);
  }

  function clear() {
    setDraft(emptyFilters);
    onApply(emptyFilters);
    setOpen(false);
  }

  return (
    <div className="filter-popover-wrap" ref={wrapRef}>
      <button
        className={`btn filter-btn ${activeCount ? "active" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <FilterIcon />
        Filter{activeCount ? ` (${activeCount})` : ""}
      </button>

      {open && (
        <div className="filter-popover">
          <h3>Filter users</h3>

          <div className="field">
            <label htmlFor="f-firstName">First name</label>
            <input
              id="f-firstName"
              value={draft.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="e.g. Priya"
            />
          </div>
          <div className="field">
            <label htmlFor="f-lastName">Last name</label>
            <input
              id="f-lastName"
              value={draft.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="e.g. Sharma"
            />
          </div>
          <div className="field">
            <label htmlFor="f-email">Email</label>
            <input
              id="f-email"
              value={draft.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="e.g. gmail.com"
            />
          </div>
          <div className="field">
            <label htmlFor="f-department">Department</label>
            <input
              id="f-department"
              value={draft.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="e.g. Sales"
            />
          </div>

          <div className="filter-popover-actions">
            <button className="btn btn-ghost" onClick={clear}>
              Clear all
            </button>
            <button className="btn btn-primary" onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { emptyFilters };
