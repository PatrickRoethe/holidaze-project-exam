// TODO: Implement Avatar component later, when working on Profile or MyVenues page.
// Require image handling and user data
export default function Avatar({
  src,
  alt = "User avatar",
  size = "w-24 h-24",
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full border border-gray-300 object-cover ${size}`}
    />
  );
}
