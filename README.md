
# robotjaol | Finance

## Summary
Personal & executive finance dashboard. Offline-first, secure, modular, and visually rich. All data and auth are local (no backend).

---

## System Flow

```mermaid
flowchart TD
    A["User"] -->|"Login/Register"| B["Auth (LocalStorage/IndexedDB)"]
    B --> C["Dashboard"]
    C --> D["Transactions CRUD"]
    C --> E["Budgeting"]
    C --> F["Reports & Insights"]
    C --> G["Goals"]
    C --> H["Management Panel"]
    C --> I["Export/Import"]
    C --> J["Settings"]
    C --> K["Simulation"]
    C --> L["Visualizer (3D)"]
    D -->|"Data"| M["LocalStorage/IndexedDB"]
    E -->|"Data"| M
    F -->|"Data"| M
    G -->|"Data"| M
    H -->|"Data"| M
    I -->|"Data"| M
    J -->|"Preferences"| M
    K -->|"Scenario Data"| M
    L -->|"Visualization Data"| M
```

---

## UI/UX, System, and Code Process

```mermaid
flowchart TD
    subgraph UIUX["UI/UX Flow"]
        A["User"] --> B["Login/Register"]
        B --> C["Dashboard"]
        C --> D["Tabs: Transactions, Budgeting, Reports, Goals, Management, Export, Settings, Simulation, Visualizer"]
    end
    subgraph System["System Architecture"]
        E["LocalStorage/IndexedDB"]
        F["SHA-256 Auth"]
        G["Data Visualization"]
        H["3D Visualizer"]
        I["Export/Import"]
    end
    D --> E
    B --> F
    D --> G
    D --> H
    D --> I
    subgraph Code["Code Process"]
        J["React Components"]
        K["Zustand Store"]
        L["Service Layer"]
        M["Utils/Constants"]
    end
    D --> J
    J --> K
    K --> L
    L --> E
    J --> M
```

---

## End-to-End Program Flow

```mermaid
flowchart TD
    subgraph User_Flow["End-to-End Program Flow"]
        A["User"] --> B["Login/Register"]
        B --> C["Auth Check (SHA-256, LocalStorage/IndexedDB)"]
        C -->|"Success"| D["Dashboard"]
        D --> E["Select Tab"]
        E --> F1["Transactions"]
        E --> F2["Budgeting"]
        E --> F3["Reports"]
        E --> F4["Goals"]
        E --> F5["Management"]
        E --> F6["Export/Import"]
        E --> F7["Settings"]
        E --> F8["Simulation"]
        E --> F9["Visualizer"]
        F1 --> G["CRUD Operations"]
        F2 --> G
        F3 --> G
        F4 --> G
        F5 --> G
        F6 --> G
        F7 --> G
        F8 --> G
        F9 --> G
        G --> H["Data Persisted (LocalStorage/IndexedDB)"]
        H --> I["UI Update (React State)"]
    end
```

---

## Code Process

```mermaid
flowchart TD
    subgraph Code_Process["Code Process"]
        J["User Action (UI Event)"] --> K["React Component"]
        K --> L["Zustand Store (State)"]
        L --> M["Service Layer (Data Ops)"]
        M --> N["Utils/Constants"]
        M --> O["LocalStorage/IndexedDB"]
        O --> P["Return Data"]
        P --> L
        L --> K
        K --> Q["UI Render"]
    end
```

---

## Tech Stack
- React (Vite)
- Zustand (state)
- Tailwind CSS, shadcn/ui
- IndexedDB/localStorage
- SHA-256 (auth)
- Recharts, Three.js, @react-three/fiber

## Features
- Multi-tab dashboard: Overview, Transactions, Budgeting, Reports, Goals, Management, Export, Settings, Simulation, Visualizer
- Full offline support
- Local-only authentication
- Data export/import (.csv, .xlsx, .pdf, .json)
- Animated charts, 3D visualizer
- Mobile-first, dark mode, accessible

## Architecture
- All data & auth: browser storage
- Modular React components
- Zustand for state
- Service layer for data ops
- Utility & constants modules

---

## Usage
- Install: `pnpm install`
- Dev: `pnpm run dev`
- Build: `pnpm run build`

---

For details, see code and comments. No backend required.

