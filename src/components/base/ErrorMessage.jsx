export default function ErrorMessage({ message }) {
  if (!message) return null;

  return <p className="mt-2 text-sm text-error font-medium">{message}</p>;
}
