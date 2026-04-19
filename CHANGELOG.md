# Changelog

## [2026-04-19] - EOD Consolidation

### Fixed
- **FIX**: Rimozione file di sistema 'nul' (causa di crash Turbopack su Windows). Questo file riservato causava un panic nel motore di rendering CSS di Turbopack.

### Added
- **FEAT**: Implementazione integrale Landing Page 'Amber Glow'. Include Hero section dinamica, Code Demo interattiva e sezione NPU Pricing (Dossier 16).
- **INFRA**: Configurazione Supabase SSR Middleware completa di guard clause per gestire variabili d'ambiente mancanti.
- **CONFIG**: Ottimizzazione `next.config.ts` per stabilità dell'ambiente di sviluppo su Windows.

### Changed
- **INFRA**: Popolamento `.env.local` con credenziali di produzione del progetto `glpjcsdzlvhydqgtttsq`.
