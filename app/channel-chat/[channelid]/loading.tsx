import NavBar from "@/app/components/NavBar";

export default function LoadingComments() {
  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="px-4 sm:px-6 lg:px-8 w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="bg-black rounded-lg shadow-lg">
            <div className="p-4  text-xl font-semibold animate-pulse"></div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "500px" }}>
              <div className="chat flex justify-start py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
              <div className="chat chat-end flex justify-end py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
              <div className="chat flex justify-start py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
              <div className="chat chat-end flex justify-end py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
              <div className="chat flex justify-start py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
              <div className="chat chat-end flex justify-end py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
              <div className="chat flex justify-start py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
              <div className="chat chat-end flex justify-end py-1 animate-pulse">
                <div className="rounded-xl bg-gray-500 h-12 w-3/4"></div>
              </div>
            </div>
            <div className="p-4  animate-pulse">
              <input
                type="text"
                placeholder="Type here"
                className="input w-full rounded-xl pr-20 bg-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
