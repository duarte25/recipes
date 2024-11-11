import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, FormControl } from '@mui/material';
import { useQuery } from "react-query";
import { debounce } from 'lodash';
import { fetchApi } from "@/app/utils/fetchApi";

export default function TableSearch({ category }) { 
    const [searchQuery, setSearchQuery] = useState(""); 
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    const debouncedSearch = debounce((query) => {
        setDebouncedSearchQuery(query);
    }, 500);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        debouncedSearch(event.target.value);
    };

    const { data, isLoading } = useQuery({
        queryKey: ["getReceita", debouncedSearchQuery || category],
        queryFn: async () => {
            // Define URL e parâmetros conforme a presença de `debouncedSearchQuery`
            const url = debouncedSearchQuery ? "/search.php" : "/filter.php";
            const params = debouncedSearchQuery ? { s: debouncedSearchQuery } : { c: category };  
            
            const response = await fetchApi(url, "GET", params);
            return response.data.meals || []; 
        },
        enabled: Boolean(debouncedSearchQuery || category), 
        refetchOnWindowFocus: false,
        retry: false,
    });

    return (
        <>
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
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
            {data === "no data found" ? (
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
