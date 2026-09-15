import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  ArrowUp, 
  Heart,
  Facebook,
  Instagram,
  Youtube,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../data/siteConfig';

const Footer = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    showToast('Cảm ơn bạn đã đăng ký! Voucher 50k đã được gửi vào hòm thư.', 'success');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800 relative">
      
      {/* Newsletter Card Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 mb-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-orange-950/40 text-white">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-2">
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                🎁 Ưu Đãi Đăng Ký Thành Viên
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Nhận Ngay Voucher 50.000đ Cho Đơn Đầu Tiên!
              </h3>
              <p className="text-sm text-orange-100 max-w-lg">
                Đăng ký nhận thông báo về các món mới, chương trình Flash Sale hàng tuần và ưu đãi sinh nhật đặc quyền.
              </p>
            </div>

            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-center font-bold text-sm">
                  🎉 Đăng ký thành công! Hãy kiểm tra hộp thư email của bạn.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/95 text-gray-900 placeholder-gray-500 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-semibold outline-none focus:ring-4 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shrink-0 flex items-center gap-1.5 shadow-lg"
                  >
                    <span>Nhận Mã</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-glow">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                {siteConfig.brand.highlightWord}<span className="text-orange-500">{siteConfig.brand.subWord}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              {siteConfig.brand.name} - Thương hiệu ẩm thực trực tuyến cao cấp, tiên phong mang trải nghiệm chuẩn nhà hàng 5 sao và giao hàng siêu tốc đến từng tổ ấm.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={siteConfig.socials.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Thực Đơn
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#menu" className="hover:text-orange-400 transition-colors">🍔 Wagyu Truffle Burger</a></li>
              <li><a href="#menu" className="hover:text-orange-400 transition-colors">🍣 Sashimi Hoàng Gia</a></li>
              <li><a href="#menu" className="hover:text-orange-400 transition-colors">🍕 Pizza Men Tự Nhiên</a></li>
              <li><a href="#menu" className="hover:text-orange-400 transition-colors">🥩 Bít Tết Black Angus</a></li>
              <li><a href="#menu" className="hover:text-orange-400 transition-colors">🥗 Thực Đơn Healthy Chay</a></li>
            </ul>
          </div>

          {/* Col 3: Restaurant Policy & Story */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Chính Sách &amp; Cam Kết
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">⚡ Cam kết giao nhanh 20-30P</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">🌿 100% Nguyên liệu Organic</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">🛡️ Hoàn tiền 100% nếu nguội</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">📜 Chứng nhận ATTP Bộ Y Tế</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">💳 Chính sách bảo mật thanh toán</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Địa Chỉ &amp; Hotline
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <a 
                  href={siteConfig.contact.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=To%C3%A0+nh%C3%A0+Landmark+81,+720A+%C4%90i%E1%BB%87n+Bi%C3%AAn+Ph%E1%BB%A7,+P.22,+B%C3%ACnh+Th%E1%BA%A1nh,+TP.HCM"}
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-orange-400 transition-colors"
                  title="Bấm để xem trên Google Maps"
                >
                  {siteConfig.contact.address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a 
                  href={`tel:${siteConfig.contact.hotline}`}
                  className="font-bold text-white hover:text-orange-400 transition-colors"
                >
                  {siteConfig.contact.hotlineDisplay || siteConfig.contact.hotline}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a 
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{siteConfig.contact.openingHours}</span>
              </li>
            </ul>

            {/* Google Maps Embed Card */}
            <div className="mt-3.5 relative rounded-2xl overflow-hidden border border-gray-700/80 shadow-xl group bg-gray-800">
              <iframe
                title="Bản đồ vị trí KenRestaurant"
                src={siteConfig.contact.googleMapsEmbedUrl || "https://maps.google.com/maps?q=To%C3%A0%20nh%C3%A0%20Landmark%2081%2C%20720A%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20Ph%E1%BB%A7%2C%20P.22%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20TP.HCM&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                width="100%"
                height="130"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-32 rounded-2xl filter contrast-105 group-hover:filter-none transition-all duration-300"
              />
              <a
                href={siteConfig.contact.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=To%C3%A0+nh%C3%A0+Landmark+81,+720A+%C4%90i%E1%BB%87n+Bi%C3%AAn+Ph%E1%BB%A7,+P.22,+B%C3%ACnh+Th%E1%BA%A1nh,+TP.HCM"}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 right-2 bg-gray-950/90 hover:bg-orange-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md border border-gray-700 transition-all flex items-center gap-1 shadow-md hover:scale-105"
                title="Xem bản đồ lớn và chỉ đường trên Google Maps"
              >
                <span>Chỉ đường</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} {siteConfig.brand.name} Inc. Được sáng tạo với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>chuẩn Pixel-Perfect UI/UX.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 transition-colors p-2 rounded-xl bg-gray-800/80 hover:bg-gray-800"
            >
              <span>Lên đầu trang</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
