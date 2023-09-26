import NavBar from "@/app/components/NavBar";
import SettingsTabs from "@/app/components/SettingsTabs";

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-green-800">
        <NavBar />
        <div className="xl:py-36" />
        <div className="flex justify-center items-center">
          <SettingsTabs />
        </div>
      </div>
    </>
  );
}
