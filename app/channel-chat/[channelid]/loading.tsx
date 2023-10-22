export default function LoadingComments() {
  return (
    <div className="flex items-center justify-center min-h-screen pt-18 bg-green-800">
      <div className="px-4 sm:px-6 lg:px-8 w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 text-xl font-semibold animate-pulse">
            Channel Chat
          </div>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: "500px" }}>
            <div className="chat chat-start animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
            <div className="chat chat-end animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
            <div className="chat chat-start animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
            <div className="chat chat-end animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
            <div className="chat chat-start animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
            <div className="chat chat-end animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
            <div className="chat chat-start animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
            <div className="chat chat-end animate-pulse">
              <div className="chat-bubble bg-gray-200 h-12 w-3/4"></div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 animate-pulse">
            <input
              type="text"
              placeholder="Type here"
              className="input w-full bg-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
