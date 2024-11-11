import React, { useState } from 'react';
import { Button, Menu, Tooltip, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, FormControl } from '@mui/material';
import { useQuery } from "react-query";
import { debounce } from 'lodash';
import { fetchApi } from "@/app/utils/fetchApi";

export default function TableSearch({ category }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(category || null);

    const debouncedSearch = debounce((query) => {
        setDebouncedSearchQuery(query);
    }, 500);

    // Função para lidar com mudanças no campo de busca
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setSelectedCategory(null); // Limpa a categoria selecionada
        debouncedSearch(event.target.value);
    };

    // Função de busca usando useQuery para dados
    const { data, isLoading } = useQuery({
        queryKey: ["getReceita", debouncedSearchQuery || selectedCategory],
        queryFn: async () => {
            const url = debouncedSearchQuery ? "/search.php" : "/filter.php";
            const params = debouncedSearchQuery ? { s: debouncedSearchQuery } : { c: selectedCategory };

            const response = await fetchApi(url, "GET", params);
            return response.data.meals || [];
        },
        enabled: Boolean(debouncedSearchQuery || selectedCategory),
        refetchOnWindowFocus: false,
        retry: false,
    });

    // Carregar categorias
    const { data: dataCategory, isLoading: isLoadingCategory } = useQuery({
        queryKey: ["getCategories"],
        queryFn: async () => {
            const response = await fetchApi("/categories.php", "GET");
            return { data: response.data };
        }
    });

    const categories = dataCategory?.data?.categories || [];

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Função para lidar com a seleção de uma categoria
    const handleCategorySelect = (category) => {
        setSelectedCategory(category.strCategory);  // Define a categoria selecionada
        setSearchQuery(""); // Limpa o campo de pesquisa
        setDebouncedSearchQuery(""); // Remove qualquer termo de pesquisa anterior
        setAnchorEl(null);  // Fecha o menu
    };

    // Exibe uma mensagem de carregamento enquanto as categorias são carregadas
    if (isLoadingCategory) return <p>Carregando...</p>;

    return (
        <>
            <div className="flex flex-row gap-5 justify-center">
                <FormControl fullWidth className="w-2/5">
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: isLoading ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : null,
                        }}
                    />
                </FormControl>

                <Button
                    className="w-2/5"
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
                        <Tooltip key={category.idCategory} arrow>
                            <MenuItem onClick={() => handleCategorySelect(category)}>
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
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Image</strong></TableCell>
                                <TableCell><strong>ID</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((meal) => (
                                    <TableRow key={meal.idMeal}>
                                        <TableCell>{meal.strMeal}</TableCell>
                                        <TableCell>
                                            <img src={meal.strMealThumb} alt={meal.strMeal} width="100" />
                                        </TableCell>
                                        <TableCell>{meal.idMeal}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No meals found for this {debouncedSearchQuery ? "search term" : "category"}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}
