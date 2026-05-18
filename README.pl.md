# vibe-forge

**Język / language:** [English](README.md) · [Polski](README.pl.md)

Na stronie głównej repozytorium GitHub domyślnie wyświetla `README.md`. Pełna wersja polska znajduje się w pliku [`README.pl.md`](README.pl.md).

<p align="center">
  <img src="docs/assets/readme/main.png" alt="Ikona główna vibe-forge" width="180">
</p>

> Szablonowy framework startowy dla **vibe-coderów** — osób, które budują realne oprogramowanie z asystentami AI (Cursor, Claude Code, Codex, Lovable, Windsurf, Copilot, …), niekoniecznie będąc zawodowymi inżynierami oprogramowania.
>
> `vibe-forge` **nie dostarcza gotowego stosu technologicznego**. Dostarcza **strukturę, reguły, prowadzony wywiad startowy oraz cichą sieć bezpieczeństwa**, które uruchamiają projekt oparty o dowolny stos w stanie, w którym agenci AI mogą nad nim bezpiecznie pracować, dokumentacja pozostaje wiarygodna, a kod nie gnije po cichu w typowy „vibe-code'owy" bałagan.

<p align="center">
  <img src="docs/assets/readme/banner-hero.png" alt="Baner hero vibe-forge" width="960">
</p>

---

## Spis treści

1. [Czym jest (a czym nie jest)](#czym-jest-a-czym-nie-jest)
2. [Dla kogo to jest](#dla-kogo-to-jest)
3. [Dziewięciokrokowa ścieżka](#dziewięciokrokowa-ścieżka)
4. [Szybki start](#szybki-start)
5. [Atomic prompts](#atomic-prompts)
6. [Wbudowana sieć bezpieczeństwa](#wbudowana-sieć-bezpieczeństwa--inżynierskie-zabezpieczenia-niewidoczne-dla-ciebie)
7. [Lokalny dashboard (`vibe-forge-ui`)](#lokalny-dashboard-vibe-forge-ui)
8. [Układ repozytorium](#układ-repozytorium)
9. [Obsługiwani agenci AI](#obsługiwani-agenci-ai)
10. [Filozofia dokumentacji](#filozofia-dokumentacji)
11. [Lista kontrolna po zakończeniu wywiadu](#lista-kontrolna-po-zakończeniu-wywiadu)
12. [Często zadawane pytania](#często-zadawane-pytania)
13. [Dziennik zmian frameworku](#dziennik-zmian-frameworku)
14. [Licencja](#licencja)

---

## Czym jest (a czym nie jest)

**`vibe-forge` to:**

- **Szablonowe repozytorium GitHub**, które klonujesz raz na każdy projekt.
- Zestaw **szablonów dokumentów** (`STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `LESSONS.md` oraz nadrzędny `PROJECT_RULES.md`), które przetrwają każdą zmianę stosu.
- **Pętla samodoskonalenia** (`LESSONS.md`), która zapisuje każdy błąd i każdą korektę jako regułę prewencyjną, przeglądaną na początku każdej sesji agenta — tak, aby ten sam błąd nie powtórzył się drugi raz.
- Zestaw **plików reguł specyficznych dla narzędzi** (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`, `.windsurfrules`, `copilot-instructions.md`, blok Lovable Project Knowledge) generowanych z jednego źródła prawdy.
- **Głęboko ustrukturyzowany prompt startowy** (`INIT_PROMPT_*.md`), który prowadzi z Tobą wywiad w Twoim języku i na końcu tworzy dopasowany szkielet projektu.
- **Dołączoną umiejętność `/atomic-prompts`**, która zamienia jednozdaniowy pomysł w wysokiej jakości, w pełni skontekstualizowany plik promptu, który możesz uruchomić w dowolnym narzędziu.
- **Siedem niewidocznych hooków jakościowych**, które działają cicho przy każdym zapisie pliku — wyłapując wyciekłe sekrety, błędy TypeScript, zbłąkane wywołania `console.log`, brakujące aktualizacje dokumentacji i szablonowe wzorce designu, zanim kiedykolwiek trafią do produkcji.
- Dwie **dodatkowe umiejętności on-demand** poza atomic-prompts: `/deploy-guide` (dokumentacja wdrożeniowa pobierana na żywo, zawsze aktualna) i `/project-health` (błyskawiczny pulpit 10 kontroli stanu projektu).
- **Trzystopniowa polityka testowania** wybierana podczas wywiadu — od szybkiego prototypowania bez testów po pełne TDD z pokryciem ≥ 80% — egzekwowana spójnie we wszystkich sześciu konfiguracjach agentów.

**`vibe-forge` to NIE:**

- Gotowy stos. Nie narzuca Reacta, Vue, Supabase, Firebase, Next.js ani niczego innego. Wywiad wybiera za Ciebie albo wspólnie z Tobą.
- Generator działający bez Ciebie. To model językowy prowadzi rozmowę; Ty odpowiadasz na pytania; pliki się pojawiają.
- Produkt wersjonowany semantycznie (jeszcze). Klonuj gałąź `main` — to jest framework. Historię zmian znajdziesz w sekcji [Dziennik zmian frameworku](#dziennik-zmian-frameworku).
- Zamiennik myślenia. Narzuca porządek, ale nie napisze specyfikacji produktu za Ciebie — choć potrafi Cię **dokładnie wypytać**, aż ją dostarczysz.

---

## Dla kogo to jest

Powinieneś lub powinnaś skorzystać z `vibe-forge`, jeśli **przynajmniej jedno** z poniższych stwierdzeń jest prawdziwe:

- Zaczynasz nowy projekt z pomocą AI i chcesz, aby **przetrwał etap proof of concept**.
- Nie jesteś starszym inżynierem i boisz się skończyć z kodem, po którym — nawet Twój asystent AI — nikt nie potrafi się połapać.
- Chcesz mieć **dokument gotowy do przekazania klientowi** (`CLIENT_DOCS.md`) na każdym etapie projektu.
- Jesteś niezależny od narzędzia albo podejrzewasz, że w trakcie projektu **będziesz przechodzić między Cursorem / Claude Code / Codexem / Lovabledem / Windsurfem / Copilotem**.
- Nie znosisz momentu, w którym asystent AI „zapomina", o czym jest projekt, bo **nie ma kanonicznego miejsca**, do którego można zajrzeć.
- Chcesz **prawdziwych inżynierskich zabezpieczeń** — skanowania sekretów, sprawdzania typów, pokrycia testami — bez konieczności samodzielnego ich konfigurowania lub nawet wiedzenia, że istnieją.

Jeśli jesteś inżynierem z mocnymi opiniami i zwartym stosem, nadal możesz z tego skorzystać — po prostu usuń po wywiadzie to, czego nie potrzebujesz.

---

## Dziewięciokrokowa ścieżka

<p align="center">
  <img src="docs/assets/readme/guided-interview.png" alt="Ilustracja wywiadu prowadzonego" width="420">
</p>

Tak wygląda zamierzona podróż użytkownika od początku do końca:

1. Otwierasz to repozytorium na GitHubie i czytasz README.
2. Przeglądasz folder [docs/](docs/), jeśli chcesz zrozumieć *dlaczego* tak to zaprojektowano.
3. **Klonujesz** repozytorium na swój komputer i zmieniasz nazwę folderu na nazwę projektu.
4. **Otwierasz sklonowany folder** w wybranym narzędziu AI (Cursor, Claude Code, Codex, …) i wklejasz do czatu jeden z plików `INIT_PROMPT_*.md`. Prompt sprawdza, czy działa wewnątrz klona `vibe-forge` (za pomocą pliku sygnalizacyjnego `.vibe-forge-root`). Jeśli katalog roboczy jest niewłaściwy, przerywa i prosi o poprawienie ścieżki.
5. Model **przeprowadza z Tobą wywiad** — w Twoim języku — o stos, design, domenę biznesową, bezpieczeństwo, grupę docelową, wdrożenie, narzędzia, filozofię testowania itd. W dowolnym momencie możesz odpowiedzieć:
   - jedną z opcji wielokrotnego wyboru zaproponowanych przez model,
   - **własną odpowiedzią swobodną**,
   - **opcją E („niech zdecyduje model")** dla pojedynczego pytania albo
   - poleceniem **`/skip-section`**, aby model wypełnił resztę sekcji najlepszymi zgadywaniami (prompt wymaga dwuetapowego potwierdzenia, żeby nie uruchomić tego przypadkowo).
6. Gdy wywiad się kończy, model **wypełnia każdy szablon** w `templates/` Twoimi odpowiedziami, przenosi je do katalogu głównego projektu, usuwa pozostałości szkieletu i zapisuje pierwsze wpisy w `CHANGELOG.md`, `STATE.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `LESSONS.md`. Instaluje też **hooki jakościowe** do `.claude/hooks/` (lokalnie dla projektu, globalnie albo w obu miejscach — Ty decydujesz podczas wywiadu) i kopiuje właściwe pliki umiejętności dla Twoich narzędzi. Jeśli o to poprosisz, przygotuje też prowadzone „jak działa ten projekt", które możesz przekazać osobie nietechnicznej.
7. **Wracasz do zwykłego promptowania** w swoim narzędziu. Wygenerowane `.cursorrules` / `CLAUDE.md` / `AGENTS.md` / … kierują każdą kolejną sesję agenta najpierw do `PROJECT_MAP.md`, więc przeładowanie kontekstu to **jeden plik**, a nie całe repozytorium. Hooki działają cicho w tle.
8. Gdy chcesz nową funkcję albo zmianę, możesz wywołać umiejętność **`/atomic-prompts`** (patrz niżej). Zamienia luźny pomysł w w pełni skontekstualizowany plik promptu w `atomic-prompts/`, który potem uruchomisz w tym samym albo innym narzędziu.
9. Śpisz spokojnie. Dokumentacja jest zsynchronizowana, historia liniowa, sekrety nie mogą wyciec do gita, klient ma co czytać, a AI ma się do czego oprzeć.

---

## Szybki start

```bash
# 1. Sklonuj framework (zmień nazwę folderu na swoją nazwę projektu)
git clone https://github.com/<twoj-fork-lub-organizacja>/vibe-forge.git moj-projekt
cd moj-projekt

# 2. (Opcjonalnie) Usuń historię gita vibe-forge, żeby powstało świeże repozytorium
rm -rf .git
git init

# 3. Otwórz folder w preferowanym narzędziu AI, a następnie wklej JEDEN z plików:
#    - INIT_PROMPT_short.md      (~10 pytań, najszybciej, głównie domyślne ustawienia modelu)
#    - INIT_PROMPT_standard.md   (~30 pytań, zalecane dla większości projektów)
#    - INIT_PROMPT_deep.md       (60+ pytań, wywiad w stylu audytowym)

# 4. Odpowiadaj na pytania. Używaj opcji E albo /skip-section, gdy
#    nie znasz odpowiedzi albo nie masz preferencji.

# 5. Po zakończeniu wywiadu wykonaj listę kontrolną sprzątania
#    wypisaną na końcu ostatniej wiadomości promptu.
```

> **Wskazówka:** Uruchom wywiad w *świeżej* sesji czatu swojego narzędzia AI, ze sklonowanym folderem jako katalogiem głównym workspace'u. Nie wklejaj promptu w długą, niepowiązaną rozmowę — opiera się na czystym kontekście.

---

## Atomic prompts

<p align="center">
  <img src="docs/assets/readme/atomic-prompts.png" alt="Ilustracja promptów atomowych" width="420">
</p>

To jeden z dwóch powodów, dla których istnieje `vibe-forge` (drugi to wywiad). W edytorach zwykle wywołujesz ją jako `/atomic-prompts`.

**Co robi.** Podajesz modelowi zdanie w stylu:

> „Dodaj logowanie Google do ekranu uwierzytelniania."

…a on tworzy kompletny, samowystarczalny plik promptu w `atomic-prompts/NNNN-add-google-login-to-auth-screen.md`, ustrukturyzowany tak, jak napisałby go starszy inżynier w zgłoszeniu: kontekst, kryteria akceptacji, pliki do zmiany, przypadki brzegowe, testy, notatki o wycofaniu zmian, odniesienia do `PROJECT_MAP.md` i `STATE.md`. Ten plik zostaje z Tobą na zawsze — możesz go ponownie uruchomić, porównać diffem, udostępnić albo jutro wykonać w innym narzędziu.

Umiejętność jest dostępna w trzech wariantach w folderze `skills/`:

- `skills/cursor/.cursor/commands/atomic-prompts.md` — polecenie po ukośniku w Cursorze.
- `skills/claude-code/.claude/skills/atomic-prompts/SKILL.md` — umiejętność w Claude Code.
- `skills/codex/.codex/skills/atomic-prompts/SKILL.md` — umiejętność w Codexie.

W trakcie wywiadu prompt zapyta, z jakich narzędzi korzystasz, i **zainstaluje właściwe warianty w katalogu głównym projektu** (oraz podpowie, jak zainstalować je globalnie, jeśli wolisz). Po instalacji działa którykolwiek z poniższych wzorów:

```text
/atomic-prompts Add Google login to the auth screen
```
```text
Use the atomic-prompts skill for: "Add Google login to the auth screen"
```
```text
Run /atomic-prompts on this idea: dark-mode toggle in the settings page
```

Struktura wyjścia opiera się na sprawdzonym formacie używanym w realnych promptach atomowych (pełny schemat i przykłady w pliku `docs/PROMPT_AUTHORING_GUIDE.md`).

---

## Wbudowana sieć bezpieczeństwa — inżynierskie zabezpieczenia, niewidoczne dla Ciebie

To jest to, co odróżnia `vibe-forge` od prostej kolekcji plików reguł. Po instalacji otrzymujesz **pasywną warstwę jakości i bezpieczeństwa**, która działa cicho przy każdym zapisie pliku. Żadnej konfiguracji. Żadnej wiedzy inżynierskiej. Po prostu działa.

### Siedem automatycznych hooków (Claude Code)

Siedem skryptów działających w tle aktywuje się przy każdej operacji na pliku. Gdy wszystko gra — nigdy o nich nie słyszysz. Gdy coś wymaga uwagi — mówią — i zawsze są domyślnie nieblokujące (ostrzegają, nie przerywają pracy).

| Hook | Wyzwalacz | Co Cię chroni |
|------|-----------|---------------|
| **Skaner sekretów** | Przed każdym zapisem pliku | Klucze API, tokeny, hasła, adresy URL baz danych przypadkowo wklejone do kodu źródłowego. Blokuje zapis, gdy wykryje wzorzec sekretu. |
| **Ochrona konfiguracji** | Przed dotknięciem plików konfiguracyjnych | Przypadkowe edycje `.eslintrc`, `tsconfig.json`, `biome.json`, `.prettierrc`, `.editorconfig` i innych krytycznych plików projektu — ostrzega, zanim zepsujesz build. |
| **Brama jakości TypeScript** | Po każdej edycji `.ts`/`.tsx` | Uruchamia `tsc --noEmit` i raportuje aktualną liczbę błędów — zawsze wiesz, czy projekt się kompiluje. |
| **Strażnik console.log** | Po każdej edycji pliku źródłowego | Zbłąkane wywołania `console.log/warn/error/debug`, które zaśmiecają konsolę przeglądarki lub ujawniają stan wewnętrzny w produkcji. |
| **Przypomnienie o synchro doc** | Po każdej edycji pliku źródłowego | Przypomina o aktualizacji `STATE.md` po zmianie kodu — mapa projektu nigdy nie odpływa od rzeczywistości. |
| **Auto-formatter** | Na końcu sesji (zdarzenie Stop) | Uruchamia `biome format --write .` (lub `prettier` jako fallback) automatycznie, a potem robi finalne `tsc --noEmit` i raportuje. |
| **Strażnik unikalności designu** | Po edycji pliku UI (`.tsx/.jsx/.html`) | Ostrzega, gdy wzorce klas w stylu Bootstrap (`col-md-4`, `btn btn-primary`, `jumbotron`, …) sugerują generyczny, szablonowy wygląd zamiast unikalnego designu. |

**Wsparcie Windows:** Każdy hook jest dostarczany w dwóch wariantach — `.sh` (macOS/Linux) i `.ps1` (PowerShell/Windows). Wywiad wykrywa Twój system operacyjny i instaluje właściwy.

**Zakres pod Twoją kontrolą:** Podczas wywiadu wybierasz, gdzie instalowane są hooki:
- **Lokalnie dla projektu** — aktywne tylko dla tego projektu (`.claude/hooks/`)
- **Globalnie** — stosowane do wszystkich Twoich projektów Claude Code (`~/.claude/hooks/`)
- **W obu miejscach** — maksymalna ochrona wszędzie
- **Pomiń** — jeśli wolisz zarządzać hookami samodzielnie

### Trzystopniowa polityka testowania — Twój wybór, egzekwowany wszędzie

Wybierasz filozofię testowania dopasowaną do etapu projektu. Twój wybór jest zapisywany we wszystkich sześciu konfiguracjach agentów, więc każde narzędzie AI zna regułę od pierwszej sesji.

| Poziom | Co oznacza | Najlepszy dla |
|--------|-----------|---------------|
| **Bez testów** | Szybkie tempo, brak wymagań testowych. | Jednorazowe prototypy, wczesna eksploracja. |
| **Podstawowe TDD** | Każda nowa funkcja trafia z co najmniej jednym testem happy-path, zanim funkcja zostanie oznaczona jako gotowa. | Większość realnych projektów — jakość bez ceremonii. |
| **Pełne TDD** | Najpierw nieudany test (RED) → minimalna implementacja (GREEN) → refaktoryzacja. Pokrycie ≥ 80%. Nigdy nie pomijaj RED. | Aplikacje produkcyjne, praca z klientem, wszystko, co ma przetrwać. |

### `/deploy-guide` — dokumentacja wdrożeniowa na żywo, zawsze aktualna

Wpisz `/deploy-guide` w Claude Code, Cursorze lub Codex CLI. Agent:

1. Identyfikuje Twoją platformę wdrożeniową (Vercel, Fly.io, Railway, AWS, Supabase, Render, …)
2. **Pobiera aktualną oficjalną dokumentację na żywo** — nie dane treningowe sprzed miesięcy, ale prawdziwe aktualne docs
3. Pisze kompletny `DEPLOYMENT.md` obejmujący:
   - Wymagania wstępne i potrzebne konta
   - Tabelę zmiennych środowiskowych (z opisami i informacją, skąd wziąć każdą wartość)
   - Krok po kroku wdrożenie na staging
   - Krok po kroku wdrożenie na produkcję
   - 5 specyficznych dla platformy weryfikacji po wdrożeniu
   - Procedurę wycofania zmian
   - Szacunek kosztów dla Twojego przewidywanego poziomu użytkowania

Wynikiem jest `DEPLOYMENT.md`, który możesz przekazać nietchnicznnemu klientowi lub nowemu członkowi zespołu — zawsze dokładny, zawsze dopasowany do Twojego stosu.

### `/project-health` — błyskawiczny pulpit 10 kontroli

Wpisz `/project-health` w dowolnym momencie, gdy chcesz zrzut rzeczywistego stanu projektu. Otrzymujesz pulpit jak ten:

```
## Stan projektu — 2025-05-16

| #  | Kontrola                    | Status                           |
|----|-----------------------------|----------------------------------|
|  1 | Skan sekretów               | ✅ Czysto                         |
|  2 | Błędy TypeScript            | ✅ 0 błędów                       |
|  3 | npm audit                   | ⚠️  2 podatności umiarkowane      |
|  4 | Nieużywane zależności       | ✅ Czysto                         |
|  5 | Świeżość dokumentacji       | ✅ STATE.md aktualizowany dziś    |
|  6 | Pokrycie testami            | ⚠️  74% (cel: 80%)               |
|  7 | Stan builda                 | ✅ Build przechodzi               |
|  8 | Martwe eksporty (ts-prune)  | ✅ 0 znalezionych                 |
|  9 | Rozmiar bundle              | ✅ 142 KB (gzip)                  |
| 10 | Aktywność LESSONS.md        | ✅ 3 nowe lekcje w tym tygodniu   |

### Punkty działania (posortowane według ważności)
- ⚠️  Doprowadź pokrycie testami do 80% — skup się na `src/auth/` (aktualnie 42%)
- ⚠️  Zaktualizuj 2 pakiety npm z umiarkowanymi podatnościami: `follow-redirects`, `axios`
```

Dostępne dla Claude Code, Cursor i Codex. Zero konfiguracji — działa na lokalnych plikach projektu.

---

## Lokalny dashboard (`vibe-forge-ui`)

`vibe-forge` zawiera opcjonalny **lokalny dashboard** — aplikację webową opartą na Fastify + React, która mieszka w katalogu `gui/`. Daje Ci wizualny, przeglądarkowy widok projektu bez wychodzenia z terminala.

### Co obejmuje (v0.5)

| Ekran | Ścieżka | Co widać |
|-------|---------|---------|
| **Home** | `/` | Nazwa projektu, stos, poziom TDD, siatka świeżości dokumentów z zlokalizowanymi odznaczkami wiekowych, ostatnie wpisy changelogu, najnowsze lekcje |
| **Docs** | `/docs` | Wszystkie pliki `.md` projektu, przeglądane i renderowane |
| **Health** | `/health` | Karta wynikowa 10 kontroli; opatrzony adnotacjami wykres SVG historii z kolorowymi strefami progowymi, etykietami osi Y/X, wartościami score na każdym punkcie; zwijana lista wywołań; szczegóły każdej kontroli; przycisk ponownego uruchomienia |
| **Prompts** | `/prompts` | Wszystkie pliki `atomic-prompts/` jako karty; filtrowanie po statusie; tworzenie nowych promptów z formularza |
| **Hooks Monitor** | `/hooks` | Skonfigurowane hooki, ich komendy i na żywo feed zdarzeń z `.vibe-forge/hook-events.json` |

### Jak uruchomić

```bash
cd gui
npm install        # tylko za pierwszym razem
npm run dev        # uruchamia serwer (port 7432) i klienta (port 5173)
```

Otwórz `http://localhost:5173` w przeglądarce. API Fastify działa pod `http://localhost:7432/api/*`.

> **Uwaga:** Dashboard czyta **katalog nadrzędny** do `gui/` jako root projektu — pokazuje Twoje faktyczne pliki projektu, a nie pliki źródłowe gui.

### Build produkcyjny

```bash
cd gui
npm run build      # buduje klienta React do gui/dist/
npm run start      # serwuje zbudowanego klienta statycznie z Fastify
```

Serwer produkcyjny działa w całości na porcie 7432 bez osobnego procesu Vite.

---

## Układ repozytorium

```text
vibe-forge/
├── README.md                        ← wersja angielska
├── README.pl.md                     ← jesteś tu (pełne polskie README)
├── .vibe-forge-root                 ← plik sygnalizacyjny; INIT_PROMPT nie uruchomi się bez niego
├── .gitignore                       ← minimalna baza; rozszerzana po wywiadzie
├── .env.example                     ← placeholder; zastępowany po wywiadzie
│
├── gui/                             ← opcjonalny lokalny dashboard (Fastify + React)
│   ├── README.md                    ← dokumentacja deweloperska dashboardu
│   ├── package.json
│   ├── server/                      ← API Fastify (port 7432)
│   │   ├── index.ts
│   │   ├── routes/                  ← health, prompts, hooks, docs, project
│   │   ├── checks/                  ← 10 modułów health-check
│   │   └── utils/
│   └── client/                      ← React 18 + Vite + Tailwind SPA
│       └── src/
│           ├── pages/               ← Home, Docs, Health, Prompts, Hooks
│           └── components/
│
├── INIT_PROMPT_short.md             ← wywiad, ~10 pytań
├── INIT_PROMPT_standard.md          ← wywiad, ~30 pytań (zalecane)
├── INIT_PROMPT_deep.md              ← wywiad, 60+ pytań
│
├── docs/                            ← dokumentacja samego frameworku
│   ├── assets/
│   │   └── readme/                  ← grafiki README i ilustracje marki
│   │       ├── main.png
│   │       ├── banner-hero.png
│   │       ├── guided-interview.png
│   │       ├── atomic-prompts.png
│   │       └── documentation-discipline.png
│   ├── HOW_IT_WORKS.md
│   ├── INTERVIEW_PHILOSOPHY.md
│   ├── PROMPT_AUTHORING_GUIDE.md
│   └── FRAMEWORK_CHANGELOG.md
│
├── templates/                       ← zużywane przez INIT_PROMPT, usuwane potem
│   ├── project-docs/                ← szablony dokumentów projektowych
│   │   ├── STATE.md.template
│   │   ├── CHANGELOG.md.template
│   │   ├── CLIENT_DOCS.md.template
│   │   ├── PROJECT_MAP.md.template
│   │   ├── RELEASE_NOTES.md.template
│   │   └── LESSONS.md.template
│   ├── project-rules/               ← szablony reguł projektowych
│   │   ├── PROJECT_RULES.md.template       ← NADRZĘDNE źródło prawdy
│   │   ├── CODING_RULES.md.template
│   │   ├── DESIGN.md.template
│   │   ├── PRODUCT.md.template
│   │   ├── DATABASE.md.template
│   │   └── DEPLOYMENT.md.template
│   ├── agent-configs/               ← pliki reguł pod konkretne narzędzia (z PROJECT_RULES)
│   │   ├── cursor/        (.cursorrules.template, .cursor/rules/*)
│   │   ├── claude-code/   (CLAUDE.md.template)
│   │   ├── codex/         (AGENTS.md.template)
│   │   ├── windsurf/      (.windsurfrules.template)
│   │   ├── copilot/       (.github/copilot-instructions.md.template)
│   │   └── lovable/       (LOVABLE_PROJECT_KNOWLEDGE.md.template)
│   ├── hooks/                       ← hooki jakościowe, instalowane podczas wywiadu
│   │   ├── claude-code/
│   │   │   ├── hooks.json.template          ← rejestr hooków (macOS/Linux)
│   │   │   └── hooks.windows.json.template  ← rejestr hooków (Windows/PowerShell)
│   │   └── scripts/
│   │       ├── secret-scanner.sh / .ps1
│   │       ├── config-protection.sh / .ps1
│   │       ├── quality-gate.sh / .ps1
│   │       ├── console-log-warn.sh / .ps1
│   │       ├── doc-sync-reminder.sh / .ps1
│   │       ├── auto-format.sh / .ps1
│   │       └── design-quality-check.sh / .ps1
│   └── env-examples/                ← warianty .env.example pod konkretne stosy
│       ├── supabase.env.example
│       ├── firebase.env.example
│       ├── postgres.env.example
│       └── vercel.env.example
│
└── skills/                          ← umiejętności on-demand, kilka wariantów
    ├── README.md                    ← instrukcje instalacji
    ├── cursor/.cursor/commands/
    │   ├── atomic-prompts.md        ← polecenie /atomic-prompts
    │   ├── deploy-guide.md          ← polecenie /deploy-guide
    │   └── project-health.md        ← polecenie /project-health
    ├── claude-code/.claude/skills/
    │   ├── atomic-prompts/SKILL.md
    │   ├── deploy-guide/SKILL.md
    │   └── project-health/SKILL.md
    └── codex/.codex/skills/
        ├── atomic-prompts/SKILL.md
        ├── deploy-guide/SKILL.md
        └── project-health/SKILL.md
```

Po zakończeniu wywiadu:

- folder `templates/` jest **usuwany** (albo archiwizowany w `.vibe-forge/used/`, jeśli się na to zdecydujesz),
- pliki `INIT_PROMPT_*.md` są **usuwane** (zawsze możesz je odzyskać z tego repozytorium),
- plik `.vibe-forge-root` jest **usuwany**,
- folder `docs/` **zostaje**, jeśli chcesz zachować dokumentację frameworku; w przeciwnym razie jest **usuwany** — decyzja podczas wywiadu,
- wszystkie sześć plików `templates/project-docs/*.template` staje się rzeczywistymi plikami w katalogu głównym projektu,
- skrypty hooków trafiają do `.claude/hooks/` (i/lub globalnej konfiguracji Claude Code, zależnie od wyboru).

---

## Obsługiwani agenci AI

`vibe-forge` jest **z założenia niezależny od narzędzia**. Wywiad wykrywa, z czego korzystasz, i zapisuje odpowiednie pliki reguł. Obecnie framework dostarcza szablony pierwszej klasy dla:

| Narzędzie      | Generowany plik                                   | Zainstalowane umiejętności                                                   |
| -------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| Cursor         | `.cursorrules`, `.cursor/rules/*.mdc`            | `/atomic-prompts`, `/deploy-guide`, `/project-health`                        |
| Claude Code    | `CLAUDE.md`, `.claude/hooks/`, `.claude/skills/` | `/atomic-prompts`, `/deploy-guide`, `/project-health` + 7 hooków             |
| Codex CLI      | `AGENTS.md`, `.codex/skills/`                    | `/atomic-prompts`, `/deploy-guide`, `/project-health`                        |
| Windsurf       | `.windsurfrules`                                  | Tylko reguły (Windsurf nie ma natywnego systemu hooków/umiejętności).        |
| GitHub Copilot | `.github/copilot-instructions.md`               | Tylko reguły (dla API instrukcji repozytorium Copilot Chat).                 |
| Lovable        | blok Lovable Project Knowledge (gotowy do wklejenia) | Tylko reguły — generowany z `PROJECT_RULES.md`.                         |

**Dlaczego hooki tylko w Claude Code?** Claude Code jest jedynym narzędziem na tej liście z systemem hooków pierwszej klasy (zdarzenia `PreToolUse`, `PostToolUse`, `Stop`). Wszystkie pozostałe narzędzia otrzymują równoważne reguły osadzone w plikach konfiguracyjnych — polegają na przestrzeganiu reguł przez agenta, a nie na egzekucji na poziomie systemu operacyjnego.

Jeśli Twojego narzędzia nie ma na liście, nadrzędny `PROJECT_RULES.md` i tak daje Ci około 95% tego, czego potrzebujesz — możesz go wkleić w pole „system prompt" / „niestandardowe instrukcje".

---

## Filozofia dokumentacji

<p align="center">
  <img src="docs/assets/readme/documentation-discipline.png" alt="Ilustracja dyscypliny dokumentacyjnej" width="420">
</p>

`vibe-forge` wymusza **sześć oddzielnych plików dokumentacji** w katalogu głównym projektu; każdy ma **jedno** zadanie i tylko jedno:

| Plik               | Odbiorcy          | Zasada aktualizacji                               |
| ------------------ | ----------------- | ------------------------------------------------- |
| `STATE.md`         | model + deweloper | **Nadpisywany** — tylko aktualna prawda, bez historii. Usunięta funkcja znika stąd. |
| `CHANGELOG.md`     | deweloper + Ty z przyszłości | **Tylko dopisywanie** — liniowa historia. Każda istotna zmiana to nowy wpis. Bez retuszowania przeszłości. |
| `CLIENT_DOCS.md`   | klient końcowy    | Prosty język, nietechniczny. Aktualizowany przy zmianie zachowania produktu. Bezpieczny do przekazania w każdej chwili. |
| `PROJECT_MAP.md`   | model (głównie)   | Zwięzła, mechaniczna mapa plików / modułów / źródeł prawdy. Pierwszy plik, do którego prowadzą reguły agenta. |
| `RELEASE_NOTES.md` | mieszany / publiczny | Notatki per wersja z perspektywy użytkownika. Powstają z `CHANGELOG.md` przy wydaniu. |
| `LESSONS.md`       | model + deweloper | **Dopisywany po każdej korekcie.** Każdy wpis: wzorzec, przyczyna źródłowa, reguła prewencyjna. Przeglądany na starcie sesji. Wpisy „dojrzewają" do stałych plików reguł, gdy się potwierdzą. |

Oraz pliki reguł:

| Plik               | Przeznaczenie                                                                 |
| ------------------ | ----------------------------------------------------------------------------- |
| `PROJECT_RULES.md` | Nadrzędne źródło prawdy, niezależne od narzędzia. Z niego pochodzą pozostałe pliki reguł. |
| `CODING_RULES.md`  | Reguły na poziomie kodu (JSDoc, obsługa błędów, bezpieczeństwo, nazewnictwo itd.). |
| `DESIGN.md`        | System designu, kolory, typografia, komponenty, ruch, dostępność.            |
| `PRODUCT.md`       | Czym jest produkt, komu służy, co musi robić.                                 |
| `DATABASE.md`      | Schemat, polityka migracji, reguły RLS / bezpieczeństwa, typy wyliczeniowe.   |
| `DEPLOYMENT.md`    | Hosting, środowiska, polityka sekretów, instrukcje operacyjne.               |

Długie uzasadnienie podziału znajdziesz w [`docs/HOW_IT_WORKS.md`](docs/HOW_IT_WORKS.md).

---

## Lista kontrolna po zakończeniu wywiadu

Ostatnia wiadomość każdego pliku `INIT_PROMPT_*.md` kończy się tą listą. Powtarzamy ją tutaj, żebyś mógł lub mogła szybko zweryfikować wynik:

- [ ] W katalogu głównym projektu istnieją `STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `LESSONS.md` z treścią.
- [ ] Istnieje `PROJECT_RULES.md` z wybranym stosem, polityką językową i linią bazową bezpieczeństwa.
- [ ] Dla każdego narzędzia, z którego korzystasz, istnieje co najmniej jeden pasujący plik reguł (`.cursorrules`, `CLAUDE.md`, `AGENTS.md` itd.).
- [ ] `.env.example` odzwierciedla wybrany stos (Supabase / Firebase / Postgres / Vercel / własny).
- [ ] `.gitignore` został rozszerzony o wpisy specyficzne dla stosu.
- [ ] Folder `atomic-prompts/` istnieje (pusty też w porządku), a umiejętność `/atomic-prompts` jest zainstalowana dla co najmniej jednego narzędzia.
- [ ] Jeśli korzystasz z Claude Code: `.claude/hooks/` istnieje i zawiera skrypty hooków pasujące do Twojego systemu operacyjnego (`.sh` lub `.ps1`).
- [ ] Umiejętności `/deploy-guide` i `/project-health` są zainstalowane dla co najmniej jednego z Twoich narzędzi.
- [ ] `templates/`, pliki `INIT_PROMPT_*.md` oraz `.vibe-forge-root` zostały usunięte (albo przeniesione do `.vibe-forge/used/`).
- [ ] `git status` pokazuje wyłącznie pliki, których się spodziewasz.

---

## Często zadawane pytania

**P: Czy mogę uruchomić wywiad drugi raz?**  
**O:** Tak, ale jest to destrukcyjne — jeśli chcesz zacząć od zera, sklonuj framework do świeżego folderu. Nie ma formalnej ścieżki aktualizacji między wersjami frameworku.

**P: Dlaczego framework nie ma numeracji semver?**  
**O:** Bo nie ma „aktualizacji w miejscu" — każdy projekt powstaje ze zrzutu `main` w momencie klonowania. Historia samego frameworku jest w [`docs/FRAMEWORK_CHANGELOG.md`](docs/FRAMEWORK_CHANGELOG.md). Jeśli chcesz zamrożoną wersję, zrób fork albo tag na commicie, z którego klonowałeś.

**P: W jakim języku jest wywiad?**  
**O:** Wykrywa język Twojej pierwszej odpowiedzi i kontynuuje w tym języku. README i szkielet szablonów są po angielsku; *wygenerowana* dokumentacja (`.md`) domyślnie przyjmuje język potwierdzony podczas wywiadu. Komentarze w kodzie domyślnie po angielsku — możesz to nadpisać.

**P: Co jeśli w moim narzędziu nie ma `askUserQuestion`?**  
**O:** Prompt automatycznie przechodzi na ponumerowane pytania Markdown z czterema opcjami (A / B / C / D), gdzie D to zawsze „moja własna odpowiedź (swobodna)".

**P: Co jeśli nie znam odpowiedzi na pytanie o design albo kod?**  
**O:** Wybierz **opcję E („niech zdecyduje model")** dla tego jednego pytania albo wywołaj **`/skip-section`**, by model wypełnił resztę sekcji. Oba warianty wymagają potwierdzenia, więc nie uruchomisz ich przypadkowo.

**P: Czy mogę później dodać kolejne narzędzia agenta?**  
**O:** Tak. `PROJECT_RULES.md` jest jedynym źródłem prawdy; Ty (albo Twój asystent AI) możecie w każdej chwili wyprowadzić z niego nowe pliki pod inne narzędzia.

**P: Czy hooki spowalniają Claude Code?**  
**O:** Nie. To lekkie skrypty powłoki (< 50 ms każdy). Skaner sekretów, ochrona konfiguracji i strażnik console.log działają w milisekundach. Brama jakości TypeScript uruchamia `tsc --noEmit` — to zajmuje kilka sekund przy większych projektach, ale jest nieblokująca (tylko raportuje, nie zatrzymuje agenta).

**P: Co jeśli nie korzystam z Claude Code?**  
**O:** Hooki są specyficzne dla Claude Code. Wszystkie pozostałe narzędzia (Cursor, Codex, Windsurf, Copilot, Lovable) otrzymują równoważne reguły osadzone w plikach konfiguracyjnych. Umiejętności `/deploy-guide` i `/project-health` działają natywnie również w Cursorze i Codexie.

**P: Czy mogę zmienić poziom testowania później?**  
**O:** Tak — edytuj `PROJECT_RULES.md` i wygeneruj ponownie konfiguracje agentów (każdy asystent AI może to za Ciebie zrobić). Poziom TDD to pojedynczy placeholder `<<TDD_TIER>>`, który kontroluje bloki warunkowe we wszystkich wygenerowanych plikach.

---

## Dziennik zmian frameworku

### v1.3

- **Ekran Health — opatrzony adnotacjami wykres historii wyników SVG:** Zastąpiono prosty wykres sparkline w pełni opatrzonym adnotacjami wykresem pokazującym strefy progowe (zielona ≥80, bursztynowa ≥50, czerwona <50), etykiety osi Y (0/50/80/100), znaczniki numerów przebiegów na osi X z zabezpieczeniem przed nakładaniem, etykiety wyników na każdym punkcie danych z białą aureolą dla czytelności oraz zwijaną listą przebiegów (data, godzina, wynik) pod wykresem. Wykres renderuje się od pierwszego przebiegu.
- **Ekran Home — zlokalizowane odznaki świeżości dokumentów:** Etykiety odznak używają teraz kluczy i18n (`badgeMissing`, `badgeToday`, `badgeDaysAgo(n)`) zamiast surowych ciągów z API. Stack i poziom TDD wyświetlają przetłumaczoną etykietę "nieznany" gdy wartość jest nieobecna.
- **Rozszerzenia i18n (EN + PL):** Klucze `historyExplain`, `badgeMissing`, `badgeToday`, `badgeDaysAgo`, `unknown` dodane do obu plików lokalizacji.

### v1.2

- **Lokalny dashboard (`vibe-forge-ui`):** Aplikacja webowa Fastify + React w katalogu `gui/` z pięcioma ekranami — Home, Docs, Health, Prompts, Hooks Monitor.
  - Ekran Health uruchamia wszystkie 10 kontroli na żądanie, pokazuje kartę wynikową i wykres historii z 90 wpisami.
  - Ekran Prompts listuje i tworzy pliki `atomic-prompts/` z filtrowaniem po statusie.
  - Hooks Monitor pokazuje skonfigurowane hooki Claude Code i przesyła strumieniowo ostatnie zdarzenia hooków.
  - Uruchamia się przez `cd gui && npm run dev`; build produkcyjny serwowany przez `npm run start`.

### v1.1

- **Integracja sieci bezpieczeństwa ECC:**
  - Siedem hooków Claude Code (skaner sekretów, ochrona konfiguracji, brama jakości TypeScript, strażnik console.log, przypomnienie o synchro doc, auto-formatter, strażnik unikalności designu) w wariantach `.sh` (macOS/Linux) i `.ps1` (Windows/PowerShell).
  - Wybór zakresu hooków (lokalnie dla projektu / globalnie / w obu miejscach / pomiń) dodany do wszystkich trzech przepływów wywiadu `INIT_PROMPT_*.md`.
  - Katalog `templates/hooks/` z `hooks.json.template` i `hooks.windows.json.template`.
- **Trzystopniowa polityka testowania:** Bez testów / Podstawowe TDD / Pełne TDD — wybierana podczas wywiadu, egzekwowana przez bloki warunkowe (`<<#IF_TDD_NONE>>`, `<<#IF_TDD_BASIC>>`, `<<#IF_TDD_FULL>>`) we wszystkich sześciu szablonach konfiguracji agentów.
- **Nowe umiejętności:**
  - `/deploy-guide` — dokumentacja wdrożeniowa pobierana na żywo (Cursor, Claude Code, Codex).
  - `/project-health` — pulpit 10 kontroli stanu projektu (Cursor, Claude Code, Codex).
- **Bezpieczeństwo non-negotiables** osadzone we wszystkich sześciu szablonach konfiguracji agentów (sekrety, zapytania parametryczne, zapobieganie commitowaniu `.env`).

### v1.0

- Trzy warianty `INIT_PROMPT_*.md` (short / standard / deep).
- Sześć szablonów dokumentów projektowych (w tym pętla samodoskonalenia `LESSONS.md`) oraz sześć szablonów reguł.
- Szablony konfiguracji agentów dla Cursora, Claude Code, Codexa, Windsurfa, Copilota i Lovable.
- Umiejętność `/atomic-prompts` w wariantach Cursor, Claude Code i Codex.
- Sprawdzanie ścieżki plikiem sygnalizacyjnym, hybrydowa interakcja wywiadu (`askUserQuestion` + ponumerowany fallback, opcja E + `/skip-section`).
- Dokumentacja: [`docs/FRAMEWORK_CHANGELOG.md`](docs/FRAMEWORK_CHANGELOG.md), [`docs/HOW_IT_WORKS.md`](docs/HOW_IT_WORKS.md), [`docs/PROMPT_AUTHORING_GUIDE.md`](docs/PROMPT_AUTHORING_GUIDE.md).

---

## Licencja

MIT, chyba że zrobisz fork i postanowisz inaczej. Jeśli plik `LICENSE` jest w repozytorium, patrz tam — w przeciwnym razie przyjmij MIT.
