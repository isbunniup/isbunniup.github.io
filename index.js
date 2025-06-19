const statusText = document.getElementById('status-text');
const infoSectionContainer = document.querySelector('.info-section-container');

// Renamed references from 'bunni' to 'visual'
const visualTitle = document.querySelector('.exploit-title');
const visualVersion = document.getElementById('visual-version');
const visualFreeBadge = document.getElementById('visual-free-badge');
const visualPaidBadge = document.getElementById('visual-paid-badge');
const visualUpdateText = document.getElementById('visual-update-text');
const visualLastUpdated = document.getElementById('visual-last-updated');
const visualDetectionWarning = document.getElementById('visual-detection-warning');

const visualUncPercentage = document.getElementById('visual-unc-percentage');
const visualSuncPercentage = document.getElementById('visual-sunc-percentage');
const visualDecompilerStatus = document.getElementById('visual-decompiler-status');
const visualMultiInjectStatus = document.getElementById('visual-multi-inject-status');

const visualWebsiteLink = document.getElementById('visual-website-link');
const visualDiscordLink = document.getElementById('visual-discord-link');

// Beta message element
const betaMessageContainer = document.getElementById('beta-message-container');

// NEW: Footer elements for dynamic styling
const footerLine = document.getElementById('footer-dynamic-line');
const appFooter = document.querySelector('.app-footer');


async function checkVisualStatus() {
  try {
    // IMPORTANT: Upstream URL remains 'Bunni.lol'
    const response = await fetch('https://isbunniup-proxy.a91168823.workers.dev/api/status/exploits/Bunni.lol');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Update main status text
    if (data.updateStatus === true) {
      statusText.textContent = 'Yes, Visual is Up.';
      statusText.classList.add('green');
      statusText.classList.remove('red');
      // Set footer dynamic colors for "Up" status
      document.documentElement.style.setProperty('--footer-dynamic-line-color', '#4caf50'); /* Green */
      document.documentElement.style.setProperty('--footer-text-color-dynamic', '#a0a0a0'); /* Keep subtle grey for text */
    } else {
      statusText.textContent = 'No, Visual is Down.';
      statusText.classList.add('red');
      statusText.classList.remove('green');
      // Set footer dynamic colors for "Down" status
      document.documentElement.style.setProperty('--footer-dynamic-line-color', '#f44336'); /* Red */
      document.documentElement.style.setProperty('--footer-text-color-dynamic', '#a0a0a0'); /* Keep subtle grey for text */
    }

    // Populate Visual details
    if (data) {
      infoSectionContainer.style.display = 'block';

      // Update update status label
      if (data.updateStatus === true) {
        visualUpdateText.textContent = 'Updated';
        visualUpdateText.classList.add('updated');
        visualUpdateText.classList.remove('not-updated');
      } else {
        visualUpdateText.textContent = 'Not Updated';
        visualUpdateText.classList.add('not-updated');
        visualUpdateText.classList.remove('updated');
      }

      visualTitle.textContent = 'Visual';
      visualVersion.textContent = data.version || 'N/A';
      visualLastUpdated.textContent = data.updatedDate || 'N/A';

      // Free/Paid badge and price
      if (data.free === true) {
          visualFreeBadge.style.display = 'inline-block';
          visualPaidBadge.style.display = 'none';
      } else {
          visualFreeBadge.style.display = 'none';
          visualPaidBadge.style.display = 'inline-block';
          visualPaidBadge.textContent = data.priceText || 'Paid';
      }

      // Detection Warning
      if (data.detected === true) {
          visualDetectionWarning.style.display = 'block';
      } else {
          visualDetectionWarning.style.display = 'none';
      }

      // Populate info items
      if (typeof data.uncPercentage === 'number') {
          visualUncPercentage.textContent = data.uncPercentage + '%';
      } else if (typeof data.uncStatus === 'boolean') {
          visualUncPercentage.textContent = visualUncStatus ? 'Yes' : 'No';
      } else {
          visualUncPercentage.textContent = 'N/A';
      }

      if (typeof data.suncPercentage === 'number') {
          visualSuncPercentage.textContent = data.suncPercentage + '%';
      } else {
          visualSuncPercentage.textContent = 'N/A';
      }

      if (typeof data.decompiler === 'boolean') {
          visualDecompilerStatus.textContent = data.decompiler ? 'X' : 'No';
      } else {
          visualDecompilerStatus.textContent = 'N/A';
      }

      if (typeof data.multiInject === 'boolean') {
          visualMultiInjectStatus.textContent = data.multiInject ? 'X' : 'No';
      } else {
          visualMultiInjectStatus.textContent = 'N/A';
      }

      // Action links
      if (data.websitelink) {
          visualWebsiteLink.href = data.websitelink;
          visualWebsiteLink.style.display = 'inline-flex';
      } else {
          visualWebsiteLink.style.display = 'none';
      }

      // Set the new Discord link here
      visualDiscordLink.href = 'https://discord.gg/MUKkhVgjVu';
      visualDiscordLink.style.display = 'inline-flex';

      // Show beta message as "Bunni [Beta] is working"
      betaMessageContainer.style.display = 'block';

      // If data is successfully fetched, the footer should be visible.
      appFooter.style.display = 'block'; // Ensure footer is visible


    } else {
      infoSectionContainer.style.display = 'none';
      betaMessageContainer.style.display = 'none';
      appFooter.style.display = 'none'; // Hide footer on no data
    }

  } catch (error) {
    console.error('Error checking status:', error);
    statusText.textContent = 'Unable to check Visual\'s status.';
    statusText.classList.add('red');
    statusText.classList.remove('green');
    infoSectionContainer.style.display = 'none';
    betaMessageContainer.style.display = 'none';
    appFooter.style.display = 'none'; // Hide footer on error
    // Set footer dynamic colors to a default or error state
    document.documentElement.style.setProperty('--footer-dynamic-line-color', '#f44336'); /* Red for error */
    document.documentElement.style.setProperty('--footer-text-color-dynamic', '#a0a0a0');
  }
}

checkVisualStatus();