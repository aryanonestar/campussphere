const FormField = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
    </span>
    <input {...props} className="input-field" />
  </label>
);

export default FormField;
