"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";

interface Props {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (croppedBase64: string) => void;
}

export default function ImageCropper({
  imageSrc,
  onCancel,
  onCropComplete,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [imageSrc]);

  const onCropChange = (crop: any) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteInternal = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const getCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    const base64 = canvas.toDataURL("image/jpeg");
    onCropComplete(base64);
  }, [croppedAreaPixels, imageSrc, onCropComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-[90%] max-w-lg rounded-xl bg-white p-4 shadow-lg">
        <div className="relative h-75 w-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // 1:1 square for avatar
            cropShape="round" // make crop box circle
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteInternal}
            showGrid={false} // hide default grid
          />

          {/* Circle overlay inside crop area */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-white/20"
            style={{ width: 120, height: 120 }}
          />
        </div>

        {/* Controls */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={getCroppedImage}
            className="bg-linear-to-r from-[#DE4646] to-[#B72D2D]  rounded-lg px-4 py-2 text-white"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// helper to load image
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.src = url;
  });
}
