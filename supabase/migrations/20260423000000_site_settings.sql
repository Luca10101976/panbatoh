-- Tabulka pro uložení JSON nastavení a obsahu her
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);
