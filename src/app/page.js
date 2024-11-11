"use client";

import { fetchApi } from "@/app/utils/fetchApi";
import Header from "@/components/Header";
import Table from "@/components/TableCategory";
import { BottomNavigation, BottomNavigationAction, Tooltip } from "@mui/material";
import { useQuery } from "react-query";
import { useState } from "react";
import TableCategory from "@/components/TableCategory";
import Search from "@/components/Search";

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
