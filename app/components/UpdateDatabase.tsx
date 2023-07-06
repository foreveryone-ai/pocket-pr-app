"use client";
export default function UpdateDatabase() {
  const handleUpdate = async () => {
    console.log("handling update...");
    const res = await fetch("/api/update");
    console.log(await res.json());
  };
  return (
    <button onClick={handleUpdate} className="btn glass btn-outline text-black">
      update database
    </button>
  );
}
