# Erocket Board — Mentoria Lei Seca

Quadro interativo e moderno para gestão visual de Sprints, tarefas, entregáveis de MVP e backlog de pendências/dúvidas com o cliente.

---

## 🚀 Como Executar Localmente

### 1. Instalar as dependências
```bash
npm install
```

### 2. Rodar o servidor de desenvolvimento
```bash
npm run dev
```

Acesse em seu navegador:
```
http://localhost:3000
```

---

## ☁️ Como Subir na Vercel

1. Crie um repositório no GitHub (ou GitLab/Bitbucket) com esta pasta `Erocket Board`.
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Importe o repositório.
4. O framework **Next.js** será detectado automaticamente.
5. Clique em **Deploy**!

---

## 📋 Funcionalidades Principais

- **Sprints 0 a 11 Pré-carregadas**: Com todos os itens, entregáveis, status e durações exatas do documento.
- **Check de 3 Estados**: Pendente (⚪), Em Andamento/Parcial (🟡) e Concluído (🟢).
- **Drag & Drop**:
  - Reordene Sprints (as datas em ciclos de 2 semanas recalculam automaticamente em cascata!).
  - Mova tarefas de uma sprint para outra.
  - Arraste anotações do Backlog/Dúvidas direto para dentro de uma sprint.
- **Backlog Rápido & Dúvidas com o Cliente**: Painel lateral dedicado para registrar pendências, bugs e dúvidas comerciais.
- **Divisão Visual MVP**: Métricas e marco visual separando a Fase 1 (Sprints 1 a 6) das fases seguintes.
- **Backup & Persistência**: Salvamento automático no `localStorage` do navegador + botões de **Exportar JSON** e **Importar JSON**.
