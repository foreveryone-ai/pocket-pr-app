"use client";
export default function UpdateDatabase() {
  const handleUpdate = async () => {
    console.log("handling update...");
    const res = await fetch("/api/update");
    console.log(await res.json());
  };
  return (
    <button onClick={handleUpdate} className="btn">
      update database
    </button>
  );
}
