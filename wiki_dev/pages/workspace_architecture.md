# Workspace Architecture v3.1

**Data:** 2026-04-27

**Pattern:** Multi-Pane (Onglets)

## Logica di Navigazione

Il sistema utilizza uno state manager locale nel layout per gestire i `panes` attivi. La Sidebar invia l'ID del modulo, il layout controlla se è già aperto e sposta il focus.

## Componenti Core

- `SidebarMain`: Trigger di navigazione tramite `onNavigate`.
- `DashboardLayout`: Orchestratore degli stati e della barra degli onglet superiore.
