// Interactive Real-Time AAC Device Preview Engine
import { storage } from './storage.js';
import { speechEngine } from './speech.js';
import { SYSTEM_CATEGORIES, AVAILABLE_ICONS } from './data.js';
import { i18n } from './i18n.js';

export class DevicePreview {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentCategory = 'Home';
    this.lastSpokenText = i18n.getCoreWord('READY');
    this.isSpeaking = false;
    this.gridDensity = '3x3';
    this.highContrast = false;

    // Listen to speech states
    speechEngine.onSpeechStateChange((isSpeaking, text) => {
      this.isSpeaking = isSpeaking;
      if (text) this.lastSpokenText = text;
      this.updateSpeechBar();
    });

    // Listen to storage changes
    storage.subscribe(() => {
      this.render();
    });

    // Listen to language changes
    i18n.subscribe(() => {
      this.lastSpokenText = i18n.getCoreWord('READY');
      this.render();
    });
  }

  setCategory(category) {
    this.currentCategory = category;
    this.render();
  }

  setGridDensity(density) {
    this.gridDensity = density;
    this.render();
  }

  setHighContrast(enabled) {
    this.highContrast = enabled;
    this.render();
  }

  getIconEmoji(iconId) {
    const item = AVAILABLE_ICONS.find(i => i.id === iconId);
    return item ? item.emoji : '💬';
  }

  render() {
    if (!this.container) return;

    const paired = storage.getPairedDevice();
    const currentAge = (paired && paired.ageGroup) ? paired.ageGroup : 'Children';
    const currentLang = i18n.getLanguage();

    // 1. Filter categories by active Age Group (e.g., Children do NOT see Work)
    const allowedCategories = i18n.getCategoriesForAge(currentAge, SYSTEM_CATEGORIES);

    // If currentCategory is not allowed for this age, reset to the first allowed category (e.g. Home)
    if (!allowedCategories.some(c => c.id === this.currentCategory)) {
      this.currentCategory = allowedCategories[0] ? allowedCategories[0].id : 'Home';
    }

    const allPhrases = storage.getAllPhrases();
    const allowedCatIds = new Set(allowedCategories.map(c => c.id));
    const activePhrases = allPhrases.filter(p => {
      if (!p.enabled) return false;
      if (currentAge !== 'All Ages' && !allowedCatIds.has(p.category)) return false;
      if (currentAge === 'All Ages') return true;
      return p.ageGroup === 'All Ages' || p.ageGroup === currentAge;
    });

    // Active category phrases
    const categoryPhrases = activePhrases.filter(p => p.category === this.currentCategory);

    // Categories with phrase counts for active age
    const categoriesWithCounts = allowedCategories.map(cat => ({
      ...cat,
      count: activePhrases.filter(p => p.category === cat.id).length
    }));

    // Emergency count for active age
    const emergencyCount = activePhrases.filter(p => p.category === 'Emergency').length;

    // Build DOM structure
    this.container.innerHTML = `
      <div class="aac-tablet-bezel ${this.highContrast ? 'mode-high-contrast' : ''}">
        <!-- Physical Hardware elements -->
        <div class="hardware-top-notch">
          <span class="camera-lens"></span>
          <span class="ambient-sensor"></span>
          <span class="speaker-grill"></span>
        </div>

        <!-- Touch Screen Surface -->
        <div class="aac-screen">
          <!-- Pairing QR Modal Overlay -->
          <div class="device-qr-overlay" id="deviceQrOverlay" style="display: none;">
            <div class="device-qr-card">
              <button class="device-qr-close-btn" id="btnDeviceCloseQr" aria-label="Close QR Modal">✕</button>
              <div class="device-qr-icon">📲</div>
              <h3 class="device-qr-title">Pair AAC Device</h3>
              <p class="device-qr-subtitle">Scan this code from your mobile or laptop Caregiver Suite to connect.</p>
              
              <div class="device-qr-image-wrap">
                <img src="assets/device_qr_sample.svg" alt="Device Hardware QR Code" class="device-qr-code-img">
                <div class="device-qr-scan-line"></div>
              </div>

              <div class="device-qr-id-pill">
                <span>Device ID:</span>
                <strong>${(paired && paired.deviceId) ? paired.deviceId : 'AAC-PRO-8892'}</strong>
              </div>

              <div class="device-qr-status-indicator">
                <span class="pulse-dot-green"></span> Ready for Caregiver Connection
              </div>
            </div>
          </div>

          <!-- System Status Bar -->
          <div class="device-status-bar">
            <div class="status-left">
              <span class="device-brand-tag"><i class="icon-chip"></i> AAC-Pro Go</span>
              <span class="status-clock" id="deviceClock">12:00</span>
            </div>
            <div class="status-right">
              <button class="device-status-qr-btn" id="btnDeviceShowQr" title="Show Device QR Code for Caregiver Connection">
                <span class="qr-btn-icon">📲</span> QR Code
              </button>
              <span class="status-item device-age-indicator" title="Categories filtered for ${currentAge}">
                🧒 ${currentAge} (${allowedCategories.length} cats)
              </span>
              <span class="status-item battery-pill"><i class="icon-battery"></i> 98%</span>
            </div>
          </div>

          <!-- AAC Speech Display Ribbon (Message Window) -->
          <div class="aac-speech-ribbon ${this.isSpeaking ? 'speaking-active' : ''}">
            <div class="speech-content-wrap">
              <span class="speech-icon-bubble">🗣️</span>
              <div class="speech-text-box" id="deviceSpeechOutput">
                <span class="speech-text-val">${this.escapeHtml(this.lastSpokenText)}</span>
              </div>
            </div>
            <div class="speech-ribbon-actions">
              <button class="ribbon-btn speak-again-btn" id="btnSpeakAgain" title="Speak Message Again">
                <i class="icon-volume"></i> ${i18n.getCoreWord('SPEAK')}
              </button>
              <button class="ribbon-btn clear-btn" id="btnClearSpeech" title="Clear Display">
                <i class="icon-trash"></i> ${i18n.getCoreWord('CLEAR')}
              </button>
            </div>
          </div>

          <!-- Quick Emergency Banner (Persistent Access) -->
          <div class="aac-emergency-quickbar ${this.currentCategory === 'Emergency' ? 'active-sos' : ''}" id="btnDeviceSosQuick">
            <div class="sos-pill-left">
              <span class="sos-pulse-dot"></span>
              <strong>${i18n.getCoreWord('SOS_TITLE')}</strong>
              <span class="sos-counter">${emergencyCount} urgent phrases</span>
            </div>
            <button class="sos-action-btn">
              ${this.currentCategory === 'Emergency' ? i18n.getCoreWord('VIEWING_SOS') : i18n.getCoreWord('SOS_ACTION')}
            </button>
          </div>

          <!-- Category Navigation Tabs Ribbon inside AAC Device (Age-filtered) -->
          <div class="device-category-scroll">
            <div class="device-category-tabs">
              ${categoriesWithCounts.map(cat => `
                <button class="dev-cat-tab ${cat.id === this.currentCategory ? 'active' : ''} ${cat.id === 'Emergency' ? 'tab-emergency' : ''}" 
                        data-category="${cat.id}">
                  <span class="dev-cat-icon">${this.getCategoryEmoji(cat.id)}</span>
                  <span class="dev-cat-name">${i18n.getCategoryName(cat.id)}</span>
                  <span class="dev-cat-badge">${cat.count}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Phrase Tiles Grid -->
          <div class="aac-phrase-grid grid-${this.gridDensity}">
            ${categoryPhrases.length === 0 ? `
              <div class="device-empty-category">
                <span class="empty-icon">📭</span>
                <h4>No phrases enabled in ${this.escapeHtml(i18n.getCategoryName(this.currentCategory))}</h4>
                <p>Caregivers can enable or create phrases for this age group in the library.</p>
              </div>
            ` : categoryPhrases.map(phrase => {
              const localizedText = i18n.getPhraseText(phrase, currentLang);
              const showSubtitle = currentLang !== 'en' && phrase.text !== localizedText;

              return `
                <button class="aac-tile ${phrase.priority === 'Emergency' ? 'priority-emergency' : (phrase.priority === 'Important' ? 'priority-important' : 'priority-normal')} ${phrase.isCustom ? 'tile-custom' : ''}" 
                        data-phrase-id="${phrase.id}" 
                        data-spoken-text="${this.escapeHtml(localizedText)}"
                        data-priority="${phrase.priority}"
                        data-age="${phrase.ageGroup}">
                  <div class="tile-top-meta">
                    <span class="tile-icon">${this.getIconEmoji(phrase.icon)}</span>
                    ${phrase.priority === 'Emergency' ? '<span class="tile-badge-sos">SOS</span>' : (phrase.priority === 'Important' ? '<span class="tile-badge-imp">!</span>' : '')}
                    ${phrase.isCustom ? '<span class="tile-badge-custom" title="Caregiver Custom Phrase">My Phrase</span>' : ''}
                  </div>
                  <div class="tile-text">${this.escapeHtml(localizedText)}</div>
                  ${showSubtitle ? `<div class="tile-subtext">${this.escapeHtml(phrase.text)}</div>` : ''}
                  <span class="tile-tap-wave"></span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Tactile Core Quick Utterances (YES / NO / PLEASE / THANK YOU / HELP / STOP) -->
          <div class="device-quick-core-bar">
            <button class="core-btn core-yes" data-core-key="YES">
              <span>👍</span> ${i18n.getCoreWord('YES')}
            </button>
            <button class="core-btn core-no" data-core-key="NO">
              <span>👎</span> ${i18n.getCoreWord('NO')}
            </button>
            <button class="core-btn core-please" data-core-key="PLEASE">
              <span>🙏</span> ${i18n.getCoreWord('PLEASE')}
            </button>
            <button class="core-btn core-thanks" data-core-key="THANK_YOU">
              <span>❤️</span> ${i18n.getCoreWord('THANK_YOU')}
            </button>
            <button class="core-btn core-help" data-core-key="HELP">
              <span>🆘</span> ${i18n.getCoreWord('HELP')}
            </button>
            <button class="core-btn core-stop" data-core-key="STOP">
              <span>🛑</span> ${i18n.getCoreWord('STOP')}
            </button>
          </div>
        </div>

        <!-- Physical Home Indicator Bar -->
        <div class="hardware-bottom-bar">
          <div class="home-indicator"></div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.updateClock();
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

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  updateSpeechBar() {
    const textSpan = this.container.querySelector('.speech-text-val');
    const ribbon = this.container.querySelector('.aac-speech-ribbon');
    if (textSpan) {
      textSpan.textContent = this.lastSpokenText;
    }
    if (ribbon) {
      if (this.isSpeaking) {
        ribbon.classList.add('speaking-active');
      } else {
        ribbon.classList.remove('speaking-active');
      }
    }
  }

  updateClock() {
    const clock = this.container.querySelector('#deviceClock');
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  attachEventListeners() {
    // Category tabs
    this.container.querySelectorAll('.dev-cat-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        if (cat) {
          speechEngine.playTactileBeep();
          this.setCategory(cat);
        }
      });
    });

    // Emergency quick SOS bar
    const sosBar = this.container.querySelector('#btnDeviceSosQuick');
    if (sosBar) {
      sosBar.addEventListener('click', () => {
        speechEngine.playEmergencyAlertTone();
        this.setCategory('Emergency');
      });
    }

    // Phrase Tiles
    this.container.querySelectorAll('.aac-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const spokenText = tile.dataset.spokenText;
        const priority = tile.dataset.priority;
        const ageGroup = tile.dataset.age;

        // Visual animation
        tile.classList.add('tile-pressed');
        setTimeout(() => tile.classList.remove('tile-pressed'), 300);

        // Speak aloud in selected language
        speechEngine.speak(spokenText, {
          isEmergency: priority === 'Emergency',
          ageGroup,
          lang: i18n.getVoiceLang()
        });
      });
    });

    // Core buttons (Yes, No, Please, etc.)
    this.container.querySelectorAll('.core-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.coreKey;
        const spokenText = i18n.getCoreWord(key);
        btn.classList.add('core-pressed');
        setTimeout(() => btn.classList.remove('core-pressed'), 250);
        speechEngine.speak(spokenText, {
          isEmergency: key === 'HELP',
          lang: i18n.getVoiceLang()
        });
      });
    });

    // Speech ribbon buttons
    const btnSpeakAgain = this.container.querySelector('#btnSpeakAgain');
    if (btnSpeakAgain) {
      btnSpeakAgain.addEventListener('click', () => {
        speechEngine.speak(this.lastSpokenText, {
          lang: i18n.getVoiceLang()
        });
      });
    }

    const btnClearSpeech = this.container.querySelector('#btnClearSpeech');
    if (btnClearSpeech) {
      btnClearSpeech.addEventListener('click', () => {
        speechEngine.stop();
        this.lastSpokenText = '';
        this.updateSpeechBar();
      });
    }

    // Small persistent QR button & modal on device
    const btnShowQr = this.container.querySelector('#btnDeviceShowQr');
    const qrOverlay = this.container.querySelector('#deviceQrOverlay');
    const btnCloseQr = this.container.querySelector('#btnDeviceCloseQr');

    if (btnShowQr && qrOverlay) {
      btnShowQr.addEventListener('click', (e) => {
        e.stopPropagation();
        qrOverlay.style.display = 'flex';
        speechEngine.playTactileBeep();
      });
    }

    if (btnCloseQr && qrOverlay) {
      btnCloseQr.addEventListener('click', (e) => {
        e.stopPropagation();
        qrOverlay.style.display = 'none';
      });
    }

    if (qrOverlay) {
      qrOverlay.addEventListener('click', (e) => {
        if (e.target === qrOverlay) {
          qrOverlay.style.display = 'none';
        }
      });
    }
  }
}
