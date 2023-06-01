type VideoModalProps = {
  buttonText: string;
};

export function VideoModal({ buttonText }: VideoModalProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <label htmlFor="my-modal-6" className="btn">
        {buttonText}
      </label>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Continue?</h3>
          <p className="py-4">
            By clicking "proceed", you grant PocketPR permission to analyze the
            comments on this video.
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Proceed
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
