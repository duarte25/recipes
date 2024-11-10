import React from 'react';
import { useQuery } from 'react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { fetchApi } from "@/app/utils/fetchApi";

export default function TableSearch({ category, search }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getReceita", category],
        queryFn: async () => {
            const response = await fetchApi("/filter.php", "GET", { c: category });
            return response.data.meals;  // Pode ser null ou array de objetos
        }
    });

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Error: {error.message}</p>
            </div>
        );
    }

    return (
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
                            <TableCell colSpan={3} align="center">No meals found for this category.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
