import React from 'react';
import { useQuery } from 'react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchApi } from "@/app/utils/fetchApi";

export default function TableSearch({ search }) {

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
                    {data && data.map((search) => (
                        <TableRow key={search.idMeal}>
                            <TableCell>{search.strMeal}</TableCell>
                            <TableCell>
                                <img src={search.strMealThumb} alt={search.strMeal} width="100" />
                            </TableCell>
                            <TableCell>{search.idMeal}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!data && <p>No meals found for this category.</p>}
        </TableContainer>
    );
}
