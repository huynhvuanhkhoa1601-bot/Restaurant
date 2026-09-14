/**
 * =========================================================================
 * ⚙️ TRUNG TÂM CẤU HÌNH TOÀN BỘ WEBSITE (SITE CONFIGURATION)
 * Bạn có thể chỉnh sửa mọi thông tin hiển thị của website tại file này!
 * =========================================================================
 */

export const siteConfig = {
  // 1. THÔNG TIN THƯƠNG HIỆU & TÊN NHÀ HÀNG
  brand: {
    name: 'KenRestaurant',              // Tên thương hiệu hiển thị
    highlightWord: 'Ken',               // Từ được tô màu cam gradient nổi bật
    subWord: 'Restaurant',              // Từ viết sau
    tagline: 'Chuyên nghiệp và Phong cách', // Slogan phụ dưới logo
    badge: '5 SAO',                     // Huy hiệu nhỏ bên cạnh logo (PRO, VIP, 5 SAO...)
  },

  // 2. THÔNG TIN LIÊN HỆ & ĐỊA CHỈ NHÀ HÀNG
  contact: {
    hotline: '0334756330',              // Số điện thoại hotline
    hotlineDisplay: '0334 756 330',     // Số điện thoại hiển thị đẹp mắt
    email: 'contact@kenrestaurant.vn',  // Email liên hệ
    address: '133/50/4 Cống Lở, P.15, Q. Tân Bình, TP.HCM', // Địa chỉ nhà hàng
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=133%2F50%2F4%20C%E1%BB%91ng%20L%E1%BB%9F%2C%20Ph%C6%B0%E1%BB%9Dng%2015%2C%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=133/50/4+Cống+Lở,+Phường+15,+Tân+Bình,+Hồ+Chí+Minh',
    openingHours: '08:00 - 23:30 mỗi ngày', // Giờ mở cửa
  },

  // 3. THANH THÔNG BÁO CHẠY TRÊN ĐẦU TRANG (TOP ANNOUNCEMENT BAR)
  topBanner: {
    text: '🔥 Ưu đãi hôm nay: Nhập mã KHOA giảm 50k & Miễn phí giao hàng toàn thành phố!',
    deliveryTime: 'Giao siêu tốc 20-30 phút',
  },

  // 4. BANNER CHÍNH (HERO SECTION)
  hero: {
    topBadge: 'Dịch Vụ Ẩm Thực Thượng Hạng #1 Sài Gòn',
    badgeDelivery: 'GIAO 20P',
    titleLine1: 'Thưởng Thức Hương Vị',
    titleHighlight: 'Đỉnh Cao',
    titleLine2: 'Giao Tận Cửa Bạn.',
    description: 'Từ bò Wagyu sốt Truffle thơm lừng đến Cơm tấm sườn bì chả đặc biệt và Sashimi cá hồi tươi rói. Mỗi món ăn tại KenRestaurant là một kiệt tác ẩm thực được chế biến tỉ mỉ và giao nóng hổi chỉ trong 20 phút.',
    ctaMenuButton: 'Khám Phá Thực Đơn',
    ctaVoucherButton: 'Săn Mã Giảm 50k',
    
    // 3 Số liệu thống kê uy tín
    stats: {
      stat1: { number: '50k+', label: 'Khách Hàng Thân Thiết' },
      stat2: { number: '4.9 ⭐', label: '15,000+ Đánh Giá' },
      stat3: { number: '20m ⚡', label: 'Giao Nhanh Nóng Hổi' },
    }
  },

  // 5. CÂU CHUYỆN THƯƠNG HIỆU & TIÊU CHUẨN 5 SAO (STORY SECTION)
  story: {
    badge: 'Tiêu Chuẩn 5 Sao Từ KenRestaurant',
    title: 'Hơn Cả Bữa Ăn, Đó Là Một Trải Nghiệm Tinh Hoa',
    description: 'Chúng tôi tin rằng sự tiện lợi của giao đồ ăn trực tuyến không đồng nghĩa với việc phải giảm bớt chất lượng. Mỗi món ăn tại KenRestaurant đều được sáng tạo với tinh thần đam mê nghệ thuật ẩm thực sâu sắc.',
    experienceBadge: '10+ Năm Khẳng Định Đẳng Cấp Ẩm Thực',
    image1: 'https://butl.vn/wp-content/uploads/2025/06/nha-hang-5-sao-social-club.webp',
    image2: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    
    // 4 Cam kết chất lượng
    highlights: [
      {
        title: 'Đầu Bếp 5 Sao Quốc Tế',
        desc: 'Đội ngũ bếp trưởng nhiều năm kinh nghiệm, chăm chút từng công thức và khẩu vị hoàn mỹ.'
      },
      {
        title: 'Giao Hàng Siêu Tốc 20-30P',
        desc: 'Công nghệ túi giữ nhiệt kép chuyên dụng, đảm bảo đồ ăn luôn giòn tan hoặc bốc khói nóng hổi.'
      },
      {
        title: '100% Nguyên Liệu Tươi Sạch',
        desc: 'Thịt bò hảo hạng, hải sản tươi trong ngày, rau củ hữu cơ đạt chuẩn an toàn vệ sinh thực phẩm.'
      },
      {
        title: 'Bảo Hành Độ Ngon & Hoàn Tiền',
        desc: 'Nếu món ăn không đạt chất lượng cam kết hoặc giao quá giờ do lỗi hệ thống, hoàn tiền 100% tức thì.'
      }
    ]
  },

  // 6. KHUYẾN MÃI NHẬN TIN (NEWSLETTER VOUCHER)
  newsletter: {
    badge: '🎁 Ưu Đãi Đăng Ký Thành Viên',
    title: 'Nhận Ngay Voucher 50.000đ Cho Đơn Đầu Tiên!',
    description: 'Đăng ký nhận thông báo về các món mới, chương trình Flash Sale hàng tuần và ưu đãi sinh nhật đặc quyền.',
  },

  // 7. MẠNG XÃ HỘI (SOCIAL LINKS)
  socials: {
    facebook: 'https://www.facebook.com/khoa.huynhvuanh.7',
    instagram: 'https://www.instagram.com/',
    youtube: 'https://youtube.com',
  },

  // 8. CHÍNH SÁCH VẬN CHUYỂN
  shipping: {
    freeShipThreshold: 200000,          // Mức tiền được miễn phí giao hàng (200.000đ)
    defaultFee: 25000,                  // Phí ship mặc định nếu dưới ngưỡng (25.000đ)
  }
};
