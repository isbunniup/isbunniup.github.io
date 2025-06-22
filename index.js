// --- Defensive DOM Manipulation Helpers ---
// These functions check if an element exists before trying to change it.
// This prevents the script from crashing if you delete an element from the HTML.

/**
 * Safely updates the text content of an element.
 * @param {string} id The ID of the element to update.
 * @param {string} text The text to set.
 */
const updateText = (id, text) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  } else {
    console.warn(`Element with ID "${id}" not found.`);
  }
};

/**
 * Safely updates a style property of an element.
 * @param {string} id The ID of the element.
 * @param {string} styleProperty The CSS property to change (e.g., 'display').
 * @param {string} value The value to set the property to.
 */
const updateStyle = (id, styleProperty, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.style[styleProperty] = value;
  }
};

/**
 * Safely adds or removes a class from an element.
 * @param {string} id The ID of the element.
 * @param {string} className The class to toggle.
 * @param {boolean} add True to add the class, false to remove it.
 */
const toggleClass = (id, className, add) => {
    const element = document.getElementById(id);
    if (element) {
        element.classList.toggle(className, add);
    }
};

/**
 * Safely sets the href attribute of a link.
 * @param {string} id The ID of the anchor element.
 * @param {string} url The URL to set.
 */
const setHref = (id, url) => {
    const element = document.getElementById(id);
    if (element) {
        element.href = url;
    }
};


// --- Main Application Logic ---

async function checkBunniStatus() {
  const statusTextId = 'status-text';
  const infoContainerId = 'bunni-info-container';
  const footerId = 'app-footer';
  const footerLineId = 'footer-dynamic-line';

  try {
    // IMPORTANT: Make sure this is your new, working Cloudflare Worker URL
    const response = await fetch('https://isbunniup-proxy.a91168823.workers.dev/api/status/exploits/Bunni.lol');

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();

    const isUp = data.updateStatus === true;

    // --- Update Main Status ---
    // This will work even if the footer or info sections are deleted.
    updateText(statusTextId, isUp ? 'Yes, Bunni is Up.' : 'No, Bunni is Down.');
    toggleClass(statusTextId, 'green', isUp);
    toggleClass(statusTextId, 'red', !isUp);
    document.documentElement.style.setProperty('--footer-dynamic-line-color', isUp ? '#4caf50' : '#f44336');

    // --- Populate Bunni Details Section ---
    // This entire block will be safely skipped if 'bunni-info-container' does not exist.
    const infoContainer = document.getElementById(infoContainerId);
    if (data && infoContainer) {
      infoContainer.style.display = 'block';

      // Update status label
      updateText('bunni-update-text', isUp ? 'Updated' : 'Not Updated');
      toggleClass('bunni-update-text', 'updated', isUp);
      toggleClass('bunni-update-text', 'not-updated', !isUp);
      
      // Update basic info
      updateText('bunni-version', data.version || 'N/A');
      updateText('bunni-last-updated', data.updatedDate || 'N/A');

      // Handle Free/Paid badges
      const isFree = data.free === true;
      updateStyle('bunni-free-badge', 'display', isFree ? 'inline-block' : 'none');
      updateStyle('bunni-paid-badge', 'display', isFree ? 'none' : 'inline-block');
      if (!isFree) {
        updateText('bunni-paid-badge', data.priceText || 'Paid');
      }

      // Show/hide detection warning
      updateStyle('bunni-detection-warning', 'display', data.detected === true ? 'block' : 'none');
      
      // --- Update Info Grid ---
      // Each of these will now fail silently without stopping the script.
      let uncValue = 'N/A';
      if (typeof data.uncPercentage === 'number') {
          uncValue = `${data.uncPercentage}%`;
      } else if (typeof data.uncStatus === 'boolean') {
          uncValue = data.uncStatus ? 'Yes' : 'No';
      }
      updateText('bunni-unc-percentage', uncValue);

      updateText('bunni-sunc-percentage', typeof data.suncPercentage === 'number' ? `${data.suncPercentage}%` : 'N/A');
      updateText('bunni-decompiler-status', typeof data.decompiler === 'boolean' ? (data.decompiler ? 'X' : 'No') : 'N/A');
      updateText('bunni-multi-inject-status', typeof data.multiInject === 'boolean' ? (data.multiInject ? 'X' : 'No') : 'N/A');
      
      // --- Update Action Buttons ---
      if (data.websitelink) {
          setHref('bunni-website-link', data.websitelink);
          updateStyle('bunni-website-link', 'display', 'inline-flex');
      } else {
          updateStyle('bunni-website-link', 'display', 'none');
      }
      
      // Always show discord link, but safely.
      setHref('bunni-discord-link', 'https://discord.gg/MUKkhVgjVu');
      updateStyle('bunni-discord-link', 'display', 'inline-flex');

    } else if (!infoContainer) {
        console.warn(`Info container with ID "${infoContainerId}" not found. Skipping details update.`);
    }

    // Show the footer if it exists
    updateStyle(footerId, 'display', 'block');

  } catch (error) {
    console.error('Error checking status:', error);
    updateText(statusTextId, 'Unable to check Bunni\'s status.');
    toggleClass(statusTextId, 'red', true);
    toggleClass(statusTextId, 'green', false);

    // Hide optional sections on error
    updateStyle(infoContainerId, 'display', 'none');
    updateStyle(footerId, 'display', 'block'); // Still show the footer on error
    document.documentElement.style.setProperty('--footer-dynamic-line-color', '#f44336');
  }
}

// Initial call to fetch status
checkBunniStatus();