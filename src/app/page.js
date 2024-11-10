"use client"

import { fetchApi } from "@/app/utils/fetchApi";
import Header from "@/components/Header";
import { BottomNavigation, BottomNavigationAction, Tooltip } from "@mui/material";
import { useQuery } from "react-query";


export default function Home() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getReceita"],
    queryFn: async () => {
      // const response = await fetchApi("/search.php", "GET", { s: "Arrabiata" });
      const response = await fetchApi("/categories.php", "GET");

      // A função fetchApi já retorna { data: response.data } diretamente
      return { data: response.data };
    }
  });

  const categories = data?.data.categories || [];

  return (
    <div>
      <Header />

      <div className="flex flex-col items-center px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-6">Categorias</h1>

        {/* Carrossel de Categorias com BottomNavigation */}
        <div className="w-full h-20 overflow-x-auto">
          <BottomNavigation showLabels className="w-max flex">
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
                  onClick={() => console.log(`Categoria selecionada: ${category.strCategory}`)}
                />
              </Tooltip>
            ))}
          </BottomNavigation>
        </div>

        
      </div>
    </div>
  );
}
