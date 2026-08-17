import Dashboard from "@/components/dashboard";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-start items-stretch lg:justify-center lg:items-center px-0 lg:px-[15%] h-screen bg-gray-100">
      <main className="flex w-full h-full bg-white">
        <Dashboard />
      </main>
    </div>
  );
}
