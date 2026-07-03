const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  function pageNumbers() {
    const pages = [];
    const windowSize = 1;
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - page) <= windowSize) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  }

  return (
    <div className="pagination-bar">
      <div className="page-size-select">
        <span>
          {total === 0 ? "No results" : `Showing ${start}–${end} of ${total}`}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className="pager">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          ‹
        </button>
        {pageNumbers().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} style={{ padding: "0 4px" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={p === page ? "current" : ""}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
