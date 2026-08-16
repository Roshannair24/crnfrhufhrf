import Dashboard from "@/components/dashboard";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center px-[15%]  h-screen bg-gray-100">
      <main className="flex w-full bg-white">
        <Dashboard />
      </main>
    </div>
  );
}
