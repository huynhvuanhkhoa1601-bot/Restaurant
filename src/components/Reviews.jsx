import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ThumbsUp, ShieldCheck, Plus, X, CheckCircle2,
  Sparkles, Camera, ImagePlus, Trash2, AlertCircle
} from 'lucide-react';
import { reviews as initialReviews, foods } from '../data/foods';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// ─── Star Selector ───────────────────────────────────────────────────────────
const StarSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        type="button"
        key={star}
        onClick={() => onChange(star)}
        className="p-0.5 hover:scale-125 transition-transform"
      >
        <Star className={`w-7 h-7 transition-colors ${
          star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
        }`} />
      </button>
    ))}
    <span className="text-xs font-black text-amber-500 ml-1">
      {value === 5 ? 'Tuyệt vời! ⭐' : value >= 4 ? 'Rất tốt 😊' : value >= 3 ? 'Bình thường 😐' : 'Chưa ổn 😕'}
    </span>
  </div>
);

// ─── Photo Upload Area ────────────────────────────────────────────────────────
const PhotoUploadArea = ({ photos, onAdd, onRemove }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (photos.length >= 4) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        onAdd({ id: Date.now() + Math.random(), url: ev.target.result, name: file.name });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div>
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block">
        📸 Ảnh Món Ăn Của Bạn
        <span className="font-normal text-gray-400 ml-1">(Tối đa 4 ảnh)</span>
      </label>

      <div className="flex flex-wrap gap-3">
        {/* Existing photos */}
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-300 dark:border-orange-700 group shadow-md"
          >
            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {photos.length < 4 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-2xl border-2 border-dashed border-orange-300 dark:border-orange-700/60 flex flex-col items-center justify-center gap-1 text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-[10px] font-bold">Thêm ảnh</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {photos.length > 0 && (
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Đã chọn {photos.length} ảnh — Ảnh sẽ được hiển thị cùng đánh giá của bạn
        </p>
      )}
    </div>
  );
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ rev, hasLiked, onLike }) => {
  const [photoIdx, setPhotoIdx] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-card hover:shadow-xl dark:shadow-card-dark transition-all border border-gray-100 dark:border-gray-700/60 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={rev.avatar}
              alt={rev.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-gray-900 dark:text-white">{rev.name}</h4>
                {rev.verified && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Đã mua
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{rev.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-xl">
            {[...Array(rev.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
        </div>

        {/* Dish Badge */}
        <div className="inline-block text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-3 py-1 rounded-xl mb-3">
          🍽️ Món đã gọi: {rev.dish}
        </div>

        {/* Comment */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-4 italic">
          "{rev.comment}"
        </p>

        {/* Photos Gallery */}
        {rev.photos && rev.photos.length > 0 && (
          <div className="mb-4">
            {/* Main Photo */}
            <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-2 bg-gray-100 dark:bg-gray-700">
              <img
                src={rev.photos[photoIdx].url}
                alt={`Ảnh món ăn ${photoIdx + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                {photoIdx + 1}/{rev.photos.length}
              </span>
            </div>

            {/* Thumbnails */}
            {rev.photos.length > 1 && (
              <div className="flex gap-2">
                {rev.photos.map((ph, idx) => (
                  <button
                    key={ph.id}
                    onClick={() => setPhotoIdx(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      photoIdx === idx
                        ? 'border-orange-500 scale-105'
                        : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={ph.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-400">
        <span className="hidden sm:inline">Khách hàng trải nghiệm dịch vụ KenRestaurant</span>
        <button
          onClick={() => onLike(rev.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            hasLiked ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-50'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{rev.likes} Thích</span>
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
const Reviews = () => {
  const { showToast } = useCart();
  const { currentUser, isLoggedIn, openLogin } = useAuth();

  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState([]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    dish: foods[0]?.name || '',
    comment: '',
    photos: [],
  });

  const handleLike = (reviewId) => {
    setReviewsList(prev => prev.map(r =>
      r.id === reviewId
        ? { ...r, likes: likedReviews.includes(reviewId) ? r.likes - 1 : r.likes + 1 }
        : r
    ));
    setLikedReviews(prev =>
      prev.includes(reviewId) ? prev.filter(id => id !== reviewId) : [...prev, reviewId]
    );
  };

  const handleOpenModal = () => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để gửi đánh giá!', 'error');
      openLogin();
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    const created = {
      id: `r-${Date.now()}`,
      name: currentUser?.name || 'Khách Hàng',
      avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'K')}&background=f97316&color=fff`,
      rating: newReview.rating,
      date: 'Vừa xong',
      dish: newReview.dish,
      comment: newReview.comment,
      photos: newReview.photos,
      verified: true,
      likes: 0,
    };

    setReviewsList([created, ...reviewsList]);
    setIsModalOpen(false);
    setNewReview({ rating: 5, dish: foods[0]?.name || '', comment: '', photos: [] });
    showToast('Cảm ơn bạn! Đánh giá của bạn đã được gửi thành công! 🎉', 'success');
  };

  const addPhoto = (photo) => setNewReview(prev => ({ ...prev, photos: [...prev.photos, photo] }));
  const removePhoto = (id) => setNewReview(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }));

  return (
    <section id="reviews" className="py-16 bg-orange-50/30 dark:bg-gray-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Đánh Giá Từ Khách Hàng Thực Tế</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              15.000+ Thực Khách Hài Lòng
            </h2>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 transition-all self-start md:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Viết Đánh Giá + Gửi Ảnh</span>
          </button>
        </div>

        {/* Overall Score Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 shadow-xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-6 md:pb-0 md:pr-6">
            <div className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              <span>4.9</span>
              <span className="text-2xl text-gray-400 font-normal">/5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Dựa trên hơn <strong>15.420</strong> lượt đánh giá và đặt món thực tế
            </p>
          </div>

          <div className="md:col-span-8 space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
            {[{ label: '5 Sao', pct: '94%', w: 'w-[94%]' }, { label: '4 Sao', pct: '5%', w: 'w-[5%]' }, { label: '3 Sao', pct: '1%', w: 'w-[1%]' }].map(({ label, pct, w }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-12 text-right">{label}</span>
                <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-amber-400 rounded-full ${w}`} />
                </div>
                <span className="w-10 font-bold text-gray-900 dark:text-white">{pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev) => (
            <ReviewCard
              key={rev.id}
              rev={rev}
              hasLiked={likedReviews.includes(rev.id)}
              onLike={handleLike}
            />
          ))}
        </div>
      </div>

      {/* ─── Add Review Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9000] overflow-y-auto flex items-start justify-center p-4 py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 border border-gray-100 dark:border-gray-800"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-500" />
                    Viết Đánh Giá & Gửi Ảnh Món Ăn
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Chia sẻ trải nghiệm của bạn cùng ảnh thực tế!</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star Rating */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">
                    Mức độ hài lòng của bạn *
                  </label>
                  <StarSelector value={newReview.rating} onChange={(v) => setNewReview({ ...newReview, rating: v })} />
                </div>

                {/* Dish Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">
                    Chọn món ăn bạn đã thưởng thức *
                  </label>
                  <select
                    value={newReview.dish}
                    onChange={(e) => setNewReview({ ...newReview, dish: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                  >
                    {foods.map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">
                    Cảm nhận & nhận xét của bạn *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Món ăn có vừa miệng không? Hương vị, độ nóng và tốc độ giao hàng thế nào..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 text-xs sm:text-sm outline-none focus:border-orange-500 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                {/* Photo Upload */}
                <PhotoUploadArea
                  photos={newReview.photos}
                  onAdd={addPhoto}
                  onRemove={removePhoto}
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Gửi Đánh Giá Ngay
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Reviews;
