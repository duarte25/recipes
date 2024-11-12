import React, { useState } from "react";
import {
    Button, Menu, Tooltip, MenuItem, CircularProgress, TextField, FormControl, Card, CardHeader, IconButton,
    CardMedia, CardContent, CardActions, Typography
} from "@mui/material";
import { useQuery } from "react-query";
import { debounce } from "lodash";
import { fetchApi } from "@/app/utils/fetchApi.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Link from "next/link";

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

    return (
        <>
            <div className="flex flex-row gap-5 justify-center">
                {/* Pelo tempo ser curto apenas modifiquei a cor para não ficar diferente e nem o padrão trazido do MUI */}
                <FormControl className="w-1/5">
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "0.375rem",
                                backgroundColor: "rgb(234 88 12)",
                                "&.Mui-focused": {
                                    backgroundColor: "rgb(234 88 12)", 
                                },
                                "& .MuiInputBase-input": {
                                    backgroundColor: "rgb(234 88 12)", 
                                    color: "rgb(31 41 55)", 
                                    caretColor: "rgb(31 41 55)", 
                                    borderRadius: "0.375rem",
                                },
                                "& fieldset": {
                                    borderColor: "rgb(229 231 235)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "rgb(229 231 235)",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "rgb(229 231 235)",
                                },
                            },
                            "& .MuiFormLabel-root": {
                                color: "rgb(212 212 216)", 
                            },
                            "& .Mui-focused .MuiFormLabel-root": {
                                color: "rgb(229 231 235)", 
                            },
                        }}
                    />
                </FormControl>

                <Button
                    className="w-1/5 text-white rounded-xl hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-800"
                    aria-controls={anchorEl ? "category-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleMenuClick}
                    variant="contained"
                    sx={{
                        backgroundColor: "rgb(234 88 12)"
                    }}
                >
                    Categories
                </Button>
                <Menu
                    id="category-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        "aria-labelledby": "category-button",
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
                <div className="flex items-center justify-center h-screen">
                    <CircularProgress color="white" size={150} />
                </div>
            ) : (
                <div className="flex flex-wrap gap-10 justify-center px-5 py-10">
                    {data && data.length > 0 ? (
                        data.map((meal) => (
                            <Card key={meal.idMeal} className="w-1/5 my-2 mx-auto" style={{ background: "rgb(229 231 235)" }} >
                                <CardHeader
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={
                                        <span className="block whitespace-nowrap overflow-hidden text-ellipsis w-72">
                                            {meal.strMeal}
                                        </span>
                                    }
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={meal.strMealThumb}
                                    alt={meal.strMeal}
                                />
                                {
                                    meal.strInstructions && (
                                        <CardContent>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                className="h-40 overflow-hidden text-ellipsis"
                                            >
                                                {meal.strInstructions}
                                            </Typography>
                                        </CardContent>
                                    )
                                }
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <Link href={`/receive/${meal.idMeal}`} passHref>
                                        <Button sx={{ color: "rgb(75 85 99)" }} className="hover:text-blue-500">Learn More</Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center mt-10 text-5xl">
                            No meals found for this.
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
