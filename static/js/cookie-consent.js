document.addEventListener('DOMContentLoaded', function () {
    const cookieConsentKey = 'happyTrailsCookieConsent';
    const consentValue = localStorage.getItem(cookieConsentKey);

    console.log('Cookie Consent Script Loaded');
    console.log('Current Consent Value:', consentValue);

    if (!consentValue) {
        console.log('Showing Cookie Popup');
        showCookiePopup();
    } else {
        console.log('Cookie Popup suppressed because consent exists');
    }

    function showCookiePopup() {
        // Create popup element
        const popup = document.createElement('div');
        popup.id = 'cookie-consent-popup';
        popup.innerHTML = `
            <div class="cookie-content">
                <p class="cookie-text">
                    <i class="fas fa-cookie-bite"></i>
                    We use cookies to ensure you get the sweetest experience on our website. 
                    <span class="d-none d-md-inline">Continuing to browse means you're okay with that! 🍪</span>
                </p>
                <div class="cookie-buttons">
                    <button id="btn-reject-cookies" class="btn-cookie-reject">No thanks</button>
                    <button id="btn-accept-cookies" class="btn-cookie-accept">Sweet!</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Trigger animation after a small delay
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);

        // Add event listeners
        document.getElementById('btn-accept-cookies').addEventListener('click', function () {
            localStorage.setItem(cookieConsentKey, 'accepted');
            hideCookiePopup(popup);
        });

        document.getElementById('btn-reject-cookies').addEventListener('click', function () {
            localStorage.setItem(cookieConsentKey, 'rejected');
            hideCookiePopup(popup);
        });
    }

    function hideCookiePopup(popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 500); // Wait for transition to finish
    }
});
