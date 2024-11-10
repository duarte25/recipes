import { useQuery } from "react-query";
import { useState } from "react";
import { Button, Menu, Tooltip, MenuItem } from "@mui/material";
import { fetchApi } from "@/app/utils/fetchApi";


export default function Header() {
    const [anchorEl, setAnchorEl] = useState(null); // Controla a abertura do menu
  
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
        </div >
    );
}
