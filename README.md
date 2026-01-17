# 🎨 Photo Manager - Frontend

Aplicação frontend do Photo Manager, construída com React 19 e Vite, oferecendo uma interface moderna e responsiva para gerenciamento de fotos e álbuns.

## 🚀 Tecnologias

- **React 19** - Biblioteca de UI
- **Vite 7** - Build tool e dev server
- **TanStack Router** - Roteamento type-safe
- **TanStack Query** - Gerenciamento de estado do servidor
- **Tailwind CSS 4** - Estilização utility-first
- **shadcn/ui** - Componentes de UI
- **Radix UI** - Primitivos de UI acessíveis
- **Axios** - Cliente HTTP
- **Better Auth** - Autenticação
- **React Hook Form + Zod** - Formulários e validação
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones
- **Sonner** - Toasts/notificações

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos
├── components/
│   └── ui/          # Componentes reutilizáveis (shadcn/ui)
├── contexts/        # Contextos React (tema, etc.)
├── hooks/           # Hooks customizados
│   └── use-albums.ts
├── lib/             # Utilitários e configurações
│   ├── api.ts       # Cliente Axios configurado
│   └── utils.ts     # Funções utilitárias
├── routes/          # Páginas/rotas da aplicação
│   ├── __root.tsx   # Layout raiz
│   ├── index.tsx    # Página inicial (listagem de álbuns)
│   ├── album.tsx    # Detalhe do álbum
│   └── login.tsx    # Página de login
├── types/           # Definições de tipos TypeScript
│   └── album.ts
├── index.css        # Estilos globais
├── main.tsx         # Entrada da aplicação
└── router.tsx       # Configuração do roteador
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia o servidor de desenvolvimento

# Build
pnpm build        # Compila para produção

# Lint
pnpm lint         # Executa o linter

# Preview
pnpm preview      # Visualiza o build de produção
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080/api
```

### Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar em modo desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`.

## 🎯 Funcionalidades

### Álbuns
- ✅ Listagem com paginação infinita
- ✅ Criação de novos álbuns
- ✅ Exclusão de álbuns vazios
- ✅ Visualização de capa do álbum
- ✅ Validação de exclusão (álbuns com fotos não podem ser excluídos)

### Fotos
- ✅ Upload de imagens (JPG, PNG, GIF, WebP)
- ✅ Validação de tamanho máximo (10MB)
- ✅ Preview antes do upload
- ✅ Visualização em grid e tabela
- ✅ Modal de visualização em tela cheia
- ✅ Exibição de metadados (tamanho, cor dominante, data)
- ✅ Exclusão de fotos

### Interface
- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Animações e transições suaves
- ✅ Tooltips e feedbacks visuais
- ✅ Toasts de notificação

## 🧩 Componentes Principais

### Hooks

#### `useAlbums()`
Hook para listagem de álbuns com paginação infinita.

#### `useAlbum(albumId)`
Hook para buscar um álbum específico.

#### `usePhotos(albumId)`
Hook para listagem de fotos de um álbum com paginação infinita.

#### `useCreateAlbum()`
Mutation para criar um novo álbum.

#### `useDeleteAlbum()`
Mutation para excluir um álbum.

#### `useCreatePhoto()`
Mutation para upload de uma nova foto.

#### `useDeletePhoto()`
Mutation para excluir uma foto.

## 🔧 Debug

### VSCode Launch Configuration

O projeto inclui configurações de debug para VSCode:

```json
{
  "name": "Debug Front (Chrome)",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/src"
}
```

## 🐳 Docker

### Build da imagem

```bash
docker build -t photo-manager-front .
```

### Executar container

```bash
docker run -p 3000:80 photo-manager-front
```

## 📝 Convenções de Código

- **ESLint** para linting
- **TypeScript** strict mode
- **Tailwind CSS** para estilização
- **Componentes funcionais** com hooks
- **Nomes de arquivos** em kebab-case
- **Nomes de componentes** em PascalCase

## 📄 Licença

Este projeto é privado e de uso restrito.
