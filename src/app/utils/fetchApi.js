import { createURLSearch } from "./createURLSearch.js";

export const fetchApi = async (route, method, data, ...props) => {
  try {
    let urlApi = process.env.NEXT_PUBLIC_API_URL;
    let dados = null;

    if (method === "GET" && data) {
      let urlSearch = createURLSearch(route, data);
      
      route = urlSearch;
    }

    // Se for outro tipo de requisição, trata os dados como JSON
    if (method !== "GET" && data) {
      if (data instanceof FormData) {
        dados = data;
      } else {
        dados = JSON.stringify(data);
      }
    }

    const response = await fetch(`${urlApi}${route}`, {
      method: method,
      body: dados,
      cache: "no-store",
      ...props
    });

    const responseData = await response.json();
    if (responseData) {
      return {
        data: responseData,
        error: false,
        errors: []
      };
    } else {
      return {
        data: [],
        error: true,
        errors: [{ message: "Nenhuma refeição encontrada" }]
      };
    }

  } catch (error) {
    console.log("Erro na requisição", error);

    return {
      data: [],
      error: true,
      errors: [{ message: error?.message ?? "Erro inesperado" }]
    };
  }
};
