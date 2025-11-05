import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateVirtualTryOn } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import type { ClothingItem } from '../types';
import { VTOStatus } from '../types';

interface TryOnStudioProps {
  selectedClothing: ClothingItem | null;
}

const statusMessages: Record<VTOStatus, string> = {
    [VTOStatus.IDLE]: '',
    [VTOStatus.UPLOADING]: 'Membaca gambar...',
    [VTOStatus.GENERATING]: 'AI sedang bekerja... Proses ini mungkin memakan waktu beberapa saat.',
    [VTOStatus.SUCCESS]: 'Berhasil! Unduh hasilnya di bawah.',
    [VTOStatus.ERROR]: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
};

export const TryOnStudio: React.FC<TryOnStudioProps> = ({ selectedClothing }) => {
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<VTOStatus>(VTOStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      closeCamera();
      setPersonImageFile(file);
      setGeneratedImage(null);
      setStatus(VTOStatus.IDLE);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = useCallback(async () => {
    if (!personImageFile || !selectedClothing) {
      setError("Silakan unggah foto dan pilih pakaian adat terlebih dahulu.");
      return;
    }
    
    setError(null);
    setGeneratedImage(null);
    setStatus(VTOStatus.UPLOADING);

    try {
      const personImageBase64 = await fileToBase64(personImageFile);
      setStatus(VTOStatus.GENERATING);
      const result = await generateVirtualTryOn(personImageBase64, selectedClothing);
      setGeneratedImage(result);
      setStatus(VTOStatus.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Gagal menghasilkan gambar.");
      setStatus(VTOStatus.ERROR);
    }
  }, [personImageFile, selectedClothing]);

  const openCamera = async () => {
      if (isCameraOpen) return;
      setError(null);
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          setPersonImagePreview(null);
          setPersonImageFile(null);
          setGeneratedImage(null);
          setStatus(VTOStatus.IDLE);
          setIsCameraOpen(true);
          streamRef.current = stream;
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
      } catch (err) {
          console.error("Error accessing camera:", err);
          setError("Tidak bisa mengakses kamera. Pastikan Anda memberikan izin pada browser.");
      }
  };
  
  const closeCamera = useCallback(() => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
      streamRef.current = null;
  }, []);

  const capturePhoto = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(blob => {
                  if (blob) {
                      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                      setPersonImageFile(file);
                      setPersonImagePreview(URL.createObjectURL(file));
                  }
              }, 'image/jpeg');
          }
          closeCamera();
      }
  };

  const handleDownload = () => {
    if (!generatedImage || !selectedClothing) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    
    const clothingName = selectedClothing.name.replace(/\s+/g, '_');
    const fileExtension = generatedImage.split(';')[0].split('/')[1] || 'png';
    link.download = `WastraNusa_TryOn_${clothingName}.${fileExtension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);
  
  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, [closeCamera]);

  return (
    <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Input Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-lg p-1 h-80 bg-white overflow-hidden">
          {isCameraOpen ? (
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-md" />
          ) : personImagePreview ? (
            <img src={personImagePreview} alt="User" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
             <div className="text-center text-stone-500 p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="mt-2">Unggah Foto Anda</p>
                <p className="text-xs">atau gunakan kamera</p>
             </div>
          )}
        </div>

        {/* Output Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-lg p-2 h-80 bg-white">
          {status === VTOStatus.GENERATING ? (
            <div className="text-center text-stone-500">
                <svg className="animate-spin h-10 w-10 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 font-semibold">AI sedang bekerja...</p>
                <p className="text-sm mt-2">Ini mungkin memakan waktu sebentar.</p>
            </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
                <img src={generatedImage} alt="Virtual Try-On Result" className="max-h-[calc(100%-40px)] w-auto object-contain rounded-md" />
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Unduh Gambar
                </button>
            </div>
          ) : (
            <div className="text-center text-stone-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <p className="mt-2">Hasil Akan Tampil di Sini</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            id="file-upload"
            className="hidden"
          />
          {isCameraOpen ? (
            <>
              <button onClick={capturePhoto} className="w-full sm:w-auto text-center cursor-pointer bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
                  Ambil Gambar
              </button>
               <button onClick={closeCamera} className="w-full sm:w-auto text-center cursor-pointer bg-white border border-stone-300 text-stone-700 font-semibold py-2 px-6 rounded-lg hover:bg-stone-50 transition-colors">
                  Tutup Kamera
              </button>
            </>
          ) : (
            <>
              <label
                htmlFor="file-upload"
                className="w-full sm:w-auto text-center cursor-pointer bg-white border border-stone-300 text-stone-700 font-semibold py-2 px-6 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Pilih Foto
              </label>
              <button
                onClick={openCamera}
                className="w-full sm:w-auto text-center cursor-pointer bg-white border border-stone-300 text-stone-700 font-semibold py-2 px-6 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Gunakan Kamera
              </button>
            </>
          )}

          <button
            onClick={handleTryOn}
            disabled={!personImageFile || !selectedClothing || status === VTOStatus.GENERATING}
            className="w-full sm:w-auto bg-amber-800 text-white font-bold py-2 px-8 rounded-lg shadow-md hover:bg-amber-900 transition-all disabled:bg-stone-400 disabled:cursor-not-allowed disabled:shadow-none sm:ml-auto"
          >
            {status === VTOStatus.GENERATING ? 'Memproses...' : 'Coba Sekarang'}
          </button>
        </div>
        
        {/* Status Messages */}
        <div className="mt-4 text-center h-6">
          {status !== VTOStatus.IDLE && (
            <p className={`text-sm ${status === VTOStatus.ERROR ? 'text-red-600' : 'text-stone-600'}`}>
                {statusMessages[status]}
            </p>
          )}
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
};
