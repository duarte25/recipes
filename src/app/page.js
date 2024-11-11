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
  // Estado para armazenar a categoria selecionada
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getReceita"],
    queryFn: async () => {
      const response = await fetchApi("/categories.php", "GET");
      return { data: response.data };
    }
  });

  const categories = data?.data.categories || [];

  // Função de callback para atualizar os resultados da busca
  const handleSearchResults = (results) => {
    setSearchResults(results);  // Atualiza o estado com os resultados da busca
  };

  return (
    <div>
      <Header />

      <div className="flex flex-col items-center px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-6">Categorias</h1>

        {/* Carrossel de Categorias com BottomNavigation */}
        <div className="w-full h-20 overflow-x-auto">
          <BottomNavigation
            value={selectedCategory} // Define o valor atual do BottomNavigation
            onChange={(event, newValue) => setSelectedCategory(newValue)} // Atualiza o estado quando uma categoria é selecionada
            showLabels
            className="w-max flex"
          >
            {categories.map((category) => (
              <Tooltip key={category.idCategory} title={category.strCategoryDescription} arrow>
                <BottomNavigationAction
                  label={category.strCategory}
                  value={category.strCategory}
                  icon={
                    <img
                      src={category.strCategoryThumb}
                      alt={category.strCategory}
                      className="w-96 h-10 rounded-full object-cover"
                    />
                  }
                />
              </Tooltip>
            ))}
          </BottomNavigation>
        </div>

        {/* <Search onSearchResults={handleSearchResults} /> */}

        {selectedCategory && (
          <div className="mt-4 text-lg text-gray-700">
            Categoria selecionada: {selectedCategory}
          </div>
        )}
      </div>


      <TableCategory category={selectedCategory} />


    </div>
  );
}
