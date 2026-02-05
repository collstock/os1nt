document.addEventListener('DOMContentLoaded', () => {
  const contactBtn = document.getElementById('contact-btn');
  if (!contactBtn) return;
  // split address components to reduce scraping in static HTML
  const user = 'info';
  const domain = 'os1nt.com';
  contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Contact from OS1NT site');
    const body = encodeURIComponent('');
    window.location.href = `mailto:${user}@${domain}?subject=${subject}&body=${body}`;
  });
});
