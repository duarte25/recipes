// Função para criar link juntando a rota com as querys. ex: /reservas?motorista=id&veiculo=id&filtro=aberto;
// Data pode receber apenas o objeto com os valores chave e valor que seriam as querys, porem pode receber querys hiddenQuerys que seria as querys ocultas da URL e schema
// para fazer a validação do zod, ou seja só deixar filtrar na URL oque tiver no schema do zod.
export function createURLSearch(route, data) {

    let searchParams = new URLSearchParams();
  
    const querys = data?.querys ? data.querys : data;
    const hiddenQuerys = data?.hiddenQuerys;
    const schema = data?.schema;
  
    for (let query in querys) {
  
      let value = querys[query];
  
      // verificar se a query é vazia, undefined, null ou all, o all é porque o shadcnui não recebe string vazia nas options ai o all serve para dizer que seria todas as opções;
      if (value === undefined || value === "" || value === null || value === "all") {
  
        if (searchParams.has(query)) {
          searchParams.delete(query);
        }
  
        continue;
      }
  
      if (schema) {
        if ((schema?.shape[query])) {
          searchParams.set(query, value);
        }
  
      } else {
        searchParams.set(query, value);
      }
    }
  
    // Adicionar as querys ocultas;
    if (hiddenQuerys) {
      for (let query in hiddenQuerys) {
        let value = hiddenQuerys[query];
  
        // verificar se a query é vazia, undefined, null ou all, o all é porque o shadcnui não recebe string vazia nas options ai o all serve para dizer que seria todas as opções;
        if (value === undefined || value === "" || value === null || value === "all") {
  
          if (searchParams.has(query)) {
            searchParams.delete(query);
          }
  
          continue;
        }
  
        searchParams.set(query, value);
      }
    }
  
    return `${route}?${searchParams}`;
  }
  