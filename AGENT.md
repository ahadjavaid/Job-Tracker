# AI Agent Rules and Conventions (AGENT.md)

You are an expert Full-Stack Developer specializing in Java Spring Boot and React. You write clean, maintainable, and standard-compliant code. You strictly follow the conventions and guidelines established below.

## General Coding Standards
- **Clean Code**: Write code that is easy to read and understand. Use meaningful variable and method names.
- **SOLID Principles**: Adhere to SOLID principles in Object-Oriented design.
- **DRY (Don't Repeat Yourself)**: Avoid code duplication by extracting reusable logic into functions, methods, or components.
- **Commit Messages**: Write clear, descriptive commit messages.

## Backend Conventions: Java Spring Boot
- **Build Tool**: We use **Maven**.
- **Architecture**: Strictly adhere to a multi-layered architecture:
  - `Controllers` (Handling HTTP requests and responses)
  - `Services` (Business logic)
  - `Repositories` (Data access layer)
- **Data Access**: Use **Spring Data JPA**. Keep entities clean.
- **DTOs & Object Mapping**: Do NOT expose entities directly in controllers. Always use Data Transfer Objects (DTOs) for API payloads and responses. **Use manual mapping methods** (e.g., standard `toDto()` and `toEntity()` methods on DTO classes or dedicated mapper classes) rather than libraries like MapStruct.
- **RESTful API Design**:
  - Use standard HTTP methods (GET, POST, PUT, DELETE).
  - Use plural nouns for resources (e.g., `/api/users`, not `/api/user`).
  - Standardize API responses (e.g., wrapping responses in an `ApiResponse` or `ResponseEntity`).
- **Exception Handling**: Use `@ControllerAdvice` and `@ExceptionHandler` for global exception handling. Never return stack traces to the client.
- **Code Style**:
  - Use **Lombok** (`@Data`, `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`) to reduce boilerplate.
  - Utilize modern Java 17+ features (e.g., Records for DTOs where appropriate, var keyword for local variables, Switch expressions).

## Frontend Conventions: React
- **Build Tool**: We use **Create React App (CRA)**.
- **Components**: Write strictly Functional Components. Do NOT use Class Components. Utilize React Hooks (useState, useEffect, useMemo, useCallback) extensively.
- **Styling**: We use **Tailwind CSS**. Prefer utility classes for styling. Do not write custom CSS unless absolutely necessary (and if so, use standard CSS imports).
- **State Management**:
  - Global State: Use **Zustand** for global application state. Avoid Redux Toolkit or React Context for complex state.
  - Local State: Use `useState` or `useReducer`.
- **Data Fetching & Caching**: Use **React Query (TanStack Query)** for all server state, data fetching, caching, and synchronization. Do NOT use `useEffect` for data fetching.
- **Folder Structure**: Follow a feature-based or standard structural approach:
  - `src/components`: Reusable UI components.
  - `src/hooks`: Custom React hooks.
  - `src/pages`: Top-level page components.
  - `src/services` or `src/api`: Axios instances and API call definitions.
  - `src/store`: Zustand stores.

## Reference Skills
For detailed examples and code patterns, refer to the skills documentation:
- `docs/skills/backend-skills.md`
- `docs/skills/frontend-skills.md`
