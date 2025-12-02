# Saveplace - Architecture & Migration Guide

## Visão Geral

O ecossistema **Saveplace** foi refatorado para seguir os princípios de **Clean Architecture**, visando um núcleo de domínio reaproveitável conceitualmente entre as plataformas Web/Android (React) e Desktop (Windows .NET).

### Estrutura de Diretórios (Multi-Plataforma)

Ambos os projetos seguem a mesma divisão de responsabilidades:

1.  **Domain (Entidades & Regras)**: O coração da aplicação. Sem dependências de frameworks.
2.  **Application (Casos de Uso)**: Orquestração da lógica de negócio.
3.  **Infrastructure (Implementação Externa)**: Serviços de IA (Gemini), Audio, Repositórios.
4.  **Presentation (UI)**:
    *   **Android (React)**: Componentes, Hooks (ViewModels), Pages.
    *   **Windows (WPF)**: Windows, Views, ViewModels.

---

## 1. Saveplace Android (React Web App)

Este projeto foi refatorado de um monólito (`App.tsx`) para uma arquitetura em camadas.

### Nova Estrutura
```text
src/
├── domain/                  # Entidades (UserProfile) e Interfaces
├── application/             # Casos de Uso (MonitorProfilesUseCase)
├── infrastructure/          # Serviços (GeminiService, LiveClient)
└── presentation/            # Camada Visual
    ├── viewModels/          # Hooks de Lógica (useAppViewModel)
    └── styles/              # Tema Material 3
components/                  # Componentes Visuais (MapVisualizer) - Raiz
```

### Como Rodar
1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
3.  Para build de produção:
    ```bash
    npm run build
    ```

### Mudanças Realizadas
*   **Separação de Lógica:** A lógica de simulação e detecção de emergência saiu do `App.tsx` e foi para `application/useCases`.
*   **MVVM:** Introdução do hook `useAppViewModel` para gerenciar o estado da tela principal.
*   **Material Design 3:** Aplicação de tokens de cor MD3 e fonte Roboto.

---

## 2. Saveplace Windows (.NET 8 WPF)

Um novo projeto foi desenhado para rodar nativamente no Windows, mantendo paridade de lógica com a versão Web.

### Estrutura da Solução (.sln)
*   **Saveplace.Domain**: Class Library (.NET Standard). Contém `UserProfile`, `IGeminiService`.
*   **Saveplace.Application**: Class Library. Contém `MonitorProfilesUseCase`.
*   **Saveplace.Infrastructure**: Implementação dos serviços (Mock ou Reais).
*   **Saveplace.WindowsApp**: Aplicação WPF usando MVVM.

### Como Implementar
Como este ambiente não possui o SDK .NET, os arquivos fonte foram gerados na pasta `Saveplace.Windows/`.
1.  Crie uma solução vazia no Visual Studio.
2.  Adicione os projetos (Class Libraries e WPF App) conforme as pastas geradas.
3.  Copie os arquivos `.cs` e `.xaml` para seus respectivos projetos.
4.  Instale pacotes NuGet necessários (ex: `CommunityToolkit.Mvvm`, `Google.Cloud.AI.GenerativeAI`).

---

## Fluxo de Dados

1.  **UI (View)** dispara uma ação (ex: "Iniciar Monitoramento").
2.  **ViewModel** recebe a ação e chama o **UseCase** correspondente.
3.  **UseCase** manipula as **Entities** e usa interfaces do **Domain**.
4.  **Infrastructure** provê as implementações reais (chamada API Gemini).
5.  **ViewModel** atualiza o estado observável.
6.  **UI** reage à mudança de estado.

## Checklist de Migração e Evolução

- [x] Extrair tipos para Entidades de Domínio.
- [x] Criar Camada de Aplicação (UseCases).
- [x] Implementar MVVM no React.
- [x] Aplicar Material Design 3.
- [ ] Implementar Testes Unitários para `MonitorProfilesUseCase` (Jest/NUnit).
- [ ] Configurar CI/CD para deploy automático.
- [ ] Integrar API real do Gemini no cliente C#.
