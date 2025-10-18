declare global { interface Window { dataLayer?: any[]; gtag?: (...args:any[]) => void; } }

export function initGA() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || window.gtag) return;

  // gtag loader
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer!.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });

  // simple pageview on route changes
  const send = () => window.gtag?.("event", "page_view", { page_location: location.href, page_title: document.title });
  // fire once after load + when you call manually from router
  setTimeout(send, 100);
  return send; // return a function to call on navigation
}
