/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import {
    Button, Menu, Tooltip, MenuItem, CircularProgress, TextField, FormControl, Card, CardHeader, IconButton,
    CardMedia, CardContent, CardActions, Avatar, Typography
} from '@mui/material';
import { useQuery } from "react-query";
import { debounce } from 'lodash';
import { fetchApi } from "@/app/utils/fetchApi";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

export default function TableSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const debouncedSearch = debounce((query) => {
        setDebouncedSearchQuery(query);
    }, 500);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setSelectedCategory(null);
        debouncedSearch(event.target.value);
    };

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

    const handleCategorySelect = (category) => {
        setSelectedCategory(category.strCategory);
        setSearchQuery("");
        setDebouncedSearchQuery("");
        setAnchorEl(null);
    };

    if (isLoadingCategory) return <p>Carregando...</p>;

    return (
        <>
            <div className="flex flex-row gap-5 justify-center">
                <FormControl className="w-1/5">
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
                    className="w-1/5"
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
                <div className="flex flex-wrap gap-10 px-5">
                    {data && data.length > 0 ? (
                        data.map((meal) => (
                            <Card key={meal.idMeal} className="w-1/5 my-2 mx-auto" style={{background: "rgb(229 231 235)"}} >
                                <CardHeader
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={meal.strMeal}
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={meal.strMealThumb}
                                    alt={meal.strMeal}
                                />
                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        className="h-40 overflow-hidden text-ellipsis"
                                    >
                                        {meal.strInstructions}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>
                            No meals found for this.
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
