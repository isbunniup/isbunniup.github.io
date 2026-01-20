// --- CONFIGURATION ---
// Use your Cloudflare Worker URL
const WORKER_BASE_URL = 'https://isbunniup-proxy.a91168823.workers.dev';

// --- Defensive DOM Manipulation Helpers ---
const updateText = (id, text) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  } else {
    console.warn(`Element with ID "${id}" not found.`);
  }
};

const updateStyle = (id, styleProperty, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.style[styleProperty] = value;
  }
};

const toggleClass = (id, className, add) => {
    const element = document.getElementById(id);
    if (element) {
        element.classList.toggle(className, add);
    }
};

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

  try {
    console.log("Fetching status from:", WORKER_BASE_URL);

    // Fetch both Bunni status and Roblox version data in parallel
    const [bunniResponse, robloxResponse] = await Promise.all([
      fetch(`${WORKER_BASE_URL}/bunni`),
      fetch(`${WORKER_BASE_URL}/roblox/windows`)
    ]);

    // --- Enhanced Error Handling ---
    if (!bunniResponse.ok) {
        // Try to read the error message from the worker
        const errJson = await bunniResponse.json().catch(() => ({ details: 'Unknown JSON error' }));
        console.error("Worker Error (Bunni):", errJson);
        throw new Error(`Bunni API fetch failed: ${bunniResponse.status} - ${errJson.details || bunniResponse.statusText}`);
    }

    if (!robloxResponse.ok) {
        const errJson = await robloxResponse.json().catch(() => ({ details: 'Unknown JSON error' }));
        console.error("Worker Error (Roblox):", errJson);
        throw new Error(`Roblox API fetch failed: ${robloxResponse.status} - ${errJson.details || robloxResponse.statusText}`);
    }

    const bunniData = await bunniResponse.json();
    const robloxData = await robloxResponse.json();

    console.log("Bunni data received:", bunniData);
    console.log("Roblox data received:", robloxData);

    // Check if we got an error object instead of data
    if (bunniData.error) {
        throw new Error(`Worker returned error: ${bunniData.details || bunniData.error}`);
    }

    const isUp = bunniData.updateStatus === true;

    // --- Update Main Status ---
    updateText(statusTextId, isUp ? 'Yes, Bunni is Up.' : 'No, Bunni is Down.');
    toggleClass(statusTextId, 'green', isUp);
    toggleClass(statusTextId, 'red', !isUp);
    document.documentElement.style.setProperty('--footer-dynamic-line-color', isUp ? '#4caf50' : '#f44336');

    // --- Populate Bunni Details Section ---
    const infoContainer = document.getElementById(infoContainerId);
    if (bunniData && infoContainer) {
      infoContainer.style.display = 'block';

      // Update status label
      updateText('bunni-update-text', isUp ? 'Updated' : 'Not Updated');
      toggleClass('bunni-update-text', 'updated', isUp);
      toggleClass('bunni-update-text', 'not-updated', !isUp);
      
      // Update basic info
      updateText('bunni-version', bunniData.version || 'N/A');
      updateText('bunni-last-updated', bunniData.updatedDate || 'N/A');

      // Handle Free/Paid badges
      const isFree = bunniData.free === true;
      updateStyle('bunni-free-badge', 'display', isFree ? 'inline-block' : 'none');
      updateStyle('bunni-paid-badge', 'display', isFree ? 'none' : 'inline-block');
      if (!isFree) {
        updateText('bunni-paid-badge', bunniData.cost || bunniData.priceText || 'Paid');
      }

      // Show/hide detection warning
      updateStyle('bunni-detection-warning', 'display', bunniData.detected === true ? 'block' : 'none');
      
      // --- Update Info Grid ---
      let uncValue = 'N/A';
      if (typeof bunniData.uncPercentage === 'number') {
          uncValue = `${bunniData.uncPercentage}%`;
      } else if (typeof bunniData.uncStatus === 'boolean') {
          uncValue = bunniData.uncStatus ? 'Yes' : 'No';
      }
      updateText('bunni-unc-percentage', uncValue);

      updateText('bunni-sunc-percentage', typeof bunniData.suncPercentage === 'number' ? `${bunniData.suncPercentage}%` : 'N/A');
      updateText('bunni-decompiler-status', typeof bunniData.decompiler === 'boolean' ? (bunniData.decompiler ? '✅' : 'No') : 'N/A');
      updateText('bunni-multi-inject-status', typeof bunniData.multiInject === 'boolean' ? (bunniData.multiInject ? '✅' : 'No') : 'N/A');
      
      // --- Update Roblox Info in the Grid ---
      updateText('roblox-version', robloxData.Windows || robloxData.windows || 'N/A');
      updateText('roblox-updated-date', robloxData.WindowsDate || robloxData.windowsDate || 'N/A');

      // --- Update Action Buttons ---
      if (bunniData.websitelink) {
          setHref('bunni-website-link', bunniData.websitelink);
          updateStyle('bunni-website-link', 'display', 'inline-flex');
      } else {
          updateStyle('bunni-website-link', 'display', 'none');
      }
      
      if (bunniData.discordlink) {
          setHref('bunni-discord-link', bunniData.discordlink);
          updateStyle('bunni-discord-link', 'display', 'inline-flex');
      } else {
          setHref('bunni-discord-link', 'https://discord.gg/MUKkhVgjVu');
          updateStyle('bunni-discord-link', 'display', 'inline-flex');
      }

    } else if (!infoContainer) {
        console.warn(`Info container with ID "${infoContainerId}" not found. Skipping details update.`);
    }

    // Show the footer
    updateStyle(footerId, 'display', 'block');

  } catch (error) {
    console.error('Error checking status:', error);
    updateText(statusTextId, 'Unable to check status.');
    toggleClass(statusTextId, 'red', true);

    // Hide optional sections and update error states
    updateStyle(infoContainerId, 'display', 'none');
    updateStyle(footerId, 'display', 'block'); // Still show the footer
    document.documentElement.style.setProperty('--footer-dynamic-line-color', '#f44336');
    // Also explicitly set the new fields to an error state
    updateText('roblox-version', 'Error');
    updateText('roblox-updated-date', 'Error');
  }
}

// ** This line is crucial! It must be present at the end of the file. **
checkBunniStatus();