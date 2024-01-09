"use client";
import Image from "next/image";
import Header from "@/components/Header";
import ToDo from "@/components/ToDo";
export default function Home() {
  return (
    <main className="flex flex-col items-center mt-4">
      <Header />
      <ToDo />
    </main>
  );
}
