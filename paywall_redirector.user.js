// ==UserScript==

// ==UserScript==
// @name         Paywall Redirector
// @namespace    https://github.com/planetmija/violentmonkey
// @version      2026.2
// @description  Leitet Paywall-Artikel deutscher Nachrichtenseiten automatisch zu archive.is um
// @author       Copilot
// @match        https://www.spiegel.de/*
// @match        https://www.badische-zeitung.de/*
// @match        https://www.sueddeutsche.de/*
// @match        https://www.heise.de/*
// @match        https://www.golem.de/*
// @match        https://www.zeit.de/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/planetmija/violentmonkey/main/paywall_redirector.user.js
// @downloadURL  https://raw.githubusercontent.com/planetmija/violentmonkey/main/paywall_redirector.user.js
// @homepageURL  https://github.com/planetmija/violentmonkey
// @source       https://github.com/planetmija/violentmonkey/blob/main/paywall_redirector.user.js
// @supportURL   https://github.com/planetmija/violentmonkey/issues
// @run-at       document-start
// ==/UserScript==

/**
 * Paywall Redirector
 *
 * Automatische Weiterleitung von Paywall-Artikeln deutscher Nachrichtenseiten
 * zu Archive.is.
 *
 * Features:
 * - Intelligente Paywall-Erkennung via DOM-Selektoren und Textmuster
 * - Sichtbarkeitscheck: Nur aktive Paywalls werden erkannt
 * - Retry-Mechanismus für dynamisch geladene Inhalte
 * - URL-Bereinigung: Query-Parameter werden entfernt
 * - Homepage-Schutz: Startseiten werden nicht weitergeleitet
 */

(function () {
    'use strict';

    // Konstanten
    const currentYear = new Date().getFullYear();
    const originalUrl = window.location.href;
    const cleanUrl = originalUrl.split('?')[0].split('#')[0];

    /**
     * Prüft, ob ein DOM-Element eine sichtbare Paywall darstellt
     * @param {string} selectors - Komma-getrennte CSS-Selektoren
     * @param {string[]} textIndicators - Array von Text-Patterns
     * @returns {boolean} True, wenn Paywall gefunden wurde
     */
    function hasPaywallIndicator(selectors, textIndicators) {
        // Prüfe CSS-Selektoren auf sichtbare Elemente
        if (selectors) {
            const selectorList = selectors.split(',').map(s => s.trim());
            for (const selector of selectorList) {
                try {
                    const element = document.querySelector(selector);
                    if (element) {
                        // Sichtbarkeitscheck: display, visibility, Höhe
                        const style = window.getComputedStyle(element);
                        if (style.display !== 'none' && 
                            style.visibility !== 'hidden' && 
                            element.offsetHeight > 0) {
                            return true;
                        }
                    }
                } catch (e) {
                    // Ungültiger Selektor wird ignoriert
                }
            }
        }
        
        // Prüfe Text-Indikatoren im Body
        if (textIndicators && document.body) {
            const bodyText = document.body.innerText || document.body.textContent || '';
            return textIndicators.some(text => bodyText.includes(text));
        }
        
        return false;
    }

    /**
     * Leitet zur Archive.is-Version des Artikels weiter (ohne Query-Parameter)
     */
    function redirectToArchive() {
        const archiveUrl = `https://archive.is/${currentYear}/${cleanUrl}`;
        window.location.replace(archiveUrl);
    }

    /**
     * Prüft, ob URL zur angegebenen Domain gehört (exkl. Homepage)
     * @param {string} domain - Domain ohne https://www.
     * @returns {boolean} True, wenn es ein Artikel auf dieser Domain ist
     */
    function isDomain(domain) {
        const domainUrl = `https://www.${domain}`;
        // Ausschluss: Homepage, /index
        if (cleanUrl === domainUrl || 
            cleanUrl === `${domainUrl}/` ||
            cleanUrl === `${domainUrl}/index` ||
            cleanUrl.startsWith(`${domainUrl}/index?`)) {
            return false;
        }
        return cleanUrl.startsWith(`${domainUrl}/`);
    }

    /**
     * Prüft DOM auf Paywall-Indikatoren und leitet bei Fund weiter
     * @param {number} retries - Anzahl verbleibender Wiederholungsversuche
     */
    function checkPaywall(retries = 2) {
        // Konfiguration: Paywall-Erkennungsmuster pro Domain
        const paywallConfig = [
            {
                domain: 'spiegel.de',
                selectors: '[data-sara-paywall], [data-paywall], .sp-paywall',
                texts: ['Weiterlesen mit SPIEGEL+', 'Jetzt SPIEGEL+ lesen', 'SPIEGEL+']
            },
            {
                domain: 'sueddeutsche.de',
                selectors: '.offerpage-container, #sz-paywall iframe, #sz-paywall',
                texts: ['Angebot auswählen', 'Abonnieren Sie die SZ'],
                initialDelay: 3000  // Paywall lädt erst nach 5 Sekunden
            },
            {
                domain: 'heise.de',
                selectors: '.upscore-paywall-placeholder, .js-upscore-article-content-for-paywall, .paywall-delimiter',
                texts: ['heise+', 'geschützte Inhalte']
            },
            {
                domain: 'golem.de',
                selectors: '.go-paywall, section.go-paywall',
                texts: ['Golem Plus Artikel', 'ohne Werbung', 'Golem pur']
            },
            {
                domain: 'zeit.de',
                selectors: '[data-zplus], .gate, .paywall',
                texts: ['Weiterlesen mit Z+', 'Z+', 'Jetzt abonnieren']
            },
            {
                domain: 'badische-zeitung.de',
                selectors: '#articleWall, article#articleWall, .freemium',
                texts: ['BZ-Digital Basis', 'BZ-Abo', 'exklusiv im Abo']
            }
        ];

        let found = false;
        for (const config of paywallConfig) {
            if (isDomain(config.domain)) {
                // Spezial-Delay für bestimmte Domains (z.B. SZ Paywall lädt langsam)
                if (config.initialDelay && retries === 2) {
                    setTimeout(() => checkPaywall(1), config.initialDelay);
                    return;
                }
                
                if (hasPaywallIndicator(config.selectors, config.texts)) {
                    redirectToArchive();
                    found = true;
                    break;
                }
            }
        }
        
        // Retry-Mechanismus für dynamisch geladene Inhalte
        if (!found && retries > 0) {
            setTimeout(() => checkPaywall(retries - 1), 1500);
        }
    }


    // Starte Paywall-Checks nach DOM-Laden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => checkPaywall(2));
    } else {
        // DOM bereits geladen: Starte mit kurzem Delay
        setTimeout(() => checkPaywall(2), 500);
    }
})();
