// ==UserScript==
// @name         CMS Checker Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wykrywa popularne CMS-y i pokazuje w lewym dolnym rogu
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const detectors = [
        { name: "WordPress", test: () => !!document.querySelector('meta[name="generator"][content*="WordPress"]') || /\/wp-content\//i.test(document.documentElement.innerHTML) },
        { name: "Joomla", test: () => !!document.querySelector('meta[name="generator"][content*="Joomla"]') },
        { name: "Drupal", test: () => !!document.querySelector('meta[name="generator"][content*="Drupal"]') || /\/sites\/default\//i.test(document.documentElement.innerHTML) },
        { name: "Shopify", test: () => /cdn\.shopify\.com/.test(document.documentElement.innerHTML) || !!document.querySelector('meta[name="shopify-digital-wallet"]') },
        { name: "Wix", test: () => /wix-code|wix\.com/.test(document.documentElement.innerHTML) },
        { name: "Ghost", test: () => /\/ghost\//.test(document.documentElement.innerHTML) },
        { name: "Typo3", test: () => !!document.querySelector('meta[name="generator"][content*="TYPO3"]') },
        { name: "Blogger", test: () => !!document.querySelector('meta[content*=".blogspot.com"]') || /blogger/.test(document.documentElement.innerHTML) },
        { name: "PrestaShop", test: () => !!document.querySelector('meta[name="generator"][content*="PrestaShop"]') }
    ];

    let detected = [];
    for (let cms of detectors) {
        if (cms.test()) detected.push(cms.name);
    }

    const result = detected.length ? detected.join(", ") : "CMS: Nie wykryto";

    const style = document.createElement("div");
    style.textContent = "🧠 " + result;
    style.style.position = "fixed";
    style.style.bottom = "5px";
    style.style.left = "5px";
    style.style.background = "#000000cc";
    style.style.color = "#fff";
    style.style.padding = "6px 10px";
    style.style.fontSize = "14px";
    style.style.fontFamily = "monospace";
    style.style.borderRadius = "5px";
    style.style.zIndex = "9999";
    style.style.pointerEvents = "none";

    document.body.appendChild(style);
})();
