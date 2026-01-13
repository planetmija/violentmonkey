// ==UserScript==
// @name         Instagram Picuki Redirector
// @namespace    https://github.com/planetmija/violentmonkey
// @version      2026.1
// @description  Leitet Instagram-Profile automatisch zu Picuki um (ohne Login-Zwang)
// @author       Copilot
// @match        https://www.instagram.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/planetmija/violentmonkey/main/instagram_picuki.user.js
// @downloadURL  https://raw.githubusercontent.com/planetmija/violentmonkey/main/instagram_picuki.user.js
// @homepageURL  https://github.com/planetmija/violentmonkey
// @source       https://github.com/planetmija/violentmonkey/blob/main/instagram_picuki.user.js
// @supportURL   https://github.com/planetmija/violentmonkey/issues
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    const originalUrl = window.location.href;
    if (originalUrl.match(/^https:\/\/www\.instagram\.com\/[A-Za-z0-9_.]+\/?$/)) {
        const match = originalUrl.match(/^https:\/\/www\.instagram\.com\/([A-Za-z0-9_.]+)\/?$/);
        if (match && match[1]) {
            const picukiUrl = `https://picuki.site/?profile=${match[1]}`;
            window.location.replace(picukiUrl);
        }
    }
})();
