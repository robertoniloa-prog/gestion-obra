export function FormField({ label, error, children, required }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <span className="form-error">{error.message}</span>}
    </div>
  )
}

export function Input({ register, ...props }) {
  return <input className="form-input" {...register} {...props} />
}

export function Select({ register, children, ...props }) {
  return (
    <select className="form-select" {...register} {...props}>
      <option value="">-- Seleccionar --</option>
      {children}
    </select>
  )
}

export function Textarea({ register, ...props }) {
  return <textarea className="form-textarea" rows={3} {...register} {...props} />
}
