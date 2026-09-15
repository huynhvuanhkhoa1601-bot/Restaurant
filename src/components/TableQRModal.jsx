import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  Camera, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Users, 
  Printer, 
  Download, 
  ExternalLink,
  HelpCircle,
  Utensils,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { restaurantTables, getTableOrderUrl, getTableQrImageUrl } from '../data/tables';

const TableQRModal = () => {
  const {
    isTableQROpen,
    closeTableQR,
    selectedTable,
    setSelectedTable,
    setDiningMode,
    showToast,
    playSound
  } = useCart();

  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'layout' | 'print'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [previewStickerTable, setPreviewStickerTable] = useState(restaurantTables[0]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Khởi động Camera khi mở tab Quét
  useEffect(() => {
    if (!isTableQROpen || activeTab !== 'scan') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isTableQROpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Trình duyệt không hỗ trợ trực tiếp Camera. Quý khách vui lòng chọn bàn từ danh sách hoặc tải ảnh.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);

      // Nếu hỗ trợ BarcodeDetector
      if ('BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const interval = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState < 2) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const rawValue = barcodes[0].rawValue;
                handleDetectUrl(rawValue);
                clearInterval(interval);
              }
            } catch (_) {}
          }, 600);

          return () => clearInterval(interval);
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Lỗi mở camera:', err);
      setCameraError('Không thể mở camera (chưa cấp quyền hoặc thiết bị không có camera). Bạn có thể chọn bàn nhanh bên dưới!');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Giải mã chuỗi URL hoặc mã bàn
  const handleDetectUrl = (rawText) => {
    if (!rawText) return;
    let foundTable = null;

    // Kiểm tra ?table=...
    try {
      const url = new URL(rawText, window.location.origin);
      const code = url.searchParams.get('table') || url.searchParams.get('ban');
      if (code) {
        foundTable = restaurantTables.find(
          t => t.code.toLowerCase() === code.toLowerCase() || t.id.toLowerCase() === code.toLowerCase()
        );
      }
    } catch (_) {}

    // Kiểm tra tên hoặc mã bàn trực tiếp
    if (!foundTable) {
      foundTable = restaurantTables.find(
        t => t.code.toLowerCase() === rawText.toLowerCase().trim() ||
             t.name.toLowerCase() === rawText.toLowerCase().trim()
      );
    }

    if (foundTable) {
      handleSelectTable(foundTable);
    } else {
      showToast(`Mã quét: "${rawText.substring(0, 30)}..." không khớp bàn nào. Vui lòng thử lại!`, 'info');
    }
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setDiningMode('dine_in');
    stopCamera();
    closeTableQR();
    playSound('success');
    showToast(`Đã kết nối với ${table.name} (${table.area})! Phí ship đã chuyển thành 0đ.`, 'success');
  };

  const handleManualCodeInput = (e) => {
    e.preventDefault();
    const code = e.target.tableCode.value.trim().toUpperCase();
    const found = restaurantTables.find(
      t => t.code === code || t.code === `B${code}` || t.name.toUpperCase().includes(code)
    );
    if (found) {
      handleSelectTable(found);
    } else {
      showToast(`Không tìm thấy bàn với mã "${code}". Hãy thử B01 đến B10!`, 'warning');
    }
  };

  if (!isTableQROpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { stopCamera(); closeTableQR(); }}
        className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[92vh]"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white">
                  Gọi Món Quét Mã Tại Bàn
                </h3>
                {selectedTable && (
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    Đang ở {selectedTable.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Nhà hàng KenRestaurant • Phục vụ trực tiếp tại bàn (0đ phí ship)
              </p>
            </div>
          </div>

          <button
            onClick={() => { stopCamera(); closeTableQR(); }}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 gap-2 pt-2 bg-gray-50/50 dark:bg-gray-850/50">
          <button
            onClick={() => setActiveTab('scan')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'scan'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Quét Mã Camera</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'layout'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Sơ Đồ Bàn Ăn</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'print'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Mã QR Cho Quán In</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: SCANNER */}
          {activeTab === 'scan' && (
            <div className="space-y-5">
              {/* Camera Scanner Viewfinder */}
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-[4/3] max-h-72 w-full flex items-center justify-center shadow-inner border-2 border-orange-500/30">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center text-white space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-orange-400 backdrop-blur-md">
                      <Camera className="w-7 h-7 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-200">
                        {cameraError || 'Đang sẵn sàng kết nối camera...'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Hướng camera vào mã QR dán trên góc bàn ăn của bạn
                      </p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Thử Lại Camera</span>
                    </button>
                  </div>
                )}

                {/* Laser Overlay Guide */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-orange-400 rounded-2xl relative">
                      {/* Corner marks */}
                      <span className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-orange-500 rounded-tl" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-orange-500 rounded-tr" />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-orange-500 rounded-bl" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-orange-500 rounded-br" />
                      
                      {/* Scanning Laser Line */}
                      <motion.div
                        animate={{ y: [0, 180, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_12px_#f97316]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Input Form */}
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <form onSubmit={handleManualCodeInput} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      name="tableCode"
                      type="text"
                      placeholder="Hoặc nhập mã số bàn (VD: B01, 2, B05...)"
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl text-xs sm:text-sm font-bold hover:brightness-110 shrink-0 transition-all shadow-md"
                  >
                    Xác Nhận
                  </button>
                </form>
              </div>

              {/* Quick Sample Clickers (Rất tiện lợi cho khách hoặc thử nghiệm) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ⚡ Chạm nhanh để chọn bàn mẫu:
                  </span>
                  <button 
                    onClick={() => setActiveTab('layout')}
                    className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-0.5"
                  >
                    <span>Xem tất cả 10 bàn</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {restaurantTables.slice(0, 4).map(table => (
                    <button
                      key={table.id}
                      onClick={() => handleSelectTable(table)}
                      className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
                        selectedTable?.id === table.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 ring-2 ring-orange-500/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm text-gray-900 dark:text-white">
                          {table.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {table.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        {table.area}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TABLE LAYOUT */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Chọn vị trí bàn ăn mà quý khách đang ngồi tại nhà hàng KenRestaurant:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {restaurantTables.map(table => {
                  const isCurrent = selectedTable?.id === table.id;
                  return (
                    <div
                      key={table.id}
                      onClick={() => handleSelectTable(table)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden flex flex-col justify-between ${
                        isCurrent
                          ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 ring-4 ring-orange-500/20'
                          : 'border-gray-200 dark:border-gray-800 hover:border-orange-300 bg-white dark:bg-gray-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white bg-gradient-to-br ${table.bgGradient} shadow-md shrink-0`}>
                            {table.code}
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-gray-900 dark:text-white">
                              {table.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                              <span className="truncate">{table.area}</span>
                            </p>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đang chọn</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/60 px-2 py-0.5 rounded-full">
                            {table.floor}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/60 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>{table.capacity}</span>
                        </span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          {table.tag}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PRINTABLE QR FOR RESTAURANT OWNER */}
          {activeTab === 'print' && (
            <div className="space-y-5">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>Dành cho Chủ Quán &amp; Nhân Viên:</strong> Mỗi bàn ăn được cấp một mã QR riêng. Bạn có thể in bảng mica hoặc sticker dán lên bàn ăn. Khách quét mã sẽ tự động kết nối vào đúng số bàn!
                </div>
              </div>

              {/* Selector for table preview */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {restaurantTables.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPreviewStickerTable(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      previewStickerTable.id === t.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* Sticker Card Preview */}
              <div className="max-w-sm mx-auto bg-gradient-to-b from-orange-500 via-rose-600 to-red-700 p-6 rounded-3xl shadow-2xl text-center text-white border-4 border-white dark:border-gray-800 relative">
                <div className="uppercase text-[11px] font-black tracking-widest text-orange-200 mb-1">
                  Nhà Hàng Ẩm Thực Cao Cấp
                </div>
                <h3 className="text-2xl font-black mb-1">
                  KenRestaurant
                </h3>
                <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-4">
                  {previewStickerTable.name} • {previewStickerTable.floor}
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-4 rounded-2xl shadow-xl inline-block mx-auto">
                  <img
                    src={getTableQrImageUrl(previewStickerTable.code, 220)}
                    alt={`Mã QR ${previewStickerTable.name}`}
                    className="w-48 h-48 object-contain rounded-xl"
                  />
                  <p className="text-[11px] font-black text-gray-800 mt-2">
                    Mã bàn: {previewStickerTable.code}
                  </p>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm font-extrabold text-white">
                    Quét Mã Để Xem Menu &amp; Gọi Món
                  </p>
                  <p className="text-[11px] text-orange-100">
                    Mở camera điện thoại hướng vào mã QR phía trên
                  </p>
                </div>
              </div>

              {/* Print Action Buttons */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Sticker Bàn Này</span>
                </button>

                <a
                  href={getTableOrderUrl(previewStickerTable.code)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-orange-200 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở Thử Link Bàn</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-850/50 text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Đổi bàn bất kỳ lúc nào trước khi thanh toán</span>
          </div>

          {selectedTable && (
            <button
              onClick={() => {
                setSelectedTable(null);
                setDiningMode('delivery');
                showToast('Đã hủy chọn bàn, chuyển về chế độ Giao hàng tận nơi.', 'info');
              }}
              className="text-rose-500 hover:text-rose-600 font-bold hover:underline"
            >
              Hủy chọn bàn
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default TableQRModal;
