const statusText = document.getElementById('status-text');
// No longer directly manipulating bunniCard display, it's now wrapped in info-section-container
// const bunniCard = document.getElementById('bunni-card'); // This ID is now on a different element or removed

// References to new simplified elements
const infoSectionContainer = document.querySelector('.info-section-container'); // Get the main container
const exploitTitle = document.querySelector('.exploit-title'); // Get the h3 for "Bunni.lol"
const versionTag = document.getElementById('bunni-version');
const freeBadge = document.getElementById('bunni-free-badge');
const paidBadge = document.getElementById('bunni-paid-badge');
const updateStatusLabel = document.getElementById('bunni-update-text');
const lastUpdatedText = document.getElementById('bunni-last-updated');
const detectionWarning = document.getElementById('bunni-detection-warning');

const uncPercentage = document.getElementById('bunni-unc-percentage');
const suncPercentage = document.getElementById('bunni-sunc-percentage');
const decompilerStatus = document.getElementById('bunni-decompiler-status');
const multiInjectStatus = document.getElementById('bunni-multi-inject-status');

const websiteLink = document.getElementById('bunni-website-link');
const discordLink = document.getElementById('bunni-discord-link');

// Helper functions (remain the same as before)
// We're no longer injecting SVG for X/check, just text
// function getCheckIcon() { /* ... */ }
// function getXIcon() { /* ... */ }


async function checkBunniStatus() {
  try {
    const response = await fetch('https://isbunniup-proxy.a91168823.workers.dev/');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Update main status text
    if (data.updateStatus === true) {
      statusText.textContent = 'Yes, Bunni is Up.';
      statusText.classList.add('green');
      statusText.classList.remove('red');
    } else {
      statusText.textContent = 'No, Bunni is Down.';
      statusText.classList.add('red');
      statusText.classList.remove('green');
    }

    // Populate Bunni details
    if (data) {
      infoSectionContainer.style.display = 'block'; // Or 'flex', depends on desired main container behavior

      // Update update status label
      if (data.updateStatus === true) {
        updateStatusLabel.textContent = 'Updated';
        updateStatusLabel.classList.add('updated');
        updateStatusLabel.classList.remove('not-updated');
      } else {
        updateStatusLabel.textContent = 'Not Updated';
        updateStatusLabel.classList.add('not-updated');
        updateStatusLabel.classList.remove('updated');
      }

      exploitTitle.textContent = data.title || 'Bunni.lol'; // Ensure title is set
      versionTag.textContent = data.version || 'N/A';
      lastUpdatedText.textContent = data.updatedDate || 'N/A';

      // Free/Paid badge and price
      if (data.free === true) {
          freeBadge.style.display = 'inline-block';
          paidBadge.style.display = 'none';
      } else {
          freeBadge.style.display = 'none';
          paidBadge.style.display = 'inline-block';
          paidBadge.textContent = data.priceText || 'Paid'; // Use data.priceText if available
      }

      // Detection Warning
      if (data.detected === true) { // If detected is TRUE, show warning
          detectionWarning.style.display = 'block'; // Use block for this paragraph/div
      } else {
          detectionWarning.style.display = 'none';
      }

      // Populate info items
      if (typeof data.uncPercentage === 'number') {
          uncPercentage.textContent = data.uncPercentage + '%';
      } else if (typeof data.uncStatus === 'boolean') {
          uncPercentage.textContent = data.uncStatus ? 'Yes' : 'No';
      } else {
          uncPercentage.textContent = 'N/A';
      }

      if (typeof data.suncPercentage === 'number') {
          suncPercentage.textContent = data.suncPercentage + '%';
      } else {
          suncPercentage.textContent = 'N/A';
      }

      // Decompiler status (using 'X' for true, 'No' for false)
      if (typeof data.decompiler === 'boolean') {
          decompilerStatus.textContent = data.decompiler ? 'X' : 'No';
      } else {
          decompilerStatus.textContent = 'N/A';
      }

      // Multi-Inject status (using 'X' for true, 'No' for false)
      if (typeof data.multiInject === 'boolean') {
          multiInjectStatus.textContent = data.multiInject ? 'X' : 'No';
      } else {
          multiInjectStatus.textContent = 'N/A';
      }

      // Action links
      if (data.websitelink) {
          websiteLink.href = data.websitelink;
          websiteLink.style.display = 'inline-flex'; // Use inline-flex for buttons
      } else {
          websiteLink.style.display = 'none';
      }

      if (data.discordlink) {
          discordLink.href = data.discordlink;
          discordLink.style.display = 'inline-flex'; // Use inline-flex for buttons
      } else {
          discordLink.style.display = 'none';
      }

    } else {
      infoSectionContainer.style.display = 'none'; // Hide info section on no data
    }

  } catch (error) {
    console.error('Error checking status:', error);
    statusText.textContent = 'Unable to check Bunni\'s status.';
    statusText.classList.add('red');
    statusText.classList.remove('green');
    infoSectionContainer.style.display = 'none'; // Hide info section on error
  }
}

checkBunniStatus();