// simplify.js
// Handles toggling between nested, simplified, and LEA OSINT views

document.addEventListener('DOMContentLoaded', () => {
  const simplifyBtn = document.getElementById('simplify-btn');
  const leasBtn = document.getElementById('leas-btn');
  if (!simplifyBtn || !leasBtn) return;

  // Check current view mode (stored in sessionStorage)
  const isSimplified = sessionStorage.getItem('osintSimplified') === 'true';
  const isLeas = sessionStorage.getItem('osintLeas') === 'true';
  
  const updateButtonStates = (simplified, leas) => {
    if (leas) {
      // LEAs mode
      simplifyBtn.textContent = 'View All';
      simplifyBtn.setAttribute('title', 'Switch to full nested view');
      leasBtn.style.display = 'none';
    } else if (simplified) {   
      // Simplified mode
      simplifyBtn.textContent = 'View All';
      simplifyBtn.setAttribute('title', 'Switch to full nested view');
      leasBtn.style.display = '';
    } else {
      // Normal mode
      simplifyBtn.textContent = 'Simplify';
      simplifyBtn.setAttribute('title', 'Simplify to main categories');
      leasBtn.style.display = '';
    }
  };
  
  // Set initial state
  updateButtonStates(isSimplified, isLeas);

  simplifyBtn.addEventListener('click', () => {
    const currentlySimplified = sessionStorage.getItem('osintSimplified') === 'true';
    const currentlyLeas = sessionStorage.getItem('osintLeas') === 'true';
    
    if (currentlyLeas) {
      // From LEAs back to normal
      sessionStorage.setItem('osintLeas', 'false');
      sessionStorage.setItem('osintSimplified', 'false');
      updateButtonStates(false, false);
    } else if (currentlySimplified) {
      // From simplified back to normal
      sessionStorage.setItem('osintSimplified', 'false');
      updateButtonStates(false, false);
    } else {
      // From normal to simplified
      sessionStorage.setItem('osintSimplified', 'true');
      updateButtonStates(true, false);
    }

    // Reload the page to apply changes
    location.reload();
  });

  leasBtn.addEventListener('click', () => {
    // Switch to LEAs mode
    sessionStorage.setItem('osintLeas', 'true');
    sessionStorage.setItem('osintSimplified', 'false');
    updateButtonStates(false, true);
    // Reload the page to apply changes
    location.reload();
  });
});
