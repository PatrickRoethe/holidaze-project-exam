export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-md shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}
