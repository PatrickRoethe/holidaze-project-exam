export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  success,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-2 
          ${
            error
              ? "border-error focus:ring-error"
              : success
              ? "border-success focus:ring-success"
              : "border-gray-300 focus:ring-primary"
          }`}
      />

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {!error && success && (
        <p className="mt-1 text-sm text-success">Looks good!</p>
      )}
    </div>
  );
}
