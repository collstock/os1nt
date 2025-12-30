// simplify.js
// Handles toggling between nested and simplified OSINT views

document.addEventListener('DOMContentLoaded', () => {
  const simplifyBtn = document.getElementById('simplify-btn');
  if (!simplifyBtn) return;

  // Check if we're in simplified mode (stored in sessionStorage)
  const isSimplified = sessionStorage.getItem('osintSimplified') === 'true';
  
  if (isSimplified) {
    simplifyBtn.textContent = 'Normal View';
    simplifyBtn.setAttribute('title', 'Switch to normal nested view');
  }

  simplifyBtn.addEventListener('click', () => {
    const currentlySimplified = sessionStorage.getItem('osintSimplified') === 'true';
    
    if (currentlySimplified) {
      // Switch back to normal
      sessionStorage.setItem('osintSimplified', 'false');
      simplifyBtn.textContent = 'Simplify';
      simplifyBtn.setAttribute('title', 'Simplify view');
      // Update the JSON_PATH in osint-cards.js
      window.OSINT_JSON_FILENAME = 'awesome-osint.json';
    } else {
      // Switch to simplified
      sessionStorage.setItem('osintSimplified', 'true');
      simplifyBtn.textContent = 'Normal View';
      simplifyBtn.setAttribute('title', 'Switch to normal nested view');
      // Update the JSON_PATH in osint-cards.js
      window.OSINT_JSON_FILENAME = 'osint.json';
    }

    // Reload the page to apply changes
    location.reload();
  });
});
