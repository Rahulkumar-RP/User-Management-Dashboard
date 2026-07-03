import { useState } from "react";
import { CloseIcon } from "./Icons";
import { hasErrors, validateUserForm } from "../utils/validation";

const emptyForm = { firstName: "", lastName: "", email: "", department: "" };

export default function UserFormModal({ mode, initialValues, onSubmit, onClose }) {
  const [values, setValues] = useState(initialValues || emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const isEdit = mode === "edit";

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateUserForm(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(
        isEdit
          ? "Couldn't save changes. Please try again."
          : "Couldn't add user. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
        <button className="btn btn-icon btn-ghost modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <h2 id="form-modal-title">{isEdit ? "Edit user" : "Add user"}</h2>
        <p className="modal-sub">
          {isEdit ? "Update the details below." : "Fill in the details for the new user."}
        </p>

        {submitError && (
          <div className="error-banner" role="alert">
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              className={errors.firstName ? "invalid" : ""}
              value={values.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              autoFocus
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>

          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              className={errors.lastName ? "invalid" : ""}
              value={values.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={errors.email ? "invalid" : ""}
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              className={errors.department ? "invalid" : ""}
              value={values.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
            {errors.department && <div className="field-error">{errors.department}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Add user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
