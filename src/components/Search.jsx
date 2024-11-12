import React, { useState } from "react";
import { TextField, CircularProgress, FormControl } from "@mui/material";
import { debounce } from "lodash";
import { useQuery } from "react-query";
import { fetchApi } from "@/app/utils/fetchApi.js";

export default function Search({ onSearchResults }) {  // Recebe o callback como prop
  const [searchQuery, setSearchQuery] = useState(""); 
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); 

  const debouncedSearch = debounce((query) => {
      setDebouncedSearchQuery(query);
  }, 500); 

  const handleSearchChange = (event) => {
      setSearchQuery(event.target.value); 
      debouncedSearch(event.target.value); 
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getReceita", debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery) return { data: [] }; // Retorna vazio se não houver busca
      const response = await fetchApi("/search.php", "GET", { s: debouncedSearchQuery });
      return { data: response.data };  // Retorna os dados da API
    },
    enabled: !!debouncedSearchQuery,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Passa os resultados de volta para o `Home`
  React.useEffect(() => {
    if (data && data.data.meals) {
      onSearchResults(data.data.meals);  // Envia os dados da busca para o `Home`
    }
  }, [data, onSearchResults]);

  return (
    <FormControl fullWidth>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: isLoading ? (
            <CircularProgress color="white" size={150}  />
          ) : null,
        }}
      />
    </FormControl>
  );
}
