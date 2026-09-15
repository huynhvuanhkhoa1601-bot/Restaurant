// Danh mục bàn ăn tại Nhà hàng KenRestaurant
// Hỗ trợ gọi món tại bàn, quét mã QR bàn, và in ấn sticker dán bàn

export const restaurantTables = [
  {
    id: 'T01',
    code: 'B01',
    name: 'Bàn 01',
    area: 'Tầng Trệt - Sảnh Chính',
    floor: 'Tầng 1',
    capacity: '2 - 4 Khách',
    type: 'standard',
    tag: 'Gần cửa ra vào',
    status: 'available',
    bgGradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'T02',
    code: 'B02',
    name: 'Bàn 02',
    area: 'Tầng Trệt - View Cửa Sổ',
    floor: 'Tầng 1',
    capacity: '2 - 4 Khách',
    type: 'window',
    tag: 'Ánh sáng tự nhiên',
    status: 'available',
    bgGradient: 'from-orange-500 to-rose-600'
  },
  {
    id: 'T03',
    code: 'B03',
    name: 'Bàn 03',
    area: 'Tầng Trệt - Trung Tâm',
    floor: 'Tầng 1',
    capacity: '4 - 6 Khách',
    type: 'family',
    tag: 'Ghế sofa êm ái',
    status: 'available',
    bgGradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'T04',
    code: 'B04',
    name: 'Bàn 04',
    area: 'Tầng Trệt - Quầy Bar & Pha Chế',
    floor: 'Tầng 1',
    capacity: '2 - 3 Khách',
    type: 'bar',
    tag: 'Trải nghiệm pha chế',
    status: 'available',
    bgGradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'T05',
    code: 'B05',
    name: 'Bàn 05',
    area: 'Sân Vườn Xanh - Thoáng Mát',
    floor: 'Khu Sân Vườn',
    capacity: '4 - 6 Khách',
    type: 'garden',
    tag: 'Cây xanh lãng mạn',
    status: 'available',
    bgGradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'T06',
    code: 'B06',
    name: 'Bàn 06',
    area: 'Sân Vườn - Cạnh Hồ Cá Koi',
    floor: 'Khu Sân Vườn',
    capacity: '6 - 8 Khách',
    type: 'garden',
    tag: 'View cá Koi bơi lội',
    status: 'available',
    bgGradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'T07',
    code: 'B07',
    name: 'Bàn 07',
    area: 'Tầng 2 - Ban Công Ngắm Phố',
    floor: 'Tầng 2',
    capacity: '2 - 4 Khách',
    type: 'balcony',
    tag: 'Gió trời mát mẻ',
    status: 'available',
    bgGradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'T08',
    code: 'B08',
    name: 'Bàn 08',
    area: 'Tầng 2 - Không Gian Gia Đình',
    floor: 'Tầng 2',
    capacity: '6 - 8 Khách',
    type: 'family',
    tag: 'Không gian ấm cúng',
    status: 'available',
    bgGradient: 'from-amber-600 to-orange-700'
  },
  {
    id: 'T09',
    code: 'B09',
    name: 'Bàn 09 (VIP 1)',
    area: 'Phòng VIP Hoàng Gia',
    floor: 'Tầng 2',
    capacity: '8 - 12 Khách',
    type: 'vip',
    tag: 'Riêng tư & Đẳng cấp',
    status: 'available',
    bgGradient: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'T10',
    code: 'B10',
    name: 'Bàn 10 (VIP 2)',
    area: 'Phòng VIP Thượng Uyển',
    floor: 'Tầng 2',
    capacity: '10 - 16 Khách',
    type: 'vip',
    tag: 'Phòng tiệc lớn',
    status: 'available',
    bgGradient: 'from-purple-600 to-pink-600'
  }
];

/**
 * Sinh link gọi món theo bàn
 */
export const getTableOrderUrl = (tableCode) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return `${origin}/?table=${encodeURIComponent(tableCode)}`;
};

/**
 * Sinh link ảnh QR code chuẩn
 */
export const getTableQrImageUrl = (tableCode, size = 260) => {
  const targetUrl = getTableOrderUrl(tableCode);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}&margin=10&color=1e293b`;
};
