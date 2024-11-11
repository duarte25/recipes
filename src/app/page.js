"use client";

import Header from "@/components/Header";
import TableCategory from "@/components/TableCategory";

export default function Home() {

  return (
    <div>
      <Header />

      <div className="flex flex-col items-center px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-6">Recipes</h1>
      </div>

      <TableCategory />

    </div>
  );
}
