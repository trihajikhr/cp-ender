window.addEventListener("md-consent-accepted", function() {
    // Load GA only after consent
    var s = document.createElement("script");
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
});