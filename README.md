# Obersten OHG

Eigenständige Website für ein junges Digitalstudio von Studenten der Hochschule Koblenz. Inhalte: Websites, KI und Automatisierung sowie digitale Werkzeuge. Keine offizielle Hochschulpartnerschaft wird behauptet.

## Lokal starten

Voraussetzung: Bun ab 1.2. Keine Pakete oder Zugangsdaten nötig.

```sh
bun run dev
# http://127.0.0.1:4321
bun run build:ci
bun run preview
```

`public/` enthält die bearbeitbaren Dateien. Der Build validiert deutsche Metadaten, lokale Verweise, Sprungziele und JavaScript und kopiert die Website nach `dist/`.

## Drei Vorschläge

- `/?stil=studio`: dunkles Grün und Limette, empfohlen.
- `/?stil=nord`: hell und blau.
- `/?stil=signal`: Aubergine, Koralle und Serifenschrift.
- `/konzepte.html`: direkter Vergleich.

Alle Varianten verwenden die gleichen Inhalte und Funktionen. Die Auswahl steht ausschließlich in der URL. Kein Cookie und kein Local Storage.

## Funktionen und Grenzen

- Responsive Navigation und Layout.
- Drei interaktive, ausdrücklich als Simulation gekennzeichnete Abläufe.
- Projektbrief lokal erstellen, herunterladen und kopieren. Kein Nachrichtenversand, keine Speicherung und kein Backend.
- FAQ und zugängliche Dialoge.
- Keine Analytics, externen Fonts, Bilddienste oder sonstigen Browseranfragen an Drittanbieter im Website-Code. Hosting kann Verbindungsdaten verarbeiten.
- Private Konzeptvorschau: Suchmaschinen sind über HTML und `robots.txt` ausgeschlossen. Das ist kein Zugriffsschutz; die Sites-Vorschau hat zusätzlich privaten Zugriff.
- Unternehmensanschrift, Kontakt-E-Mail, Vertretung und Registerangaben fehlen. Die Rechtsdialoge benennen diese Lücken und sind keine fertigen Rechtstexte.

## GitHub-Struktur

Eigenständiges Repository: [Dobbi007/Obersten-OHG](https://github.com/Dobbi007/Obersten-OHG). Es wurde vom Nutzer als öffentliches Repository angelegt; diese Sichtbarkeit wird beibehalten. Die private Sites-Vorschau ist davon unabhängig. Bestehende fremde Repositories nicht umbenennen oder wiederverwenden.

- `main`: geprüfter Integrationsstand.
- `codex/obersten-website`: Arbeitsbranch für diesen Entwurf.
- Pull Requests beschreiben Besucheränderung und Prüfung.
- `ci.yml` führt `bun run build:ci` aus und speichert den Build als Artefakt.
- `deploy.yml` veröffentlicht ausschließlich `main`, wenn Cloudflare explizit eingerichtet ist.
- Issue-Vorlage und PR-Vorlage liegen in `.github/`.

Die Sites-Quellsicherung verwendet ein separates verwaltetes Git-Repository. Sie ist kein GitHub-Repository. Der GitHub-Upload ist erst abgeschlossen, wenn ein tatsächlicher GitHub-Link und der passende Commit verifiziert wurden.

## Cloudflare

Der eigenständige Worker heißt `obersten-ohg`. `wrangler.jsonc` enthält bewusst keine Account-ID und keine Produktionsdomain. Der Worker liefert statische Assets aus `dist/` aus.

Einrichtung im Obersten-GitHub-Repository:

1. Gewünschten Cloudflare-Account bestätigen. Ausschließlich für diesen Account einen passenden API-Token als `CLOUDFLARE_API_TOKEN` und die Account-ID als `CLOUDFLARE_ACCOUNT_ID` in GitHub Secrets hinterlegen.
2. Optional das GitHub-Environment `cloudflare-preview` mit den gewünschten Regeln anlegen.
3. Die Repository-Variable `CLOUDFLARE_DEPLOY_ENABLED` auf `true` setzen.
4. Workflow auf `main` starten. Der Deploy erfolgt auf `workers.dev`, ohne eigene Domain.

Keine Rubzuck-/Dobri-Mergeberechtigungen oder Zugangsdaten für Obersten übernehmen. Die bestehende Rubzuck-Website und deren Repository bleiben unberührt.

Quellen: [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/), [Cloudflare GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/), [Wrangler Action](https://github.com/cloudflare/wrangler-action).

Weitere Entscheidungen: [Konzept](docs/KONZEPT.md), [Veröffentlichung](docs/VEROEFFENTLICHUNG.md).
