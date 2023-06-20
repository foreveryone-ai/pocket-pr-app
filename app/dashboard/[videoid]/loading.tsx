export default function LoadingComments() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="w-full bg-gray-300 animate-pulse my-2 h-6 rounded"
          ></div>
        ))}
    </div>
  );
}
