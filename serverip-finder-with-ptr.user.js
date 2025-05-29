// ==UserScript==
// @name         Server IP Finder with PTR (Dark Mode)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Pokazuje IP serwera i PTR domeny aktualnej strony (z DNS Google) w ciemnym motywie
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const hostname = window.location.hostname;
    const storageKey = 'serverIpFinderPosition';

    let pos = { left: 80, top: 80 };
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
                pos = parsed;
            }
        }
    } catch {}

    function ipToPtr(ip) {
        return ip.split('.').reverse().join('.') + '.in-addr.arpa';
    }

    function fetchPtr(ip) {
        const ptrName = ipToPtr(ip);
        return fetch(`https://dns.google/resolve?name=${ptrName}&type=PTR`)
            .then(res => res.json())
            .then(data => {
                if (data.Answer && data.Answer.length > 0) {
                    const ptrs = data.Answer
                        .filter(a => a.type === 12)
                        .map(a => a.data);
                    return ptrs.join(', ');
                }
                return 'brak PTR';
            })
            .catch(() => 'błąd PTR');
    }

    fetch(`https://dns.google/resolve?name=${hostname}&type=A`)
        .then(res => res.json())
        .then(async data => {
            let ips = [];
            if (data.Answer) {
                ips = data.Answer.filter(a => a.type === 1).map(a => a.data);
            }
            if (ips.length === 0) ips = ['Brak rekordu A'];

            let ipWithPtrList = [];
            if (ips[0] !== 'Brak rekordu A') {
                ipWithPtrList = await Promise.all(
                    ips.map(async ip => {
                        const ptr = await fetchPtr(ip);
                        return `🌐 IP: ${ip} (${ptr})`;
                    })
                );
            } else {
                ipWithPtrList = ips;
            }

            showBar(ipWithPtrList);
        })
        .catch(() => {
            console.warn('Nie udało się pobrać IP serwera.');
            showBar(['Brak danych']);
        });

    function showBar(lines) {
        const bar = document.createElement('div');
        bar.textContent = lines.join(' | ');
        Object.assign(bar.style, {
            position: 'fixed',
            top: pos.top + 'px',
            left: pos.left + 'px',
            backgroundColor: '#1e1e1e',
            color: '#eee',
            padding: '6px 10px',
            fontFamily: 'monospace',
            fontSize: '11px',
            border: '1.5px solid #444',
            borderRadius: '6px',
            cursor: 'move',
            zIndex: '99999',
            userSelect: 'none',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.15)',
            maxWidth: '280px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        });
        document.body.appendChild(bar);

        let isDragging = false;
        let offsetX, offsetY;

        bar.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - bar.offsetLeft;
            offsetY = e.clientY - bar.offsetTop;
            bar.style.opacity = '0.8';
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                const maxLeft = window.innerWidth - bar.offsetWidth;
                const maxTop = window.innerHeight - bar.offsetHeight;

                if (newLeft < 0) newLeft = 0;
                else if (newLeft > maxLeft) newLeft = maxLeft;

                if (newTop < 0) newTop = 0;
                else if (newTop > maxTop) newTop = maxTop;

                bar.style.left = newLeft + 'px';
                bar.style.top = newTop + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                bar.style.opacity = '1';

                localStorage.setItem(storageKey, JSON.stringify({
                    left: bar.offsetLeft,
                    top: bar.offsetTop
                }));
            }
        });
    }

})();
