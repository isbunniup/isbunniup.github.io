const statusText = document.getElementById('status-text');
const infoSectionContainer = document.querySelector('.info-section-container');

const bunniTitle = document.querySelector('.exploit-title');
const bunniVersion = document.getElementById('bunni-version');
const bunniFreeBadge = document.getElementById('bunni-free-badge');
const bunniPaidBadge = document.getElementById('bunni-paid-badge');
const bunniUpdateText = document.getElementById('bunni-update-text');
const bunniLastUpdated = document.getElementById('bunni-last-updated');
const bunniDetectionWarning = document.getElementById('bunni-detection-warning');

const bunniUncPercentage = document.getElementById('bunni-unc-percentage');
const bunniSuncPercentage = document.getElementById('bunni-sunc-percentage');
const bunniDecompilerStatus = document.getElementById('bunni-decompiler-status');
const bunniMultiInjectStatus = document.getElementById('bunni-multi-inject-status');

const bunniWebsiteLink = document.getElementById('bunni-website-link');
const bunniDiscordLink = document.getElementById('bunni-discord-link');

// Footer elements for dynamic styling
const footerLine = document.getElementById('footer-dynamic-line');
const appFooter = document.querySelector('.app-footer');


async function checkBunniStatus() {
  try {
    // IMPORTANT: Make sure this is your new, working Cloudflare Worker URL
    const response = await fetch('https://isbunniup-proxy.a91168823.workers.dev/api/status/exploits/Bunni.lol');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Update main status text
    if (data.updateStatus === true) {
      statusText.textContent = 'Yes, Bunni is Up.';
      statusText.classList.add('green');
      statusText.classList.remove('red');
      document.documentElement.style.setProperty('--footer-dynamic-line-color', '#4caf50'); 
    } else {
      statusText.textContent = 'No, Bunni is Down.';
      statusText.classList.add('red');
      statusText.classList.remove('green');
      document.documentElement.style.setProperty('--footer-dynamic-line-color', '#f44336');
    }

    // Populate Bunni details
    if (data) {
      infoSectionContainer.style.display = 'block';

      if (data.updateStatus === true) {
        bunniUpdateText.textContent = 'Updated';
        bunniUpdateText.classList.add('updated');
        bunniUpdateText.classList.remove('not-updated');
      } else {
        bunniUpdateText.textContent = 'Not Updated';
        bunniUpdateText.classList.add('not-updated');
        bunniUpdateText.classList.remove('updated');
      }

      bunniTitle.textContent = 'Bunni';
      bunniVersion.textContent = data.version || 'N/A';
      bunniLastUpdated.textContent = data.updatedDate || 'N/A';

      if (data.free === true) {
          bunniFreeBadge.style.display = 'inline-block';
          bunniPaidBadge.style.display = 'none';
      } else {
          bunniFreeBadge.style.display = 'none';
          bunniPaidBadge.style.display = 'inline-block';
          bunniPaidBadge.textContent = data.priceText || 'Paid';
      }

      if (data.detected === true) {
          bunniDetectionWarning.style.display = 'block';
      } else {
          bunniDetectionWarning.style.display = 'none';
      }

      if (typeof data.uncPercentage === 'number') {
          bunniUncPercentage.textContent = data.uncPercentage + '%';
      } else if (typeof data.uncStatus === 'boolean') {
          bunniUncPercentage.textContent = data.uncStatus ? 'Yes' : 'No';
      } else {
          bunniUncPercentage.textContent = 'N/A';
      }

      if (typeof data.suncPercentage === 'number') {
          bunniSuncPercentage.textContent = data.suncPercentage + '%';
      } else {
          bunniSuncPercentage.textContent = 'N/A';
      }

      if (typeof data.decompiler === 'boolean') {
          bunniDecompilerStatus.textContent = data.decompiler ? 'X' : 'No';
      } else {
          bunniDecompilerStatus.textContent = 'N/A';
      }

      if (typeof data.multiInject === 'boolean') {
          bunniMultiInjectStatus.textContent = data.multiInject ? 'X' : 'No';
      } else {
          bunniMultiInjectStatus.textContent = 'N/A';
      }

      if (data.websitelink) {
          bunniWebsiteLink.href = data.websitelink;
          bunniWebsiteLink.style.display = 'inline-flex';
      } else {
          bunniWebsiteLink.style.display = 'none';
      }

      bunniDiscordLink.href = 'https://discord.gg/MUKkhVgjVu';
      bunniDiscordLink.style.display = 'inline-flex';

      appFooter.style.display = 'block';

    } else {
      infoSectionContainer.style.display = 'none';
      appFooter.style.display = 'none';
    }

  } catch (error) {
    console.error('Error checking status:', error);
    statusText.textContent = 'Unable to check Bunni\'s status.';
    statusText.classList.add('red');
    statusText.classList.remove('green');
    infoSectionContainer.style.display = 'none';
    appFooter.style.display = 'none';
    document.documentElement.style.setProperty('--footer-dynamic-line-color', '#f44336');
  }
}

checkBunniStatus();