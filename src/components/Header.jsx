import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { TextField, CircularProgress, FormControl, Button, Menu, Tooltip, MenuItem } from "@mui/material";
import { fetchApi } from "@/app/utils/fetchApi";
import { debounce } from 'lodash'; // Importando a função debounce

export default function Header() {
    const [anchorEl, setAnchorEl] = useState(null); // Controla a abertura do menu

    const [searchQuery, setSearchQuery] = useState(""); // Valor do campo de busca (estado controlado)
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); // Valor do debounce

    // Atualiza o estado com debounce, acionando apenas após o usuário parar de digitar por 500ms
    const debouncedSearch = debounce((query) => {
        setDebouncedSearchQuery(query);
    }, 500); // Ajuste o tempo conforme necessário

    // Atualiza o estado de searchQuery enquanto o usuário digita
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Atualiza o valor diretamente
        debouncedSearch(event.target.value); // Aplica debounce ao valor
    };

    // // Usando o React Query, mas com a busca "debounced"
    // const { data, isLoading, isError, error } = useQuery({
    //     queryKey: ["getReceita", debouncedSearchQuery], // Usando o valor debounced para a consulta
    //     queryFn: async () => {
    //         if (!debouncedSearchQuery) return { data: [] }; // Não faz nada se não houver pesquisa
    //         const response = await fetchApi("/search.php", "GET", { s: debouncedSearchQuery });
    //         return { data: response.data };
    //     },
    //     enabled: !!debouncedSearchQuery, // Só executa a query se houver um searchQuery debounced
    //     refetchOnWindowFocus: false,
    //     retry: false, // Evitar novas tentativas de busca em caso de erro
    // });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getReceita"],
        queryFn: async () => {
            // const response = await fetchApi("/search.php", "GET", { s: "Arrabiata" });
            const response = await fetchApi("/categories.php", "GET");

            // A função fetchApi já retorna { data: response.data } diretamente
            return { data: response.data };
        }
    });

    const categories = data?.data?.categories || [];

    // Caso os dados estejam sendo carregados ou ocorreu um erro
    if (isLoading) return <p>Carregando...</p>;
    if (isError) return <p>Erro: {error.message}</p>;

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget); // Abre o menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Fecha o menu
    };

    return (
        <div className="bg-header-image h-lvh flex bg-cover bg-center">
            <li>
                <Button
                    aria-controls={anchorEl ? "category-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleMenuClick}
                    variant="contained"
                    color="primary"
                >
                    Categories
                </Button>
                <Menu
                    id="category-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'category-button',
                    }}
                >
                    {categories.map((category) => (
                        <Tooltip key={category.idCategory} title={category.strCategoryDescription} arrow>
                            <MenuItem onClick={handleMenuClose}>
                                <img
                                    src={category.strCategoryThumb}
                                    alt={category.strCategory}
                                    className="w-10 h-10 rounded-full object-cover mr-2"
                                />
                                {category.strCategory}
                            </MenuItem>
                        </Tooltip>
                    ))}
                </Menu>
            </li>

            {/* <li>
                    <FormControl fullWidth>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchQuery} 
                            onChange={handleSearchChange} // Atualiza o searchQuery conforme o usuário digita
                            InputProps={{
                                endAdornment: isLoading ? (
                                    <CircularProgress color="inherit" size={20} />
                                ) : null,
                            }}
                        />
                    </FormControl>
                </li> */}
        </div >
    );
}
