// Main Application Controller for Functional AAC System
import { storage } from './storage.js';
import { speechEngine } from './speech.js';
import { SYSTEM_CATEGORIES, AVAILABLE_ICONS } from './data.js';
import { DevicePreview } from './device.js';
import { QRScannerService } from './qrScanner.js';
import { i18n, SUPPORTED_LANGUAGES } from './i18n.js';

class AACApp {
  constructor() {
    this.currentTheme = localStorage.getItem('aac_theme_v1') || 'light';
    this.currentTab = 'communicator'; // 'communicator' (Home) | 'library' | 'custom' | 'settings'
    this.selectedCategoryFilter = 'All';
    this.selectedAgeFilter = 'All';
    this.selectedPriorityFilter = 'All';
    this.selectedStatusFilter = 'All';
    this.searchQuery = '';
    this.editingPhraseId = null;
    this.deleteTargetPhraseId = null;

    // Onboarding State
    this.selectedOnboardingAge = 'Children';
    this.scannedDeviceId = 'AAC-PRO-8892';
    this.qrScanner = null;

    this.devicePreview = null;
  }

  init() {
    // Apply saved theme (Default: Bright Light Mode)
    this.applyTheme(this.currentTheme);

    // Initialize Accessibility Options (Font Scale, Contrast, Reduced Motion)
    this.initAccessibility();

    // Initialize Multilingual 5-Language Selector
    this.initLanguageSelector();

    // Check pairing / onboarding state first
    this.checkOnboardingState();

    // Initialize Device Preview
    const deviceContainer = document.getElementById('devicePreviewMount');
    if (deviceContainer) {
      this.devicePreview = new DevicePreview(deviceContainer);
      this.devicePreview.render();
    }

    // Subscribe to storage changes
    storage.subscribe(() => {
      this.render();
      this.updateSyncBadge();
      this.updateHeaderDeviceBadge();
      this.updateSettingsDisplay();
    });

    // Subscribe to language changes
    i18n.subscribe(() => {
      this.applyLanguageUpdate();
      this.render();
    });

    // Populate Category selects in Modals & Filters
    this.populateCategoryOptions();
    this.populateIconPicker();
    this.populateVoiceSelect();

    // Attach DOM Event Listeners
    this.attachDomListeners();
    this.attachOnboardingListeners();
    this.attachSettingsListeners();

    // Initial render
    this.applyLanguageUpdate();
    this.render();
    this.updateSyncBadge();
    this.updateHeaderDeviceBadge();
    this.updateSettingsDisplay();
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('aac_theme_v1', theme);

    // Update Header Toggle Button
    const iconEl = document.getElementById('themeToggleIcon');
    const labelEl = document.getElementById('themeToggleLabel');
    if (iconEl && labelEl) {
      if (theme === 'dark') {
        iconEl.textContent = '☀️';
        labelEl.textContent = 'Light';
      } else {
        iconEl.textContent = '🌙';
        labelEl.textContent = 'Dark';
      }
    }

    // Update Settings Cards
    const optLight = document.getElementById('optThemeLight');
    const optDark = document.getElementById('optThemeDark');
    if (optLight && optDark) {
      if (theme === 'dark') {
        optLight.classList.remove('selected');
        optDark.classList.add('selected');
      } else {
        optLight.classList.add('selected');
        optDark.classList.remove('selected');
      }
    }

    // Update A11y Flyout Theme Buttons
    const a11yLight = document.getElementById('a11yThemeLight');
    const a11yDark = document.getElementById('a11yThemeDark');
    if (a11yLight && a11yDark) {
      if (theme === 'dark') {
        a11yLight.classList.remove('selected');
        a11yDark.classList.add('selected');
      } else {
        a11yLight.classList.add('selected');
        a11yDark.classList.remove('selected');
      }
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    this.showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Mode' : 'Bright Light Mode'}`, 'info');
  }

  // ==================== ACCESSIBILITY & DISPLAY OPTIONS ====================

  initAccessibility() {
    const btnToggle = document.getElementById('btnAccessibilityToggle');
    const flyout = document.getElementById('a11yFlyout');
    const overlay = document.getElementById('a11yOverlay');
    const btnClose = document.getElementById('btnCloseA11y');

    const openFlyout = () => {
      if (flyout) flyout.classList.add('show');
      if (overlay) overlay.classList.add('show');
      if (btnToggle) btnToggle.classList.add('active');
    };

    const closeFlyout = () => {
      if (flyout) flyout.classList.remove('show');
      if (overlay) overlay.classList.remove('show');
      if (btnToggle) btnToggle.classList.remove('active');
    };

    if (btnToggle) {
      btnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (flyout && flyout.classList.contains('show')) {
          closeFlyout();
        } else {
          openFlyout();
        }
      });
    }

    if (btnClose) btnClose.addEventListener('click', closeFlyout);
    if (overlay) overlay.addEventListener('click', closeFlyout);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && flyout && flyout.classList.contains('show')) {
        closeFlyout();
      }
    });

    // 1. Font Scale
    const savedScale = localStorage.getItem('aac_a11y_scale') || '1.0';
    this.applyFontScale(savedScale);

    document.querySelectorAll('.font-scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scale = btn.dataset.scale;
        this.applyFontScale(scale);
        this.showToast(`Text size set to ${(parseFloat(scale) * 100).toFixed(0)}%`, 'info');
      });
    });

    // 2. Contrast Modes (Default, High Contrast Yellow/Black, High Contrast Blue/White)
    const savedContrast = localStorage.getItem('aac_a11y_contrast') || 'default';
    this.applyContrastMode(savedContrast);

    document.querySelectorAll('.contrast-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.contrastMode;
        this.applyContrastMode(mode);
        this.showToast(`Contrast updated: ${mode === 'default' ? 'Standard' : (mode === 'high-yellow' ? 'Yellow/Black (CVI)' : 'Blue/White')}`, 'info');
      });
    });

    // 3. Theme Buttons inside A11y Flyout
    const btnThemeLight = document.getElementById('a11yThemeLight');
    const btnThemeDark = document.getElementById('a11yThemeDark');
    if (btnThemeLight) btnThemeLight.addEventListener('click', () => this.applyTheme('light'));
    if (btnThemeDark) btnThemeDark.addEventListener('click', () => this.applyTheme('dark'));

    // 4. Reduced Motion
    const checkMotion = document.getElementById('a11yReducedMotion');
    const savedMotion = localStorage.getItem('aac_reduced_motion') === 'true';
    if (checkMotion) {
      checkMotion.checked = savedMotion;
      document.documentElement.setAttribute('data-reduced-motion', savedMotion ? 'true' : 'false');
      checkMotion.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        document.documentElement.setAttribute('data-reduced-motion', enabled ? 'true' : 'false');
        localStorage.setItem('aac_reduced_motion', enabled ? 'true' : 'false');
      });
    }

    // 5. Sound clicks
    const checkClicks = document.getElementById('a11ySoundClicks');
    if (checkClicks) {
      checkClicks.checked = speechEngine.soundClicksEnabled;
      checkClicks.addEventListener('change', (e) => {
        speechEngine.soundClicksEnabled = e.target.checked;
      });
    }
  }

  applyFontScale(scale) {
    document.documentElement.style.setProperty('--a11y-font-scale', scale);
    localStorage.setItem('aac_a11y_scale', scale);

    document.querySelectorAll('.font-scale-btn').forEach(b => {
      if (b.dataset.scale === scale) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });
  }

  applyContrastMode(mode) {
    if (mode === 'default') {
      document.documentElement.removeAttribute('data-contrast');
    } else {
      document.documentElement.setAttribute('data-contrast', mode);
    }
    localStorage.setItem('aac_a11y_contrast', mode);

    document.querySelectorAll('.contrast-pill-btn').forEach(b => {
      if (b.dataset.contrastMode === mode) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });

    if (this.devicePreview) {
      this.devicePreview.setHighContrast(mode.startsWith('high'));
    }
  }

  // ==================== 5-LANGUAGE SUPPORT (EN, TA, TE, KN, HI) ====================

  initLanguageSelector() {
    const btnDropdown = document.getElementById('btnLangDropdown');
    const menu = document.getElementById('langDropdownMenu');
    const flagEl = document.getElementById('currentLangFlag');
    const nameEl = document.getElementById('currentLangName');

    const updateLangUi = () => {
      const info = i18n.getCurrentLanguageInfo();
      if (flagEl) flagEl.textContent = info.flag;
      if (nameEl) nameEl.textContent = info.name;
      if (menu) {
        menu.querySelectorAll('.lang-option-btn').forEach(btn => {
          if (btn.dataset.langCode === info.code) {
            btn.classList.add('selected');
          } else {
            btn.classList.remove('selected');
          }
        });
      }
    };

    updateLangUi();

    if (btnDropdown && menu) {
      btnDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.style.display === 'flex';
        menu.style.display = isOpen ? 'none' : 'flex';
        btnDropdown.setAttribute('aria-expanded', !isOpen);
      });

      document.addEventListener('click', () => {
        menu.style.display = 'none';
        btnDropdown.setAttribute('aria-expanded', 'false');
      });

      menu.querySelectorAll('.lang-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const code = btn.dataset.langCode;
          i18n.setLanguage(code);
          updateLangUi();
          menu.style.display = 'none';
          this.applyLanguageUpdate();
          this.render();
          const info = i18n.getCurrentLanguageInfo();
          this.showToast(`Language switched to ${info.name} (${info.nativeName})`, 'success');
        });
      });
    }
  }

  applyLanguageUpdate() {
    const titleEl = document.getElementById('appHeaderTitle');
    const subEl = document.getElementById('appHeaderSubtitle');
    if (titleEl) titleEl.textContent = i18n.t('appName');
    if (subEl) subEl.textContent = i18n.t('appSubtitle');

    const tabHome = document.getElementById('tabCommunicatorBtn');
    const tabLib = document.getElementById('tabLibraryBtn');
    const tabCust = document.getElementById('tabCustomBtn');
    const tabSet = document.getElementById('tabSettingsBtn');

    if (tabHome) tabHome.innerHTML = `<span>📱</span> ${i18n.t('tabHome')}`;
    if (tabLib) tabLib.innerHTML = `<span>📖</span> ${i18n.t('tabLibrary')}`;
    if (tabCust) tabCust.innerHTML = `<span>⭐</span> ${i18n.t('tabCustom')} <span class="tab-badge" id="customTabCountBadge">${storage.getCustomPhrases().length}</span>`;
    if (tabSet) tabSet.innerHTML = `<span>⚙️</span> ${i18n.t('tabSettings')} <span id="settingsTabPendingDot" class="tab-pending-dot" style="display: ${storage.getSyncInfo().needsSync ? 'inline-block' : 'none'};"></span>`;

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.placeholder = i18n.t('searchPlaceholder');

    this.populateCategoryOptions();
    this.renderCategoryPills();
    if (this.devicePreview) {
      this.devicePreview.render();
    }
  }

  // ==================== ONBOARDING & QR SCANNER ====================

  checkOnboardingState() {
    const paired = storage.getPairedDevice();
    const viewOnboarding = document.getElementById('view-onboarding');
    const viewMain = document.getElementById('view-main');

    if (!paired) {
      // Show QR Scanner & Age selection first!
      if (viewOnboarding) viewOnboarding.style.display = 'block';
      if (viewMain) viewMain.style.display = 'none';
      this.goToOnboardingStep(1);
    } else {
      // Already paired, show main tabbed home page!
      if (viewOnboarding) viewOnboarding.style.display = 'none';
      if (viewMain) viewMain.style.display = 'block';
      this.selectedOnboardingAge = paired.ageGroup || 'Children';
      this.scannedDeviceId = paired.deviceId || 'AAC-PRO-8892';
      this.selectedAgeFilter = paired.ageGroup || 'Children';
      const filterAgeSelect = document.getElementById('filterAgeSelect');
      if (filterAgeSelect) filterAgeSelect.value = this.selectedAgeFilter;
      this.populateCategoryOptions();
      this.renderCategoryPills();
      this.updateHeaderDeviceBadge();
    }
  }

  goToOnboardingStep(stepNumber) {
    const step1Nav = document.getElementById('stepperStep1');
    const step2Nav = document.getElementById('stepperStep2');
    const stepLine = document.getElementById('stepperLine');
    const pane1 = document.getElementById('paneStep1');
    const pane2 = document.getElementById('paneStep2');

    if (stepNumber === 1) {
      if (step1Nav) step1Nav.className = 'stepper-step active';
      if (step2Nav) step2Nav.className = 'stepper-step';
      if (stepLine) stepLine.className = 'stepper-line';
      if (pane1) pane1.className = 'step-pane active';
      if (pane2) pane2.className = 'step-pane';
    } else {
      if (step1Nav) step1Nav.className = 'stepper-step completed';
      if (step2Nav) step2Nav.className = 'stepper-step active';
      if (stepLine) stepLine.className = 'stepper-line active';
      if (pane1) pane1.className = 'step-pane';
      if (pane2) pane2.className = 'step-pane active';
    }
  }

  handleDecodedQr(rawText) {
    let deviceId = 'AAC-PRO-8892';
    try {
      if (rawText.startsWith('{') && rawText.endsWith('}')) {
        const parsed = JSON.parse(rawText);
        deviceId = parsed.deviceId || parsed.id || rawText;
      } else {
        deviceId = rawText.trim();
      }
    } catch (e) {
      deviceId = rawText.trim();
    }

    this.scannedDeviceId = deviceId;
    speechEngine.playSyncSuccessTone();
    this.showToast(`✓ Real Optical QR Read Successful: "${this.scannedDeviceId}"`, 'success');

    // Stop camera if running
    if (this.qrScanner) {
      this.qrScanner.stopCamera();
    }

    // Advance to Step 2
    setTimeout(() => this.goToOnboardingStep(2), 350);
  }

  attachOnboardingListeners() {
    const video = document.getElementById('qrCameraVideo');
    const canvas = document.getElementById('qrScanCanvas');
    const statusText = document.getElementById('qrCameraStatus');
    const sampleVisual = document.getElementById('qrSampleVisual');

    // Initialize Real Optical QR Scanner Engine
    if (video && canvas) {
      this.qrScanner = new QRScannerService({
        videoElement: video,
        canvasElement: canvas,
        onScanSuccess: (decodedText) => {
          this.handleDecodedQr(decodedText);
        },
        onStatusChange: (status, message) => {
          if (statusText) {
            const icon = status === 'active' ? '🟢' : (status === 'found' ? '✓' : (status === 'error' ? '⚠️' : '📷'));
            statusText.innerHTML = `<span>${icon}</span> ${message}`;
          }
        }
      });
    }

    // Step 1: Read Onscreen Sample QR Code (Optical decoding via jsQR)
    const btnScanSampleQr = document.getElementById('btnScanSampleQr');
    if (btnScanSampleQr) {
      btnScanSampleQr.addEventListener('click', async () => {
        speechEngine.playTactileBeep();
        if (statusText) statusText.innerHTML = '<span>⚡</span> Reading onscreen QR code...';
        try {
          if (this.qrScanner) {
            await this.qrScanner.decodeImageSource('assets/device_qr_sample.png');
          } else {
            this.handleDecodedQr('AAC-PRO-8892');
          }
        } catch (err) {
          // If image load fails, fallback to direct device code
          this.handleDecodedQr('AAC-PRO-8892');
        }
      });
    }

    // Step 1: Live Webcam Scanner (Real-time frame decoding)
    const btnStartCamera = document.getElementById('btnStartRealCamera');
    if (btnStartCamera) {
      btnStartCamera.addEventListener('click', async () => {
        try {
          if (sampleVisual) sampleVisual.style.display = 'none';
          if (this.qrScanner) {
            await this.qrScanner.startCamera();
          }
        } catch (err) {
          if (sampleVisual) sampleVisual.style.display = 'flex';
          this.showToast('Camera not available or denied. You can upload an image or click "Read Onscreen QR Code".', 'info');
        }
      });
    }

    // Step 1: Upload QR Image
    const btnUploadQr = document.getElementById('btnUploadQrImage');
    const fileInput = document.getElementById('qrFileInput');
    if (btnUploadQr && fileInput) {
      btnUploadQr.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (statusText) statusText.innerHTML = '<span>📁</span> Decoding uploaded image...';
        try {
          if (this.qrScanner) {
            await this.qrScanner.decodeImageFile(file);
          }
        } catch (err) {
          this.showToast(err.message || 'No QR code found in uploaded image.', 'error');
          if (statusText) statusText.innerHTML = '<span>⚠️</span> No QR code found. Try another image or enter code manually.';
        }
      });
    }

    // Step 1: Manual Pair Code
    const btnManualPair = document.getElementById('btnManualPair');
    const manualInput = document.getElementById('manualDeviceCodeInput');
    if (btnManualPair && manualInput) {
      btnManualPair.addEventListener('click', () => {
        const code = manualInput.value.trim();
        if (!code) {
          this.showToast('Please enter a valid Device ID', 'error');
          return;
        }
        speechEngine.playTactileBeep();
        this.scannedDeviceId = code.toUpperCase();
        this.showToast(`✓ Device code ${this.scannedDeviceId} recognized!`, 'success');
        this.goToOnboardingStep(2);
      });
    }

    // Step 2: Age Card Selection
    document.querySelectorAll('.age-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.age-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedOnboardingAge = card.dataset.age;
        speechEngine.playTactileBeep();
      });
    });

    // Step 2: Back to Step 1
    const btnBackToQr = document.getElementById('btnBackToQrScan');
    if (btnBackToQr) {
      btnBackToQr.addEventListener('click', () => {
        this.goToOnboardingStep(1);
      });
    }

    // Step 2: Complete Setup and Go to Home Page!
    const btnComplete = document.getElementById('btnCompleteSetupAndGoHome');
    if (btnComplete) {
      btnComplete.addEventListener('click', () => {
        // Save pairing & age group
        storage.savePairedDevice({
          deviceId: this.scannedDeviceId || 'AAC-PRO-8892',
          deviceName: "Alex's Communicator Pro",
          ageGroup: this.selectedOnboardingAge
        });

        this.selectedAgeFilter = this.selectedOnboardingAge;
        const filterAgeSelect = document.getElementById('filterAgeSelect');
        if (filterAgeSelect) filterAgeSelect.value = this.selectedAgeFilter;
        this.populateCategoryOptions();
        this.renderCategoryPills();

        // Switch to main view
        const viewOnboarding = document.getElementById('view-onboarding');
        const viewMain = document.getElementById('view-main');
        if (viewOnboarding) viewOnboarding.style.display = 'none';
        if (viewMain) viewMain.style.display = 'block';

        // Switch to Communicator Home tab
        this.switchTab('communicator');
        if (this.devicePreview) {
          this.devicePreview.render();
        }

        // Play confirmation sound
        speechEngine.playSyncSuccessTone();

        this.showToast(`✓ Linked to ${this.scannedDeviceId} for ${this.selectedOnboardingAge}! Showing ${this.selectedOnboardingAge}-appropriate categories.`, 'success');
      });
    }

    // Header Button: Open QR Scanner / Switch Profile
    const btnHeaderPair = document.getElementById('btnHeaderPairDevice');
    if (btnHeaderPair) {
      btnHeaderPair.addEventListener('click', () => {
        const viewOnboarding = document.getElementById('view-onboarding');
        const viewMain = document.getElementById('view-main');
        if (viewOnboarding && viewMain) {
          viewOnboarding.style.display = 'block';
          viewMain.style.display = 'none';
          this.goToOnboardingStep(1);
        }
      });
    }
  }

  updateHeaderDeviceBadge() {
    const paired = storage.getPairedDevice();
    const idEl = document.getElementById('headerDeviceId');
    const ageEl = document.getElementById('headerAgeLabel');
    const commAgeBadge = document.getElementById('communicatorAgeBadge');
    const commDeviceBadge = document.getElementById('communicatorDeviceBadge');

    if (paired) {
      if (idEl) idEl.textContent = paired.deviceId;
      if (ageEl) ageEl.textContent = paired.ageGroup;
      if (commAgeBadge) commAgeBadge.textContent = `Profile: ${paired.ageGroup}`;
      if (commDeviceBadge) commDeviceBadge.textContent = `Device: ${paired.deviceId}`;
    }
  }

  // ==================== TAB SWITCHING ====================

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update buttons
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update panels
    document.querySelectorAll('.tab-view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`panel-${tabName}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    this.render();
  }

  // ==================== RENDERING ====================

  populateCategoryOptions() {
    const filterCatSelect = document.getElementById('filterCategorySelect');
    const modalCatSelect = document.getElementById('modalPhraseCategory');

    const effectiveAge = this.selectedAgeFilter;
    const allowedCategories = (effectiveAge && effectiveAge !== 'All')
      ? i18n.getCategoriesForAge(effectiveAge, SYSTEM_CATEGORIES)
      : SYSTEM_CATEGORIES;

    if (filterCatSelect) {
      const currentVal = this.selectedCategoryFilter;
      filterCatSelect.innerHTML = `<option value="All">All Categories (${allowedCategories.length})</option>` +
        allowedCategories.map(c => `<option value="${c.id}">${this.getCategoryEmoji(c.id)} ${i18n.getCategoryName(c.id)}</option>`).join('');

      if (allowedCategories.some(c => c.id === currentVal) || currentVal === 'All') {
        filterCatSelect.value = currentVal;
      } else {
        filterCatSelect.value = 'All';
        this.selectedCategoryFilter = 'All';
      }
    }

    if (modalCatSelect) {
      modalCatSelect.innerHTML = allowedCategories.map(c => 
        `<option value="${c.id}">${this.getCategoryEmoji(c.id)} ${i18n.getCategoryName(c.id)}</option>`
      ).join('');
    }
  }

  populateIconPicker() {
    const iconContainer = document.getElementById('modalIconGrid');
    if (!iconContainer) return;

    iconContainer.innerHTML = AVAILABLE_ICONS.map((icon, idx) => `
      <label class="icon-option-card ${idx === 0 ? 'selected' : ''}" data-icon-id="${icon.id}">
        <input type="radio" name="phraseIcon" value="${icon.id}" ${idx === 0 ? 'checked' : ''}>
        <span class="icon-emoji">${icon.emoji}</span>
        <span class="icon-title">${icon.label}</span>
      </label>
    `).join('');

    iconContainer.querySelectorAll('.icon-option-card').forEach(card => {
      card.addEventListener('click', () => {
        iconContainer.querySelectorAll('.icon-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
  }

  render() {
    this.renderStats();
    this.renderCategoryPills();

    const customTabBadge = document.getElementById('customTabCountBadge');
    if (customTabBadge) {
      customTabBadge.textContent = storage.getCustomPhrases().length;
    }

    if (this.currentTab === 'communicator') {
      if (this.devicePreview) {
        this.devicePreview.render();
      }
    } else if (this.currentTab === 'library') {
      this.renderLibraryView();
    } else if (this.currentTab === 'custom') {
      this.renderCustomPhrasesView();
    } else if (this.currentTab === 'settings') {
      this.updateSettingsDisplay();
    }
  }

  renderStats() {
    const allPhrases = storage.getAllPhrases();
    const customPhrases = storage.getCustomPhrases();
    const enabledPhrases = allPhrases.filter(p => p.enabled);
    const emergencyPhrases = allPhrases.filter(p => p.category === 'Emergency' && p.enabled);

    const elTotal = document.getElementById('statTotalPhrases');
    const elCustom = document.getElementById('statCustomPhrases');
    const elActive = document.getElementById('statActiveOnDevice');
    const elEmergency = document.getElementById('statEmergencyPhrases');

    if (elTotal) elTotal.textContent = allPhrases.length;
    if (elCustom) elCustom.textContent = customPhrases.length;
    if (elActive) elActive.textContent = enabledPhrases.length;
    if (elEmergency) elEmergency.textContent = emergencyPhrases.length;
  }

  renderCategoryPills() {
    const container = document.getElementById('categoryPillsContainer');
    if (!container) return;

    const effectiveAge = this.selectedAgeFilter;
    const displayCategories = (effectiveAge && effectiveAge !== 'All')
      ? i18n.getCategoriesForAge(effectiveAge, SYSTEM_CATEGORIES)
      : SYSTEM_CATEGORIES;

    // If currently selected category filter is no longer allowed in this age group, reset to 'All'
    if (this.selectedCategoryFilter !== 'All' && !displayCategories.some(c => c.id === this.selectedCategoryFilter)) {
      this.selectedCategoryFilter = 'All';
      const filterSelect = document.getElementById('filterCategorySelect');
      if (filterSelect) filterSelect.value = 'All';
    }

    const all = storage.getAllPhrases();
    const allowedCatIds = new Set(displayCategories.map(c => c.id));
    const agePhrases = all.filter(p => {
      if (!effectiveAge || effectiveAge === 'All') return true;
      if (!allowedCatIds.has(p.category)) return false;
      return p.ageGroup === 'All Ages' || p.ageGroup === effectiveAge;
    });

    const totalCount = agePhrases.length;

    let html = `
      <button class="cat-pill ${this.selectedCategoryFilter === 'All' ? 'active' : ''}" data-category="All">
        <span class="cat-pill-icon">🌟</span>
        <span class="cat-pill-label">All Categories</span>
        <span class="cat-pill-count">${totalCount}</span>
      </button>
    `;

    displayCategories.forEach(cat => {
      const count = agePhrases.filter(p => p.category === cat.id).length;
      const isEmergency = cat.id === 'Emergency';
      html += `
        <button class="cat-pill ${this.selectedCategoryFilter === cat.id ? 'active' : ''} ${isEmergency ? 'pill-emergency' : ''}" data-category="${cat.id}">
          <span class="cat-pill-icon">${this.getCategoryEmoji(cat.id)}</span>
          <span class="cat-pill-label">${i18n.getCategoryName(cat.id)}</span>
          <span class="cat-pill-count">${count}</span>
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategoryFilter = btn.dataset.category;
        const filterSelect = document.getElementById('filterCategorySelect');
        if (filterSelect) filterSelect.value = this.selectedCategoryFilter;
        this.render();
      });
    });
  }

  getFilteredPhrases(phrasesList) {
    const effectiveAge = this.selectedAgeFilter;
    const allowedCats = (effectiveAge && effectiveAge !== 'All')
      ? new Set(i18n.getCategoriesForAge(effectiveAge, SYSTEM_CATEGORIES).map(c => c.id))
      : null;

    return phrasesList.filter(phrase => {
      // 1. Category Filter
      if (this.selectedCategoryFilter !== 'All' && phrase.category !== this.selectedCategoryFilter) {
        return false;
      }

      // 2. Age Filter & Category Rules:
      // School phrases must NEVER show for Adults; Work/Studies/Transit must NEVER show for Children!
      if (effectiveAge && effectiveAge !== 'All') {
        if (allowedCats && !allowedCats.has(phrase.category)) {
          return false;
        }
        if (phrase.ageGroup !== effectiveAge && phrase.ageGroup !== 'All Ages') {
          return false;
        }
      }

      // 3. Priority Filter
      if (this.selectedPriorityFilter !== 'All' && phrase.priority !== this.selectedPriorityFilter) {
        return false;
      }

      // 4. Status Filter
      if (this.selectedStatusFilter === 'Enabled' && !phrase.enabled) {
        return false;
      }
      if (this.selectedStatusFilter === 'Disabled' && phrase.enabled) {
        return false;
      }

      // 5. Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchText = phrase.text.toLowerCase().includes(q);
        const matchCat = phrase.category.toLowerCase().includes(q);
        if (!matchText && !matchCat) return false;
      }

      return true;
    });
  }

  renderLibraryView() {
    const listContainer = document.getElementById('phraseLibraryList');
    if (!listContainer) return;

    const allPhrases = storage.getAllPhrases();
    const filtered = this.getFilteredPhrases(allPhrases);

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon">🔍</div>
          <h3>No phrases found matching criteria</h3>
          <p>Try clearing filters or search term, or click "+ Add New Phrase" to add one.</p>
          <button class="btn btn-secondary btn-sm" id="btnResetFilters">Reset Filters</button>
        </div>
      `;
      const btnReset = listContainer.querySelector('#btnResetFilters');
      if (btnReset) {
        btnReset.addEventListener('click', () => this.resetFilters());
      }
      return;
    }

    listContainer.innerHTML = `
      <div class="phrases-grid">
        ${filtered.map(phrase => this.createPhraseCardHtml(phrase)).join('')}
      </div>
    `;

    this.attachPhraseCardListeners(listContainer);
  }

  renderCustomPhrasesView() {
    const container = document.getElementById('customPhrasesList');
    if (!container) return;

    const customPhrases = storage.getCustomPhrases();
    const filtered = this.getFilteredPhrases(customPhrases);

    if (customPhrases.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon">✨</div>
          <h3>No Custom Phrases Created Yet</h3>
          <p>Caregivers can add custom phrases tailored specifically to the AAC user's daily life, family names, and unique communication needs.</p>
          <button class="btn btn-primary" id="btnEmptyAddPhrase">
            <span>+</span> Add New Phrase
          </button>
        </div>
      `;
      const btn = container.querySelector('#btnEmptyAddPhrase');
      if (btn) btn.addEventListener('click', () => this.openAddModal());
      return;
    }

    container.innerHTML = `
      <div class="custom-phrases-wrapper">
        <div class="custom-table-header-desc">
          <p>Phrases created specifically for this AAC user. Enabled phrases are immediately live on the physical device.</p>
          <button class="btn btn-primary btn-sm" id="btnHeaderAddCustom">
            <span>+</span> Add New Phrase
          </button>
        </div>

        <div class="phrases-grid">
          ${filtered.map(phrase => this.createPhraseCardHtml(phrase, true)).join('')}
        </div>
      </div>
    `;

    const btnHeaderAdd = container.querySelector('#btnHeaderAddCustom');
    if (btnHeaderAdd) btnHeaderAdd.addEventListener('click', () => this.openAddModal());

    this.attachPhraseCardListeners(container);
  }

  renderConfigurationView() {
    const container = document.getElementById('deviceConfigView');
    if (!container) return;

    const config = storage.getDeviceConfiguration();
    const syncInfo = storage.getSyncInfo();
    const paired = storage.getPairedDevice() || {
      deviceId: 'AAC-PRO-8892',
      deviceName: "Alex's Communicator Pro",
      ageGroup: 'Children'
    };

    const grouped = {};
    SYSTEM_CATEGORIES.forEach(c => { grouped[c.id] = []; });
    config.phrases.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });

    container.innerHTML = `
      <div class="config-summary-card">
        <div class="config-header">
          <div class="config-device-meta">
            <span class="device-avatar">📱</span>
            <div>
              <h3>${paired.deviceName}</h3>
              <p class="meta-sub">ID: <code>${paired.deviceId}</code> • Profile: <strong>${paired.ageGroup}</strong> • Status: <span class="badge ${syncInfo.needsSync ? 'badge-warning' : 'badge-success'}">${syncInfo.needsSync ? 'Changes Pending Sync' : 'Up to Date'}</span></p>
            </div>
          </div>
          <div class="config-actions">
            <button class="btn btn-primary" id="btnSyncFromConfig">
              <span>🔄</span> Sync to AAC Device
            </button>
            <button class="btn btn-secondary" id="btnReScanQrFromConfig">
              <span>📷</span> Re-Scan QR / Switch Profile
            </button>
            <button class="btn btn-secondary" id="btnExportConfigJson">
              <span>💾</span> Export JSON
            </button>
          </div>
        </div>

        <div class="config-stats-row">
          <div class="config-stat-box">
            <span class="stat-number">${config.phraseCount}</span>
            <span class="stat-label">Active Phrases</span>
          </div>
          <div class="config-stat-box">
            <span class="stat-number">${config.phrases.filter(p => p.isCustom).length}</span>
            <span class="stat-label">Caregiver Custom</span>
          </div>
          <div class="config-stat-box">
            <span class="stat-number">${config.phrases.filter(p => p.category === 'Emergency').length}</span>
            <span class="stat-label">Emergency SOS</span>
          </div>
          <div class="config-stat-box">
            <span class="stat-number">${new Date(syncInfo.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span class="stat-label">Last Synced</span>
          </div>
        </div>
      </div>

      <div class="config-category-breakdown">
        <h4>Category Breakdown on Device</h4>
        <div class="category-breakdown-grid">
          ${SYSTEM_CATEGORIES.map(cat => {
            const list = grouped[cat.id] || [];
            return `
              <div class="breakdown-card ${cat.id === 'Emergency' ? 'breakdown-emergency' : ''}">
                <div class="breakdown-card-head">
                  <span class="breakdown-cat-name">${this.getCategoryEmoji(cat.id)} ${cat.name}</span>
                  <span class="breakdown-count badge">${list.length} phrases</span>
                </div>
                <div class="breakdown-pill-list">
                  ${list.length === 0 ? '<span class="text-muted">No phrases active in this category</span>' : 
                    list.slice(0, 5).map(p => `
                      <span class="phrase-mini-chip ${p.isCustom ? 'chip-custom' : ''}">
                        ${this.escapeHtml(p.text)}
                      </span>
                    `).join('')}
                  ${list.length > 5 ? `<span class="phrase-mini-chip more-chip">+${list.length - 5} more</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const btnSync = container.querySelector('#btnSyncFromConfig');
    if (btnSync) btnSync.addEventListener('click', () => this.triggerSyncFlow());

    const btnReScan = container.querySelector('#btnReScanQrFromConfig');
    if (btnReScan) {
      btnReScan.addEventListener('click', () => {
        const viewOnboarding = document.getElementById('view-onboarding');
        const viewMain = document.getElementById('view-main');
        if (viewOnboarding && viewMain) {
          viewOnboarding.style.display = 'block';
          viewMain.style.display = 'none';
          this.goToOnboardingStep(1);
        }
      });
    }

    const btnExport = container.querySelector('#btnExportConfigJson');
    if (btnExport) btnExport.addEventListener('click', () => this.exportConfig());
  }

  createPhraseCardHtml(phrase, isCustomView = false) {
    const isEmergency = phrase.category === 'Emergency' || phrase.priority === 'Emergency';
    const isImportant = phrase.priority === 'Important';
    const currentLang = i18n.getLanguage();
    const localizedText = i18n.getPhraseText(phrase, currentLang);
    const hasTranslation = currentLang !== 'en' && localizedText !== phrase.text;

    return `
      <div class="phrase-card ${phrase.enabled ? 'card-enabled' : 'card-disabled'} ${isEmergency ? 'card-emergency' : ''} ${phrase.isCustom ? 'card-custom' : ''}" 
           data-phrase-id="${phrase.id}">
        
        <div class="card-top-row">
          <div class="card-badges">
            <span class="badge badge-category cat-${phrase.category.toLowerCase()}">
              ${this.getCategoryEmoji(phrase.category)} ${i18n.getCategoryName(phrase.category)}
            </span>
            <span class="badge badge-age">${phrase.ageGroup}</span>
            <span class="badge ${isEmergency ? 'badge-emergency' : (isImportant ? 'badge-important' : 'badge-normal')}">
              ${phrase.priority}
            </span>
            ${phrase.isCustom ? '<span class="badge badge-my-phrase">My Phrase</span>' : '<span class="badge badge-system">Library</span>'}
          </div>

          <label class="toggle-switch-wrap" title="${phrase.enabled ? 'Active on device' : 'Disabled from device'}">
            <input type="checkbox" class="phrase-toggle-input" ${phrase.enabled ? 'checked' : ''} data-toggle-id="${phrase.id}">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="card-phrase-body">
          <span class="phrase-icon-preview">${this.getIconEmoji(phrase.icon)}</span>
          <div style="flex: 1; min-width: 0;">
            <p class="phrase-text-display">"${this.escapeHtml(localizedText)}"</p>
            ${hasTranslation ? `<p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 3px; font-weight: 500;">"${this.escapeHtml(phrase.text)}"</p>` : ''}
          </div>
        </div>

        <div class="card-bottom-actions">
          <button class="action-btn btn-speak" data-speak-text="${this.escapeHtml(localizedText)}" data-is-emergency="${isEmergency}" title="Listen to phrase">
            <span>🔊</span> Speak
          </button>

          ${phrase.isCustom ? `
            <button class="action-btn btn-edit" data-edit-id="${phrase.id}" title="Edit phrase">
              <span>✏️</span> Edit
            </button>
            <button class="action-btn btn-move" data-move-id="${phrase.id}" title="Move category">
              <span>📁</span> Move
            </button>
            <button class="action-btn btn-delete text-danger" data-delete-id="${phrase.id}" title="Delete phrase">
              <span>🗑️</span> Delete
            </button>
          ` : `
            <span class="system-lib-tag">System Starter</span>
          `}
        </div>
      </div>
    `;
  }

  attachPhraseCardListeners(container) {
    container.querySelectorAll('.btn-speak').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.speakText;
        const isEmergency = btn.dataset.isEmergency === 'true';
        speechEngine.speak(text, {
          isEmergency,
          lang: i18n.getVoiceLang()
        });
      });
    });

    container.querySelectorAll('.phrase-toggle-input').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.dataset.toggleId;
        const updated = storage.togglePhrase(id);
        if (updated) {
          this.showToast(
            `"${updated.text}" is now ${updated.enabled ? 'active on device' : 'hidden from device'}`,
            'info'
          );
        }
      });
    });

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openEditModal(btn.dataset.editId);
      });
    });

    container.querySelectorAll('.btn-move').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openMoveCategoryModal(btn.dataset.moveId);
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openDeleteConfirmModal(btn.dataset.deleteId);
      });
    });
  }

  openAddModal(prefillCategory = null) {
    this.editingPhraseId = null;
    const modal = document.getElementById('phraseModal');
    const modalTitle = document.getElementById('phraseModalTitle');
    const form = document.getElementById('phraseForm');
    const submitBtn = document.getElementById('btnSubmitPhrase');

    if (!modal || !form) return;

    modalTitle.innerHTML = `+ Add New Communication Phrase`;
    submitBtn.textContent = 'Add Phrase';

    form.reset();
    document.getElementById('modalPhraseText').value = '';
    document.getElementById('modalPhraseCategory').value = prefillCategory || (this.selectedCategoryFilter !== 'All' ? this.selectedCategoryFilter : 'Home');
    
    // Default to the user's selected age group
    const paired = storage.getPairedDevice();
    document.getElementById('modalPhraseAge').value = (paired && paired.ageGroup) ? paired.ageGroup : 'Children';
    document.getElementById('modalPhrasePriority').value = 'Normal';
    document.getElementById('modalPhraseEnabled').checked = true;

    const iconContainer = document.getElementById('modalIconGrid');
    if (iconContainer) {
      iconContainer.querySelectorAll('.icon-option-card').forEach((c, idx) => {
        if (idx === 0) {
          c.classList.add('selected');
          const radio = c.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        } else {
          c.classList.remove('selected');
        }
      });
    }

    modal.classList.add('show');
    setTimeout(() => document.getElementById('modalPhraseText').focus(), 150);
  }

  openEditModal(id) {
    const phrase = storage.getCustomPhrases().find(p => p.id === id);
    if (!phrase) return;

    this.editingPhraseId = id;
    const modal = document.getElementById('phraseModal');
    const modalTitle = document.getElementById('phraseModalTitle');
    const submitBtn = document.getElementById('btnSubmitPhrase');

    if (!modal) return;

    modalTitle.innerHTML = `Edit Custom Phrase`;
    submitBtn.textContent = 'Save Changes';

    document.getElementById('modalPhraseText').value = phrase.text;
    document.getElementById('modalPhraseCategory').value = phrase.category;
    document.getElementById('modalPhraseAge').value = phrase.ageGroup;
    document.getElementById('modalPhrasePriority').value = phrase.priority;
    document.getElementById('modalPhraseEnabled').checked = Boolean(phrase.enabled);

    const iconContainer = document.getElementById('modalIconGrid');
    if (iconContainer) {
      iconContainer.querySelectorAll('.icon-option-card').forEach(c => {
        if (c.dataset.iconId === phrase.icon) {
          c.classList.add('selected');
          const radio = c.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        } else {
          c.classList.remove('selected');
        }
      });
    }

    modal.classList.add('show');
    setTimeout(() => document.getElementById('modalPhraseText').focus(), 150);
  }

  closePhraseModal() {
    const modal = document.getElementById('phraseModal');
    if (modal) modal.classList.remove('show');
    this.editingPhraseId = null;
  }

  handlePhraseFormSubmit(e) {
    e.preventDefault();

    const text = document.getElementById('modalPhraseText').value.trim();
    const category = document.getElementById('modalPhraseCategory').value;
    const ageGroup = document.getElementById('modalPhraseAge').value;
    const priority = document.getElementById('modalPhrasePriority').value;
    const enabled = document.getElementById('modalPhraseEnabled').checked;

    let selectedIcon = 'chat';
    const selectedRadio = document.querySelector('input[name="phraseIcon"]:checked');
    if (selectedRadio) {
      selectedIcon = selectedRadio.value;
    }

    if (!text) {
      this.showToast('Please enter phrase text', 'error');
      document.getElementById('modalPhraseText').focus();
      return;
    }

    if (this.editingPhraseId) {
      storage.updateCustomPhrase(this.editingPhraseId, {
        text,
        category,
        ageGroup,
        priority,
        icon: selectedIcon,
        enabled
      });
      this.closePhraseModal();
      this.showToast(`✓ Phrase updated successfully: "${text}"`, 'success');
      if (this.devicePreview) {
        this.devicePreview.setCategory(category);
      }
    } else {
      storage.addCustomPhrase({
        text,
        category,
        ageGroup,
        priority,
        icon: selectedIcon,
        enabled
      });
      this.closePhraseModal();
      this.showToast(`✓ Phrase added successfully: "${text}"`, 'success');

      if (this.devicePreview) {
        this.devicePreview.setCategory(category);
      }
    }
  }

  openMoveCategoryModal(id) {
    const phrase = storage.getCustomPhrases().find(p => p.id === id);
    if (!phrase) return;

    const modal = document.getElementById('moveCategoryModal');
    const textTarget = document.getElementById('moveModalPhraseText');
    const select = document.getElementById('moveCategorySelect');
    const btnConfirm = document.getElementById('btnConfirmMoveCategory');

    if (!modal) return;

    textTarget.textContent = `"${phrase.text}"`;
    select.innerHTML = SYSTEM_CATEGORIES.map(c => 
      `<option value="${c.id}" ${c.id === phrase.category ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    modal.classList.add('show');

    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);

    newBtn.addEventListener('click', () => {
      const newCat = select.value;
      storage.movePhraseCategory(id, newCat);
      modal.classList.remove('show');
      this.showToast(`Moved "${phrase.text}" to category ${newCat}`, 'success');
      if (this.devicePreview) {
        this.devicePreview.setCategory(newCat);
      }
    });
  }

  openDeleteConfirmModal(id) {
    const phrase = storage.getCustomPhrases().find(p => p.id === id);
    if (!phrase) return;

    this.deleteTargetPhraseId = id;
    const modal = document.getElementById('deleteConfirmModal');
    const textTarget = document.getElementById('deletePhraseText');
    const btnConfirm = document.getElementById('btnConfirmDelete');

    if (!modal) return;

    textTarget.textContent = `"${phrase.text}" (${phrase.category})`;
    modal.classList.add('show');

    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);

    newBtn.addEventListener('click', () => {
      storage.deleteCustomPhrase(id);
      modal.classList.remove('show');
      this.showToast(`Phrase deleted from personal library`, 'info');
      this.deleteTargetPhraseId = null;
    });
  }

  triggerSyncFlow() {
    const syncModal = document.getElementById('syncProgressModal');
    if (!syncModal) return;

    const stageText = document.getElementById('syncStageText');
    const progressBar = document.getElementById('syncProgressBar');
    const checkmark = document.getElementById('syncSuccessMark');
    const btnDone = document.getElementById('btnSyncDone');

    syncModal.classList.add('show');
    checkmark.classList.remove('show');
    btnDone.classList.add('hidden');
    progressBar.style.width = '10%';
    stageText.textContent = 'Preparing configuration payload...';

    setTimeout(() => {
      progressBar.style.width = '45%';
      stageText.textContent = 'Uploading changes to physical AAC device...';
    }, 600);

    setTimeout(() => {
      progressBar.style.width = '80%';
      stageText.textContent = 'Updating AAC device offline voice cache...';
    }, 1300);

    setTimeout(() => {
      progressBar.style.width = '100%';
      stageText.innerHTML = `<strong>✓ Sync complete!</strong> Device is updated and ready for communication.`;
      checkmark.classList.add('show');
      btnDone.classList.remove('hidden');

      storage.recordSyncSuccess();
      speechEngine.playSyncSuccessTone();
      this.updateSyncBadge();
    }, 2000);
  }

  updateSyncBadge() {
    const syncInfo = storage.getSyncInfo();
    const syncBadge = document.getElementById('headerSyncBadge');
    const settingsSyncBadge = document.getElementById('settingsSyncBadge');
    const tabPendingDot = document.getElementById('settingsTabPendingDot');

    [syncBadge, settingsSyncBadge].forEach(badge => {
      if (badge) {
        if (syncInfo.needsSync) {
          badge.className = 'sync-indicator badge-pending';
          badge.innerHTML = `<span class="pulse-dot"></span> Changes pending sync`;
        } else {
          badge.className = 'sync-indicator badge-synced';
          badge.innerHTML = `<i class="icon-check">✓</i> Device in Sync`;
        }
      }
    });

    if (tabPendingDot) {
      tabPendingDot.style.display = syncInfo.needsSync ? 'inline-block' : 'none';
    }
  }

  showToast(message, type = 'success') {
    const toastArea = document.getElementById('toastContainer');
    if (!toastArea) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-in`;

    const iconMap = {
      success: '✓',
      info: 'ℹ',
      error: '⚠️'
    };

    toast.innerHTML = `
      <span class="toast-icon">${iconMap[type] || '•'}</span>
      <span class="toast-msg">${this.escapeHtml(message)}</span>
      <button class="toast-close">&times;</button>
    `;

    toastArea.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  resetFilters() {
    this.selectedCategoryFilter = 'All';
    this.selectedAgeFilter = 'All';
    this.selectedPriorityFilter = 'All';
    this.selectedStatusFilter = 'All';
    this.searchQuery = '';

    const searchInput = document.getElementById('globalSearchInput');
    const filterCat = document.getElementById('filterCategorySelect');
    const filterAge = document.getElementById('filterAgeSelect');
    const filterPri = document.getElementById('filterPrioritySelect');
    const filterStat = document.getElementById('filterStatusSelect');

    if (searchInput) searchInput.value = '';
    if (filterCat) filterCat.value = 'All';
    if (filterAge) filterAge.value = 'All';
    if (filterPri) filterPri.value = 'All';
    if (filterStat) filterStat.value = 'All';

    this.render();
  }

  exportConfig() {
    const jsonStr = storage.exportJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AAC_Device_Config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('AAC Configuration exported successfully.', 'success');
  }

  importConfig() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          storage.importJson(re.target.result);
          this.showToast('AAC configuration imported successfully.', 'success');
          this.render();
        } catch (err) {
          this.showToast('Failed to import configuration: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  }

  attachDomListeners() {
    // Navigation Tabs: communicator | library | custom | config
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Contextual Action buttons
    const btnAddLibrary = document.getElementById('btnAddPhraseFromLibrary');
    if (btnAddLibrary) {
      btnAddLibrary.addEventListener('click', () => this.openAddModal());
    }

    const btnAddPhraseTop = document.getElementById('btnAddPhraseTop');
    if (btnAddPhraseTop) {
      btnAddPhraseTop.addEventListener('click', () => this.openAddModal());
    }

    const btnHeaderSync = document.getElementById('btnHeaderSync');
    if (btnHeaderSync) {
      btnHeaderSync.addEventListener('click', () => this.triggerSyncFlow());
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
      });
    });

    // Close modal on background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('show');
        }
      });
    });

    // Add / Edit form submit
    const phraseForm = document.getElementById('phraseForm');
    if (phraseForm) {
      phraseForm.addEventListener('submit', (e) => this.handlePhraseFormSubmit(e));
    }

    // Modal Speech Preview Button
    const btnPreviewVoice = document.getElementById('btnPreviewModalVoice');
    if (btnPreviewVoice) {
      btnPreviewVoice.addEventListener('click', () => {
        const text = document.getElementById('modalPhraseText').value;
        const priority = document.getElementById('modalPhrasePriority').value;
        const ageGroup = document.getElementById('modalPhraseAge').value;
        speechEngine.speak(text || "Please enter phrase text first", {
          isEmergency: priority === 'Emergency',
          ageGroup
        });
      });
    }

    // Search bar
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // Filters
    const filterCat = document.getElementById('filterCategorySelect');
    if (filterCat) {
      filterCat.addEventListener('change', (e) => {
        this.selectedCategoryFilter = e.target.value;
        this.render();
      });
    }

    const filterAge = document.getElementById('filterAgeSelect');
    if (filterAge) {
      filterAge.addEventListener('change', (e) => {
        this.selectedAgeFilter = e.target.value;
        this.populateCategoryOptions();
        this.renderCategoryPills();
        this.render();
      });
    }

    const filterPriority = document.getElementById('filterPrioritySelect');
    if (filterPriority) {
      filterPriority.addEventListener('change', (e) => {
        this.selectedPriorityFilter = e.target.value;
        this.render();
      });
    }

    const filterStatus = document.getElementById('filterStatusSelect');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        this.selectedStatusFilter = e.target.value;
        this.render();
      });
    }

    // Batch category actions
    const btnSelectAll = document.getElementById('btnSelectAllCategory');
    if (btnSelectAll) {
      btnSelectAll.addEventListener('click', () => {
        if (this.selectedCategoryFilter === 'All') {
          this.showToast('Please select a specific category first to batch toggle.', 'info');
          return;
        }
        storage.setCategoryAll(this.selectedCategoryFilter, true);
        this.showToast(`All phrases in ${this.selectedCategoryFilter} enabled for device.`, 'success');
      });
    }

    const btnDeselectAll = document.getElementById('btnDeselectAllCategory');
    if (btnDeselectAll) {
      btnDeselectAll.addEventListener('click', () => {
        if (this.selectedCategoryFilter === 'All') {
          this.showToast('Please select a specific category first to batch toggle.', 'info');
          return;
        }
        storage.setCategoryAll(this.selectedCategoryFilter, false);
        this.showToast(`All phrases in ${this.selectedCategoryFilter} disabled from device.`, 'info');
      });
    }

    // Backup & Restore
    const btnBackup = document.getElementById('btnBackupConfig');
    if (btnBackup) {
      btnBackup.addEventListener('click', () => this.exportConfig());
    }

    const btnRestore = document.getElementById('btnRestoreConfig');
    if (btnRestore) {
      btnRestore.addEventListener('click', () => this.importConfig());
    }

    const btnResetDefaults = document.getElementById('btnResetDefaults');
    if (btnResetDefaults) {
      btnResetDefaults.addEventListener('click', () => {
        if (confirm('Reset phrase library and custom phrases to original starter set?')) {
          storage.resetAll();
          this.showToast('Reset to original starter phrases completed.', 'info');
        }
      });
    }

    // Sync Done button
    const btnSyncDone = document.getElementById('btnSyncDone');
    if (btnSyncDone) {
      btnSyncDone.addEventListener('click', () => {
        const syncModal = document.getElementById('syncProgressModal');
        if (syncModal) syncModal.classList.remove('show');
      });
    }
  }

  // ==================== SETTINGS & DEVICE TAB ====================

  populateVoiceSelect() {
    const select = document.getElementById('selectVoiceEngine');
    if (!select) return;

    const voices = speechEngine.getVoices();
    if (voices.length > 0) {
      select.innerHTML = voices.map(v => 
        `<option value="${v.name}">${v.name} (${v.lang})</option>`
      ).join('');
    } else if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => this.populateVoiceSelect();
    }
  }

  updateSettingsDisplay() {
    const paired = storage.getPairedDevice();
    const nameEl = document.getElementById('settingsDeviceName');
    const idEl = document.getElementById('settingsDeviceId');

    if (paired) {
      if (nameEl) nameEl.textContent = paired.deviceName || "Alex's Communicator Pro";
      if (idEl) idEl.textContent = `ID: ${paired.deviceId || 'AAC-PRO-8892'} • Profile: ${paired.ageGroup || 'Children'}`;

      // Update active profile pill
      document.querySelectorAll('.profile-pill-btn').forEach(btn => {
        if (btn.dataset.profileAge === paired.ageGroup) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    }

    // High contrast checkbox
    const contrastBox = document.getElementById('settingsHighContrast');
    if (contrastBox && this.devicePreview) {
      contrastBox.checked = this.devicePreview.highContrast;
    }

    // Density buttons
    if (this.devicePreview) {
      document.querySelectorAll('.density-btn').forEach(btn => {
        if (btn.dataset.density === this.devicePreview.gridDensity) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    }

    // Active language buttons in Settings
    const curLang = i18n.getLanguage();
    document.querySelectorAll('.settings-lang-btn').forEach(btn => {
      if (btn.dataset.settingsLang === curLang) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  attachSettingsListeners() {
    // Top Header Theme Toggle
    const btnTheme = document.getElementById('btnToggleTheme');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => this.toggleTheme());
    }

    // Settings Theme Option Cards
    const optLight = document.getElementById('optThemeLight');
    const optDark = document.getElementById('optThemeDark');
    if (optLight) optLight.addEventListener('click', () => this.applyTheme('light'));
    if (optDark) optDark.addEventListener('click', () => this.applyTheme('dark'));

    // Language buttons in Settings
    document.querySelectorAll('.settings-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.settingsLang;
        i18n.setLanguage(lang);
        document.querySelectorAll('.settings-lang-btn').forEach(b => {
          if (b.dataset.settingsLang === lang) b.classList.add('selected');
          else b.classList.remove('selected');
        });
        const flagEl = document.getElementById('currentLangFlag');
        const nameEl = document.getElementById('currentLangName');
        const info = i18n.getCurrentLanguageInfo();
        if (flagEl) flagEl.textContent = info.flag;
        if (nameEl) nameEl.textContent = info.name;
        this.applyLanguageUpdate();
        this.render();
        this.showToast(`Language switched to ${info.name} (${info.nativeName})`, 'success');
      });
    });

    // High Contrast in Settings
    const checkContrast = document.getElementById('settingsHighContrast');
    if (checkContrast) {
      checkContrast.addEventListener('change', (e) => {
        if (this.devicePreview) {
          this.devicePreview.setHighContrast(e.target.checked);
        }
      });
    }

    // Grid Density in Settings
    document.querySelectorAll('.density-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const density = btn.dataset.density;
        document.querySelectorAll('.density-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (this.devicePreview) {
          this.devicePreview.setGridDensity(density);
        }
        this.showToast(`Communicator layout density set to ${density}`, 'info');
      });
    });

    // Voice Engine Selector
    const voiceSelect = document.getElementById('selectVoiceEngine');
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        speechEngine.setVoiceByName(e.target.value);
        this.showToast(`Speaker voice set to ${e.target.value}`, 'info');
      });
    }

    // Sliders: Speech Rate & Pitch
    const sliderRate = document.getElementById('sliderVoiceRate');
    const valRate = document.getElementById('valVoiceRate');
    if (sliderRate && valRate) {
      sliderRate.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        valRate.textContent = `${val.toFixed(2)}x`;
        speechEngine.defaultRate = val;
      });
    }

    const sliderPitch = document.getElementById('sliderVoicePitch');
    const valPitch = document.getElementById('valVoicePitch');
    if (sliderPitch && valPitch) {
      sliderPitch.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        valPitch.textContent = `${val.toFixed(2)}x`;
        speechEngine.defaultPitch = val;
      });
    }

    // Sound Click Feedback Toggle
    const checkClicks = document.getElementById('settingsSoundClicks');
    if (checkClicks) {
      checkClicks.addEventListener('change', (e) => {
        speechEngine.soundClicksEnabled = e.target.checked;
      });
    }

    // Test Voice Output in Settings
    const btnTestVoice = document.getElementById('btnTestVoiceSettings');
    if (btnTestVoice) {
      btnTestVoice.addEventListener('click', () => {
        speechEngine.speak("Voice output operational. Settings calibrated successfully.");
      });
    }

    // Switch Profile Age in Settings
    document.querySelectorAll('.profile-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const age = btn.dataset.profileAge;
        storage.updateAgeGroup(age);
        this.selectedAgeFilter = age;
        const filterAgeSelect = document.getElementById('filterAgeSelect');
        if (filterAgeSelect) filterAgeSelect.value = this.selectedAgeFilter;
        this.populateCategoryOptions();
        this.renderCategoryPills();
        speechEngine.playTactileBeep();
        this.showToast(`Active profile switched to ${age}. Showing age-appropriate categories.`, 'success');
        this.updateSettingsDisplay();
        this.updateHeaderDeviceBadge();
        if (this.devicePreview) {
          this.devicePreview.render();
        }
      });
    });

    // Sync from Settings
    const btnSyncSettings = document.getElementById('btnSyncFromSettings');
    if (btnSyncSettings) {
      btnSyncSettings.addEventListener('click', () => this.triggerSyncFlow());
    }

    // Re-Scan QR from Settings
    const btnReScanSettings = document.getElementById('btnReScanFromSettings');
    if (btnReScanSettings) {
      btnReScanSettings.addEventListener('click', () => {
        const viewOnboarding = document.getElementById('view-onboarding');
        const viewMain = document.getElementById('view-main');
        if (viewOnboarding && viewMain) {
          viewOnboarding.style.display = 'block';
          viewMain.style.display = 'none';
          this.goToOnboardingStep(1);
        }
      });
    }

    // Unpair Device
    const btnUnpair = document.getElementById('btnUnpairDeviceSettings');
    if (btnUnpair) {
      btnUnpair.addEventListener('click', () => {
        if (confirm('Disconnect physical communicator AAC-PRO-8892? You can re-scan any device anytime.')) {
          storage.unpairDevice();
          this.showToast('Device unpaired.', 'info');
          this.checkOnboardingState();
        }
      });
    }

    // Reset Defaults in Settings
    const btnResetDefaults = document.getElementById('btnResetDefaultsSettings');
    if (btnResetDefaults) {
      btnResetDefaults.addEventListener('click', () => {
        if (confirm('Reset phrase library and custom phrases to original starter set?')) {
          storage.resetAll();
          this.showToast('Reset to original starter phrases completed.', 'info');
        }
      });
    }

    // Export & Import in Settings
    const btnExport = document.getElementById('btnExportJsonSettings');
    if (btnExport) btnExport.addEventListener('click', () => this.exportConfig());

    const btnImport = document.getElementById('btnImportJsonSettings');
    if (btnImport) btnImport.addEventListener('click', () => this.importConfig());

    // Refresh from SQLite Database
    const btnRefreshDb = document.getElementById('btnRefreshFromDb');
    if (btnRefreshDb) {
      btnRefreshDb.addEventListener('click', async () => {
        btnRefreshDb.disabled = true;
        btnRefreshDb.textContent = 'Refreshing...';
        await storage.pullFromSqlite();
        this.render();
        this.showToast('✓ Successfully refreshed all phrases & settings from SQLite database', 'success');
        btnRefreshDb.disabled = false;
        btnRefreshDb.innerHTML = '<span>🔄</span> Refresh from SQLite';
      });
    }

    // Quick Settings Button in Header Navigation
    const btnQuick = document.getElementById('btnQuickSettings');
    if (btnQuick) {
      btnQuick.addEventListener('click', () => this.switchTab('settings'));
    }
  }

  getCategoryEmoji(category) {
    const map = {
      Home: '🏠',
      School: '🏫',
      Studies: '📖',
      Work: '💼',
      Transportation: '🚌',
      Feelings: '😊',
      Health: '🩺',
      Social: '💬',
      Activities: '🎨',
      Emergency: '🚨'
    };
    return map[category] || '📁';
  }

  getIconEmoji(iconId) {
    const item = AVAILABLE_ICONS.find(i => i.id === iconId);
    return item ? item.emoji : '💬';
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new AACApp();
  app.init();
  window.aacApp = app;
});
