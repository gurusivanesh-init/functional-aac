// Real Optical QR Code Scanner Engine using jsQR & BarcodeDetector

export class QRScannerService {
  constructor({ videoElement, canvasElement, onScanSuccess, onStatusChange }) {
    this.video = videoElement;
    this.canvas = canvasElement || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.onScanSuccess = onScanSuccess || (() => {});
    this.onStatusChange = onStatusChange || (() => {});

    this.stream = null;
    this.scanning = false;
    this.animationFrameId = null;

    // Native BarcodeDetector if supported by modern browser
    this.barcodeDetector = null;
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        this.barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch (e) {
        this.barcodeDetector = null;
      }
    }
  }

  // Start real webcam camera scanning
  async startCamera() {
    this.stopCamera();

    try {
      this.onStatusChange('requesting', 'Requesting camera access...');
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      this.video.setAttribute('playsinline', 'true');
      this.video.style.display = 'block';

      await this.video.play();
      this.scanning = true;
      this.onStatusChange('active', 'Camera active. Point at any QR code...');

      // Start continuous scan loop
      this.scanLoop();
      return true;
    } catch (err) {
      console.warn('Camera stream error:', err);
      let userMsg = 'Camera access was denied or not found.';
      if (err.name === 'NotAllowedError') {
        userMsg = 'Camera permission denied. Please allow camera or upload a QR image.';
      } else if (err.name === 'NotFoundError') {
        userMsg = 'No camera found on this device. You can upload a QR image.';
      }
      this.onStatusChange('error', userMsg);
      throw err;
    }
  }

  stopCamera() {
    this.scanning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
  }

  // Scanning loop running per animation frame
  scanLoop() {
    if (!this.scanning) return;

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

      // 1. Try pure JS QR decoder (jsQR)
      if (typeof window.jsQR === 'function') {
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data && code.data.trim()) {
          this.handleQrFound(code.data.trim(), code.location);
          return;
        }
      }

      // 2. Fallback to native BarcodeDetector if available
      if (this.barcodeDetector) {
        this.barcodeDetector.detect(this.canvas)
          .then(barcodes => {
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              this.handleQrFound(barcodes[0].rawValue.trim());
            }
          })
          .catch(() => {});
      }
    }

    if (this.scanning) {
      this.animationFrameId = requestAnimationFrame(() => this.scanLoop());
    }
  }

  handleQrFound(decodedData, location = null) {
    this.stopCamera();
    this.onStatusChange('found', `QR Code successfully read: ${decodedData}`);
    this.onScanSuccess(decodedData, location);
  }

  // Decode a QR code from an Image File or URL
  decodeImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          this.ctx.drawImage(img, 0, 0);

          const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
          let result = null;

          if (typeof window.jsQR === 'function') {
            const code = window.jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              result = code.data.trim();
            }
          }

          if (result) {
            this.handleQrFound(result);
            resolve(result);
          } else {
            reject(new Error('No readable QR code found in this image.'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  }

  // Decode an image directly from an image element or image source
  decodeImageSource(imgSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.canvas.width = img.naturalWidth || img.width;
        this.canvas.height = img.naturalHeight || img.height;
        this.ctx.drawImage(img, 0, 0);

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let result = null;

        if (typeof window.jsQR === 'function') {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            result = code.data.trim();
          }
        }

        if (result) {
          this.handleQrFound(result);
          resolve(result);
        } else {
          reject(new Error('Could not decode QR code from image.'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load sample image.'));
      img.src = imgSrc;
    });
  }
}
