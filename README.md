# EventHub MVC

Aplicação monolítica MVC para gestão de eventos e inscrições, desenvolvida com Node.js, Express, EJS e MySQL.

O sistema permite que participantes criem uma conta, consultem eventos e façam inscrições. Organizadores autenticados podem criar, editar e excluir eventos.

## Tecnologias

- Node.js e Express
- EJS para renderização de páginas no servidor
- MySQL com `mysql2`
- Sessões com `express-session`
- Hash de senhas com `bcryptjs`
- Variáveis de ambiente com `dotenv`

## Estrutura do projeto

```text
src/
  config/          Configuração do banco de dados
  controllers/     Regras de negócio e renderização das telas
  middlewares/     Autenticação, autorização e sanitização
  models/          Acesso ao banco de dados
  routes/          Rotas da aplicação
  views/           Telas EJS renderizadas no servidor
app.js             Inicialização do Express
schema.sql         Estrutura e dados iniciais do banco
```

## Pré-requisitos

- Node.js 18 ou superior
- MySQL 8 ou compatível
- npm

## Instalação e execução local

1. Clone o repositório e entre na pasta do projeto.

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o banco e as tabelas importando o arquivo `schema.sql`:

   ```bash
   mysql -u root -p < schema.sql
   ```

4. Copie `.env.example` para `.env` e preencha os dados do seu MySQL. Exemplo:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=eventhub
   SESSION_SECRET=gere_uma_chave_longa_e_aleatoria
   PORT=3000
   NODE_ENV=development
   ```

5. Inicie a aplicação:

   ```bash
   npm start
   ```

6. Acesse [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DB_HOST` | Host do MySQL | `localhost` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_USER` | Usuário do banco | `root` |
| `DB_PASSWORD` | Senha do banco | `sua_senha` |
| `DB_NAME` | Nome do banco | `eventhub` |
| `SESSION_SECRET` | Chave secreta para as sessões | valor longo e aleatório |
| `PORT` | Porta HTTP da aplicação | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` ou `production` |

> Nunca envie o arquivo `.env` ao GitHub. Ele deve estar no `.gitignore`; somente `.env.example` deve ser versionado.

## Roteiro de testes manuais

Antes dos testes, inicie a aplicação com `npm start` e abra uma janela anônima do navegador para evitar uma sessão anterior interferir nos resultados.

| Cenário | Como testar | Resultado esperado |
| --- | --- | --- |
| Página inicial | Acesse `/` | Lista de eventos do banco ou mensagem de que não há eventos. |
| Cadastro | Acesse `/registro` e crie uma conta | Redirecionamento para `/login`; senha armazenada com hash. |
| E-mail duplicado | Cadastre novamente o mesmo e-mail | Mensagem de e-mail já cadastrado. |
| Login inválido | Tente uma senha incorreta | Mensagem de credenciais inválidas. |
| Login válido | Entre com uma conta existente | Redirecionamento para a página inicial e opção de sair. |
| Proteção de rota | Sem login, acesse `/eventos/novo` | Redirecionamento para `/login`. |
| Permissão de organizador | Logado como participante, acesse `/eventos/novo` | Página de acesso negado. |
| Criar evento | Logado como organizador, crie um evento | Evento aparece na página inicial. |
| Editar evento | Abra o evento e escolha editar | Alterações aparecem após salvar. |
| Excluir evento | Abra o evento e escolha excluir | Evento deixa de aparecer na lista. |
| Inscrição | Logado, abra um evento e clique em “Inscrever-se” | Inscrição aparece nos detalhes do evento. |
| Inscrição repetida | Clique novamente em “Inscrever-se” | Não deve criar uma segunda inscrição. |
| Página inexistente | Acesse uma URL inexistente | Página de erro 404 sem detalhes internos do servidor. |

## Verificações técnicas

Execute estas verificações antes da entrega:

```bash
# Verifica a sintaxe dos arquivos JavaScript
node --check app.js

# Inicia a aplicação
npm start
```

Além do navegador, confira no MySQL se as informações foram persistidas:

```sql
USE eventhub;

SELECT id, nome, email, tipo, senha FROM usuarios;
SELECT * FROM eventos;
SELECT * FROM inscricoes;
```

Na tabela `usuarios`, a coluna `senha` deve conter um hash iniciado por algo como `$2a$` ou `$2b$`, e nunca a senha em texto puro.

## Segurança implementada

- Senhas processadas com `bcryptjs` antes de serem gravadas.
- Sessões HTTP com cookie `httpOnly`.
- Rotas de criação, edição e exclusão protegidas por autenticação.
- Rotas de gestão de eventos restritas ao perfil de organizador.
- Queries SQL parametrizadas com `execute`, reduzindo risco de SQL Injection.
- Sanitização básica dos campos enviados por formulário.
- Respostas de erro genéricas ao usuário.

## Pendências recomendadas antes do deploy

- Garantir que um organizador só possa editar ou excluir os próprios eventos.
- Impedir inscrições após atingir a capacidade do evento.
- Criar a restrição `UNIQUE (evento_id, usuario_id)` na tabela `inscricoes`.
- Validar no servidor data, capacidade e limites dos campos.
- Configurar conexão SSL/TLS com o banco em nuvem quando necessário.
- Em produção no Render/Railway, usar um armazenamento de sessão persistente em vez do MemoryStore padrão.
- Configurar `trust proxy` antes do middleware de sessão para o cookie seguro funcionar atrás do proxy do serviço de deploy.
- Publicar a aplicação e registrar a URL pública no relatório da atividade.

## O que não pertence a este MVC

Esta é a Aplicação 1 da recuperação. Portanto, ela **não precisa** de JWT, Swagger, rota `/api-docs`, CORS restritivo ou um front-end separado consumindo JSON: esses itens são exigidos somente na Aplicação 2, a HelpDesk REST.

Por outro lado, autenticação por sessão, páginas EJS renderizadas pelo servidor, Models, Controllers e rotas protegidas são adequados e esperados neste projeto MVC.

## Deploy

Para a entrega, publique este projeto como Web Service no Render, Railway ou Fly.io e conecte-o a um banco MySQL em nuvem. Defina as variáveis de ambiente diretamente no painel do provedor, sem subir o `.env` ao repositório.

Depois, teste a URL pública em janela anônima: cadastro, login, criação de evento, inscrição e logout devem funcionar sem depender do `localhost`.

