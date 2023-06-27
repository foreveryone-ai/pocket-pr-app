export default function LoadingDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center text-black justify-center p-10 bg-primary-content">
      <div className="p-5 bg-gray-300 mb-5 rounded-md animate-pulse">
        Loading...
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div
              className="bg-gray-300 rounded-xl animate-pulse h-48 mb-4"
              key={i}
            />
          ))}
      </div>
    </main>
  );
}
