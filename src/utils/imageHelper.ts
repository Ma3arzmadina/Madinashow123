export const DEFAULT_TRUCK_IMAGE =
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80';

export interface PhotoPreset {
  name: string;
  make: string;
  url: string;
}

export const TRUCK_PHOTO_PRESETS: PhotoPreset[] = [
  {
    name: 'Mercedes Actros Silver',
    make: 'Mercedes-Benz',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Volvo FH 500 Blue',
    make: 'Volvo',
    url: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Scania R450 Red',
    make: 'Scania',
    url: 'https://images.unsplash.com/photo-1586191582056-a607871b69f8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'MAN TGX White',
    make: 'MAN',
    url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'DAF XF Highline',
    make: 'DAF',
    url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Commercial Heavy Hauler',
    make: 'Other',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  },
];

/**
 * Compresses an image file from the user's phone or computer into a lightweight data URL
 * so it saves smoothly in Firestore and loads instantly.
 */
export async function compressImageFile(file: File, maxWidth = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if an image URL can actually be loaded by the browser.
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url || !url.startsWith('http')) return false;
  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    setTimeout(() => resolve(false), 5000); // 5s timeout
  });
}
