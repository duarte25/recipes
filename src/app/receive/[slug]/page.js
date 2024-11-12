"use client";

import { fetchApi } from '@/app/utils/fetchApi';
import Header from '@/components/Header';
import { CardMedia, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';

const ReceivePage = () => {
    const { slug } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ["getCategories"],
        queryFn: async () => {
            const response = await fetchApi("/lookup.php", "GET", { i: slug });
            const meal = response.data.meals[0];
            return meal;
        }
    });

    // Extrai o videoId para poder capturar lá no final no iframe não consegui de outra forma
    const videoId = data?.strYoutube ? new URL(data.strYoutube).searchParams.get("v") : null;

    return (
        <>
            <Header />
            {isLoading ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <Typography variant="h2" gutterBottom>
                        {data.strMeal}
                    </Typography>
                    <CardMedia
                        component="img"
                        image={data.strMealThumb}
                        alt={data.strMeal}
                        className="w-4/12"
                    />

                    <div className="mt-4 w-5/12">
                        <Typography variant="h5" gutterBottom>Ingredients and Measurements:</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ingredient</TableCell>
                                        <TableCell>Measurement</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array(20).fill().map((_, i) => {
                                        const ingredient = data[`strIngredient${i + 1}`];
                                        const measure = data[`strMeasure${i + 1}`];

                                        return ingredient && ingredient.trim() ? (
                                            <TableRow key={i}>
                                                <TableCell>{ingredient}</TableCell>
                                                <TableCell>{measure || ''}</TableCell>
                                            </TableRow>
                                        ) : null;
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className="mt-4 w-5/12">
                        <Typography variant="h5">Instructions:</Typography>
                        <Typography variant="body1">{data.strInstructions}</Typography>
                    </div>

                    {videoId && (

                        <iframe
                            className="my-10 w-[80vh] h-[60vh]"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>

                    )}
                </div>
            )}
        </>
    );
};

export default ReceivePage;
