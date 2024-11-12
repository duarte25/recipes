# Usar a imagem base do Node.js
FROM node:20-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar as definições de dependências
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código do projeto
COPY . .

# Construir a aplicação Next.js
RUN npm run build

# Expor a porta que o Next.js usa
EXPOSE 3000

# Iniciar a aplicação em modo de produção
CMD ["npm", "start"]