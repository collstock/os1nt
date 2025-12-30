// simplify.js
// Handles toggling between nested and simplified OSINT views

document.addEventListener('DOMContentLoaded', () => {
  const simplifyBtn = document.getElementById('simplify-btn');
  if (!simplifyBtn) return;

  // Check if we're in simplified mode (stored in sessionStorage)
  const isSimplified = sessionStorage.getItem('osintSimplified') === 'true';
  
  const updateButtonText = (simplified) => {
    if (simplified) {   
      simplifyBtn.textContent = 'View All';
      simplifyBtn.setAttribute('title', 'Switch to full nested view');
    } else {
      simplifyBtn.textContent = 'Simplify';
      simplifyBtn.setAttribute('title', 'Simplify to 6 main categories');
    }
  };
  
  // Set initial state
  updateButtonText(isSimplified);

  simplifyBtn.addEventListener('click', () => {
    const currentlySimplified = sessionStorage.getItem('osintSimplified') === 'true';
    
    if (currentlySimplified) {
      // Switch back to normal
      sessionStorage.setItem('osintSimplified', 'false');
      updateButtonText(false);
      // Update the JSON_PATH in osint-cards.js
      window.OSINT_JSON_FILENAME = 'awesome-osint.json';
    } else {
      // Switch to simplified
      sessionStorage.setItem('osintSimplified', 'true');
      updateButtonText(true);
      // Update the JSON_PATH in osint-cards.js
      window.OSINT_JSON_FILENAME = 'osint.json';
    }

    // Reload the page to apply changes
    location.reload();
  });
});
