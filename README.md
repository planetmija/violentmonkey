# Paywall Redirector & Instagram Picuki

Ein Violentmonkey/Tampermonkey Userscript, das automatisch Paywall-Artikel deutscher Nachrichtenseiten zu Archive.is umleitet und Instagram-Profile zu Picuki weiterleitet.

## Features

### 🔓 Intelligente Paywall-Umleitung
Das Script erkennt Paywall-Artikel auf folgenden deutschen Nachrichtenseiten und leitet automatisch zu einer archivierten Version weiter:

- **Spiegel.de** - Erkennt SPIEGEL+ Artikel via DOM-Selektoren
- **Süddeutsche Zeitung** - Erkennt SZ Plus Artikel und Abo-Angebote
- **Heise.de** - Erkennt heise+ Premium-Artikel
- **Golem.de** - Erkennt Golem Plus/pur Artikel
- **Zeit.de** - Erkennt Z+ und ZEIT+ Artikel
- **Badische Zeitung** - Erkennt BZ-Plus und BZ-Digital Artikel

#### Erkennungsmethodik
- **Sichtbarkeitscheck**: Nur aktive, sichtbare Paywalls werden erkannt
- **DOM-basiert**: Prüft auf spezifische CSS-Selektoren und Paywall-Container
- **Textmuster**: Erkennt typische Paywall-Phrasen wie "SPIEGEL+", "SZ Plus", "heise+"
- **Adaptive Delays**: Domain-spezifische Wartezeiten (z.B. 3s für SZ) für langsam ladende Paywalls
- **Retry-Mechanismus**: Prüft bis zu 3x mit Verzögerung für dynamisch geladene Inhalte
- **False-Positive-Schutz**: Homepage und leere Paywall-Container werden ignoriert

### 📸 Instagram zu Picuki
Leitet Instagram-Profile automatisch zu Picuki um, einem alternativen Viewer ohne Login-Zwang.

### ⚙️ Technische Features
- **URL-Bereinigung**: Query-Parameter (`?reduced=true`) werden vor der Weiterleitung entfernt
- **Homepage-Schutz**: Startseiten und `/index` werden nicht weitergeleitet
- **Optimierte Performance**: Startet früh (`document-start`) für schnelle Erkennung
- **Kein Tracking**: Verwendet keine externen Services außer Archive.is

## Installation

1. Installiere eine Userscript-Erweiterung:
   - [Violentmonkey](https://violentmonkey.github.io/) (empfohlen, Open Source)
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)

2. Klicke auf [paywall_redirector_instagram_picuki.user.js](paywall_redirector_instagram_picuki.user.js) und installiere das Script

3. Das Script wird automatisch auf den unterstützten Websites aktiv

## Verwendung

Keine Konfiguration nötig. Das Script läuft vollautomatisch:

- **Paywall-Artikel** → Automatische Weiterleitung zu `https://archive.is/2026/[artikel-url]`
- **Instagram-Profil** → Automatische Weiterleitung zu `https://picuki.site/?profile=[username]`

### Beispiele
```
https://www.spiegel.de/artikel → https://archive.is/2026/https://www.spiegel.de/artikel
https://www.instagram.com/user → https://picuki.site/?profile=user
```

## Technische Details

- **Version**: 2026.1.1
- **Unterstützte Domains**: 7 Nachrichtenseiten + Instagram
- **Paywall-Erkennung**: 
  - DOM-basierte Sichtbarkeitsprüfung
  - Adaptive Delays (SZ: 3s, andere: sofort)
  - Mehrfache Retry-Versuche (2x mit 1,5s Delay)
  - Spezifische CSS-Selektoren pro Domain
- **Archiv**: Nutzt Archive.is mit aktueller Jahreszahl im Pfad

### Code-Struktur
```javascript
hasPaywallIndicator()   // Prüft DOM-Elemente und Text-Patterns
redirectToArchive()     // Leitet zu bereinigter Archive.is-URL weiter
isDomain()              // Domain-Check mit Homepage-Ausschluss
checkPaywall()          // Hauptlogik mit Retry-Mechanismus
```

## Häufige Fragen

**Q: Warum wird ein kostenloser Artikel weitergeleitet?**  
A: Das Script prüft auf sichtbare Paywall-Elemente. Melde den Artikel als Issue, damit die Erkennung verbessert werden kann.

**Q: Kann ich weitere Nachrichtenseiten hinzufügen?**  
A: Ja, ergänze in `paywallConfig` einen neuen Eintrag mit Domain, CSS-Selektoren und Text-Patterns.

**Q: Archive.is lädt sehr langsam**  
A: Archive.is muss die Seite erst archivieren. Das kann 10-30 Sekunden dauern.

**Q: Funktioniert das Script mit allen Browsern?**  
A: Ja, mit Chrome, Firefox, Edge, Safari (mit entsprechender Userscript-Extension).

## Lizenz

Siehe [LICENSE](LICENSE)

## Beiträge & Issues

Verbesserungsvorschläge und Bug-Reports sind willkommen! Erstelle ein [Issue](../../issues) auf GitHub.

## Hinweise

- Das Script respektiert `robots.txt` und nutzt die öffentliche Archive.is-API
- Archive.is kann bei manchen Artikeln längere Ladezeiten haben
- Die Paywall-Erkennung basiert auf typischen DOM-Strukturen und kann bei Design-Änderungen angepasst werden müssen
- Normale Artikel ohne Paywall werden NICHT weitergeleitet

## Changelog

### v2026.1.1 (2026-01-12)
- ✨ Sichtbarkeitscheck für DOM-Elemente (verhindert False Positives)
- ✨ URL-Bereinigung: Query-Parameter werden entfernt
- ✨ Homepage-Schutz: `/index` wird nicht weitergeleitet
- ✨ Erweiterte Kommentierung und JSDoc
- ✨ Adaptive Delays: Süddeutsche.de bekommt 3s Wartezeit (Paywall lädt langsam)
- 🐛 Fix: Süddeutsche.de kostenlose Artikel werden nicht mehr weitergeleitet
- 🐛 Fix: Golem.de Homepage wird nicht mehr weitergeleitet
- 🐛 Fix: SZ-Paywall wurde nicht erkannt (Selektor `#sz-paywall` ergänzt)
- ⚡ Retry-Delay auf 1500ms erhöht für bessere Erkennung

### v2026.1 (2026-01-12)
- 🎉 Initiale Version
- ✅ 6 deutsche Nachrichtenseiten + Instagram
- ✅ DOM-basierte Paywall-Erkennung
- ✅ Retry-Mechanismus für dynamische Inhalte
