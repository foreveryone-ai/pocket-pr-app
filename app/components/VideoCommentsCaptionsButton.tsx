export default function VideoCommentsCaptionsButton() {
  const handleUpdate = async () => {
    console.log("hi from vccb button");
    const res = await fetch("/api/update/video-data");
    console.log(await res.json());
  };
  return (
    <button className="btn" onClick={handleUpdate}>
      update
    </button>
  );
}
