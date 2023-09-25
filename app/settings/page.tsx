import NavBar from "@/app/components/NavBar";
import SettingsTabs from "@/app/components/SettingsTabs";

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <NavBar />
        <SettingsTabs />
      </div>
    </>
  );
}
