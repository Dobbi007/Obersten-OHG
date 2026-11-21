# Veröffentlichungsstand

Die erste Fassung ist als private Konzeptvorschau gedacht. Die verwaltete Sites-Veröffentlichung läuft auf Cloudflare-Infrastruktur; sie ist nicht automatisch ein Worker im eigenen Dobra-/Obersten-Account.

Für den eigenständigen Cloudflare-Worker sind `wrangler.jsonc` und ein GitHub-Actions-Workflow vorbereitet. Ohne ausdrücklich für Obersten eingerichtete Cloudflare-Secrets bleibt dieser Workflow aus. Es wird keine bestehende Produktionsdomain angebunden.

Vor einer öffentlichen Firmenwebsite fehlen noch:

- Geschäftliche Kontakt-E-Mail und gewünschte Domain.
- Bestätigte vollständige Unternehmens- und Registerangaben für das Impressum.
- Auf den tatsächlichen Betrieb abgestimmte Datenschutzinformationen.
- Gewählte Gestaltungsrichtung.
- Cloudflare-Account-Anbindung. GitHub-Ziel: `Dobbi007/Obersten-OHG` (öffentlich).

Danach: Kontaktweg ergänzen, Rechtsangaben fertigstellen, öffentlichen Zugriff bewusst einrichten und `noindex`/`robots.txt` passend zum Launch ändern. Eine Domain wird separat und nur nach ausdrücklicher Freigabe verbunden.
