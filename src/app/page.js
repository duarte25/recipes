"use client";

import Header from "@/components/Header.jsx";
import TableCategory from "@/components/TableCategory.jsx";

export default function Home() {

  return (
    <div>
      <Header />

      <div className="flex flex-col items-center py-8">
        <h1 className="text-orange-500 text-6xl font-bold mb-6">Recipes</h1>
      </div>

      <TableCategory />

    </div>
  );
}
