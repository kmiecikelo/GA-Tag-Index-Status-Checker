# Tampermonkey-Skrypty-WebAdmin

Zestaw przydatnych skryptów Tampermonkey do codziennej pracy administratora stron internetowych. Skrypty automatyzują i ułatwiają zadania związane z analizą SEO, identyfikacją tagów Google Analytics, sprawdzaniem CMS oraz rozpoznawaniem adresów IP serwerów.

## 📦 Zawartość repozytorium

### `cms-checker.user.js`
Sprawdza, jaki CMS (WordPress, Joomla, itp.) został użyty na odwiedzanej stronie. Działa automatycznie po wejściu na stronę.

### `ga-tag-index-status-checker.user.js`
Sprawdza obecność tagów Google Analytics oraz status indeksowania w Google Search Console (na podstawie tagów i metadanych). Działa tylko na aktualnie otwartej stronie.

### `ga-tag-index-status-checker-allpages.user.js`
Rozszerzona wersja poprzedniego skryptu – działa na wszystkich otwartych kartach / wielu stronach równocześnie. Idealna do masowej analizy.

### `serverip-finder-with-ptr.user.js`
Wyświetla publiczny adres IP serwera danej strony oraz rekord PTR (jeśli dostępny), co ułatwia analizę DNS i lokalizacji serwera.

---

## ✅ Wymagania

- [Tampermonkey](https://www.tampermonkey.net/) (rozszerzenie dla Chrome, Firefox, Edge itd.)

## 🔧 Instalacja

1. Zainstaluj rozszerzenie **Tampermonkey** w przeglądarce.
2. Kliknij na link do wybranego skryptu w repozytorium.
3. Tampermonkey automatycznie zaproponuje instalację.
4. Zatwierdź i gotowe!

## 🧪 Testowanie

Otwórz dowolną stronę internetową. W zależności od włączonych skryptów, informacje pojawią się w konsoli deweloperskiej (`F12`) lub jako powiadomienia na stronie.

## 📄 Licencja

MIT – możesz korzystać, modyfikować i udostępniać bez ograniczeń.

---

## ✍️ Autor

Skrypty stworzone z myślą o szybkim audycie i analizie technicznej stron internetowych przez administratorów i web developerów.
