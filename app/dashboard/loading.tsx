export default function LoadingDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center text-black justify-start xl:px-20 pt-20 pb-10 bg-blue-400">
      <div className="p-5 bg-gray-300 mb-5 rounded-md animate-pulse">
        Loading...
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-12 gap-12 sm:px-4 md:px-8 lg:px-10 xl:px-20 2xl:px-32">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div
              className="bg-gray-300 rounded-xl animate-pulse h-48 mb-4"
              key={i}
            ></div>
          ))}
      </div>
    </main>
  );
}
