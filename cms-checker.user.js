// ==UserScript==
// @name         CMS Checker Overlay
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Wykrywa popularne CMS-y i pokazuje w lewym dolnym rogu
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Lepsza lista detektorów CMS-ów z bardziej szczegółowymi testami
    const detectors = [
        { 
            name: "WordPress", 
            test: () => !!document.querySelector('meta[name="generator"][content*="WordPress"], meta[name="generator"][content*="Wordpress"]') || 
                   /\/wp-(content|includes|admin|json)\//i.test(document.documentElement.innerHTML) ||
                   window.wp || window.WordPress
        },
        { 
            name: "Joomla", 
            test: () => !!document.querySelector('meta[name="generator"][content*="Joomla"]') ||
                   /\/media\/joomla\//i.test(document.documentElement.innerHTML) ||
                   window.Joomla
        },
        { 
            name: "Drupal", 
            test: () => !!document.querySelector('meta[name="generator"][content*="Drupal"]') || 
                   /\/sites\/(default|all)\//i.test(document.documentElement.innerHTML) ||
                   window.Drupal
        },
        { 
            name: "Shopify", 
            test: () => /cdn\.shopify\.com/.test(document.documentElement.innerHTML) || 
                   !!document.querySelector('meta[name="shopify-digital-wallet"], link[href*="shopify.com"]') ||
                   window.Shopify
        },
        { 
            name: "Wix", 
            test: () => /static\.wixstatic\.com|wix-code|wix\.com|wix-wq-\d/.test(document.documentElement.innerHTML) ||
                   window.wixBiSession
        },
        { 
            name: "Ghost", 
            test: () => /\/ghost\//.test(document.documentElement.innerHTML) ||
                   !!document.querySelector('link[href*="ghost.org"], link[href*="ghost.io"]') ||
                   window.Ghost
        },
        { 
            name: "Typo3", 
            test: () => !!document.querySelector('meta[name="generator"][content*="TYPO3"]') ||
                   /\/typo3\//i.test(document.documentElement.innerHTML)
        },
        { 
            name: "Blogger", 
            test: () => !!document.querySelector('meta[content*=".blogspot.com"], meta[name="generator"][content*="Blogger"]') || 
                   /blogger|blogspot/.test(document.documentElement.innerHTML) ||
                   window.Blogger
        },
        { 
            name: "PrestaShop", 
            test: () => !!document.querySelector('meta[name="generator"][content*="PrestaShop"]') ||
                   /\/themes\/.*prestashop\//i.test(document.documentElement.innerHTML) ||
                   window.prestashop
        },
        {
            name: "Magento",
            test: () => !!document.querySelector('meta[name="generator"][content*="Magento"]') ||
                   /\/static\/version\d+\//.test(document.documentElement.innerHTML) ||
                   window.Mage
        }
    ];

    // Funkcja sprawdzająca czy element jest widoczny
    function isElementVisible(el) {
        return el && el.offsetParent !== null;
    }

    // Sprawdzanie konkretnych elementów dla większej dokładności
    const additionalChecks = {
        "WordPress": () => isElementVisible(document.querySelector('#wpadminbar')),
        "Joomla": () => isElementVisible(document.querySelector('.joomla-script-options')),
        "Drupal": () => isElementVisible(document.querySelector('body[class*="drupal"]')),
        "Shopify": () => !!document.querySelector('div[data-shopify]'),
        "Wix": () => !!document.querySelector('wix-image, wix-iframe')
    };

    let detected = [];
    for (let cms of detectors) {
        try {
            if (cms.test() || (additionalChecks[cms.name] && additionalChecks[cms.name]())) {
                detected.push(cms.name);
            }
        } catch (e) {
            console.error(`Error checking for ${cms.name}:`, e);
        }
    }

    // Usuń duplikaty
    detected = [...new Set(detected)];

    const result = detected.length ? `🧠 CMS: ${detected.join(", ")}` : "🧠 CMS: Nie wykryto";

    // Stylowanie overlay
    const overlay = document.createElement("div");
    overlay.textContent = result;
    overlay.style.position = "fixed";
    overlay.style.bottom = "5px";
    overlay.style.left = "5px";
    overlay.style.background = "#000000cc";
    overlay.style.color = "#fff";
    overlay.style.padding = "6px 10px";
    overlay.style.fontSize = "14px";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.borderRadius = "5px";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    overlay.style.backdropFilter = "blur(2px)";
    overlay.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
    overlay.style.maxWidth = "80%";
    overlay.style.whiteSpace = "nowrap";
    overlay.style.overflow = "hidden";
    overlay.style.textOverflow = "ellipsis";
    overlay.style.opacity = "0.5";

    document.body.appendChild(overlay);
})();
