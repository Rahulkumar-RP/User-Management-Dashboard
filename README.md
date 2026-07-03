# User Management Dashboard

A React dashboard to view, add, edit, and delete users, built against the
[JSONPlaceholder](https://jsonplaceholder.typicode.com) `/users` endpoint.

Live demo: https://user-management-dashboard-seven-pi.vercel.app
Repo: https://github.com/Rahulkumar-RP/User-Management-Dashboard

## Features

View — fetches all users from `GET /users` on load.
Add — posts a new user to `POST /users`. JSONPlaceholder doesn't
  actually persist the record, so the client assigns it a local id and adds
  it to the in-memory list so the UI reflects the change.
Edit — loads the selected user into a form, sends `PUT /users/:id`,
  and updates the row locally on success.
Delete — sends `DELETE /users/:id` and removes the row locally on
  success, with a confirmation dialog first.
Search — a single search box matches first name, last name, email,
  and department at once.
Filter — a popover with separate fields for first name, last name,
  email, and department; filters combine with the search box.
Sort — click any column header to sort by that column, click again to
  reverse direction.
Pagination — 10 / 25 / 50 / 100 rows per page, with page number
  controls.
Validation — first name, last name, and department are required;
  email is required and must match a valid email pattern. Errors show
  inline per field.
Error handling — failed requests show a dismissible/retryable banner
  or modal error instead of failing silently.
Responsive — the table becomes a stacked card list under 720px.

## Tech stack

- React 19 + Vite
- Axios for HTTP requests
- Plain CSS (CSS variables, no UI framework) — kept dependency-free since
  the brief prioritizes functionality over styling libraries

## Project structure

```
src/
  api/userApi.js        # axios calls + JSONPlaceholder <-> app data mapping
  hooks/useUsers.js      # data fetching + local CRUD state
  components/            # UsersTable, FilterPopover, Pagination, modals, etc.
  utils/                 # form validation, department tag colors
  styles.css              # design system (CSS variables) + component styles
  App.jsx                 # page composition: search, filter, sort, paginate
```

## Setup & run instructions

```bash
npm install
npm run dev       # starts a local dev server (Vite prints the URL)
npm run build     # production build into dist/
npm run preview   # preview the production build locally
```

Requires Node.js 18+.


## Assumptions

- JSONPlaceholder's `/users` objects don't have separate first/last name or
  department fields. `name` is split on the first space into first/last
  name, and `company.name` is used as the department, since it's the
  closest existing field. This mapping is centralized in `api/userApi.js`.
- Since JSONPlaceholder simulates writes but doesn't persist them, all
  mutations (add/edit/delete) are reflected in local component state after
  a successful response, so the UI behaves like a real backend within a
  session. A page refresh resets the list to the original API data — this
  is a known limitation of using a mock API, not a bug in the CRUD logic.
- "Add" assigns a new local id as `max(existing ids) + 1` rather than using
  the id JSONPlaceholder echoes back (always `11`), so multiple adds don't
  collide.
- Search and filters are applied client-side across the full fetched list,
  since JSONPlaceholder doesn't support meaningful query params for these
  fields against its fixed fake dataset.

## Challenges & what I'd improve with more time

Mock backend limitations : the biggest constraint was JSONPlaceholder
  not persisting writes or supporting real filtering/sorting/pagination on
  the server. Everything here is done client-side against the full fetched
  list, which works fine at this scale (10 users) but wouldn't scale to a
  real dataset without server-side pagination and filtering.
No routing : with more time I'd add a route per user (e.g.
  `/users/:id`) so edits and detail views are shareable/bookmarkable, using
  React Router.
Optimistic UI : currently the UI waits for the API response before
  updating state. Optimistic updates (update immediately, roll back on
  failure) would make add/edit/delete feel faster.
Testing : given more time I'd add component tests (React Testing
  Library) for form validation, filtering, and sorting logic, plus an
  integration test that mocks the API layer.
Bulk actions : multi-select rows for bulk delete would be a natural
  next feature for a management dashboard like this.
Persisted view state : search/filter/sort/page could be reflected in
  the URL query string so a reload or shared link preserves the current
  view.
