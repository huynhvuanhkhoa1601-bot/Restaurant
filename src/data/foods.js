// Danh mục món ăn
export const categories = [
  { id: 'all', name: 'Tất cả', icon: '🍽️', count: 25 },
  { id: 'burger', name: 'Burger & Bò', icon: '🍔', count: 4 },
  { id: 'pizza', name: 'Pizza & Pasta', icon: '🍕', count: 4 },
  { id: 'sushi', name: 'Sushi & Nhật', icon: '🍣', count: 3 },
  { id: 'asian', name: 'Món Á & Phở', icon: '🍜', count: 5 },
  { id: 'steak', name: 'Bít Tết & Nướng', icon: '🥩', count: 3 },
  { id: 'healthy', name: 'Salad & Healthy', icon: '🥗', count: 3 },
  { id: 'dessert', name: 'Tráng Miệng', icon: '🍰', count: 3 },
];

// Danh sách món ăn phong phú, chất lượng cao
export const foods = [
  {
    id: 'f1',
    name: 'Gourmet Wagyu Truffle Burger',
    category: 'burger',
    price: 185000,
    originalPrice: 220000,
    rating: 4.9,
    reviewsCount: 328,
    prepTime: '15-20 phút',
    calories: 680,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Thịt bò Wagyu Úc nướng sốt nấm Truffle hảo hạng, phô mai Cheddar tan chảy, hành tây caramel và xà lách giòn trên bánh brioche nướng bơ.',
    isBestSeller: true,
    isChefSpecial: true,
    isSpicy: 0,
    isVegetarian: false,
    ingredients: ['Bò Wagyu A5 xay', 'Sốt Nấm Truffle Đen', 'Phô mai Cheddar Anh', 'Hành tây Caramel', 'Bánh Brioche mè'],
    customizations: {
      sizes: [
        { name: 'Tiêu chuẩn (Single Patty)', priceOffset: 0 },
        { name: 'Double Wagyu Patty (+150g thịt)', priceOffset: 65000 },
        { name: 'Supreme Triple Patty', priceOffset: 120000 }
      ],
      toppings: [
        { id: 't1', name: 'Thêm Phô Mai Cheddar', price: 20000 },
        { id: 't2', name: 'Thịt Xông Khói Giòn', price: 25000 },
        { id: 't3', name: 'Sốt Nấm Truffle Thêm', price: 30000 },
        { id: 't4', name: 'Trứng Ốp La Lòng Đào', price: 15000 }
      ]
    }
  },
  {
    id: 'f2',
    name: 'Pizza Hải Sản Pesto Ý Thượng Hạng',
    category: 'pizza',
    price: 245000,
    originalPrice: 290000,
    rating: 4.8,
    reviewsCount: 240,
    prepTime: '20-25 phút',
    calories: 820,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Đế bánh ủ men tự nhiên 48h nướng củi giòn xốp, phủ sốt lá quế tây Pesto thơm lừng, tôm sú tươi, mực lá nướng và phô mai Mozzarella kéo sợi.',
    isBestSeller: true,
    isChefSpecial: false,
    isSpicy: 0,
    isVegetarian: false,
    ingredients: ['Tôm sú tươi', 'Mực lá Đại Tây Dương', 'Sốt Pesto Genovese', 'Mozzarella tươi Ý', 'Cà chua bi sấy'],
    customizations: {
      sizes: [
        { name: 'Cỡ Vừa (9 inch - 6 miếng)', priceOffset: 0 },
        { name: 'Cỡ Lớn (12 inch - 8 miếng)', priceOffset: 70000 },
        { name: 'Cỡ Tiệc (14 inch - 10 miếng)', priceOffset: 130000 }
      ],
      toppings: [
        { id: 't5', name: 'Gấp đôi Phô Mai Mozzarella', price: 35000 },
        { id: 't6', name: 'Viền Phô Mai Xúc Xích', price: 45000 },
        { id: 't7', name: 'Thêm Tôm Sú', price: 40000 }
      ]
    }
  },
  {
    id: 'f3',
    name: 'Combo Sushi Sashimi Hoàng Gia',
    category: 'sushi',
    price: 380000,
    originalPrice: 450000,
    rating: 5.0,
    reviewsCount: 195,
    prepTime: '15-20 phút',
    calories: 520,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    description: 'Tuyển tập Sashimi cá hồi Nauy béo ngậy, sò điệp Nhật Bản, cá ngừ đại dương và Nigiri lươn nướng sốt Teriyaki đậm đà.',
    isBestSeller: true,
    isChefSpecial: true,
    isSpicy: 0,
    isVegetarian: false,
    ingredients: ['Cá Hồi Nauy Tươi', 'Cá Ngừ Vây Vàng', 'Sò Điệp Hokkaido', 'Lươn Nhật Kabayaki', 'Trứng cá chuồn Tobiko'],
    customizations: {
      sizes: [
        { name: 'Phần 1 Người (12 Pieces)', priceOffset: 0 },
        { name: 'Phần Đôi (22 Pieces)', priceOffset: 160000 },
        { name: 'Set Đại Tiệc (36 Pieces)', priceOffset: 320000 }
      ],
      toppings: [
        { id: 't8', name: 'Thêm Wasabi Tươi Shizuoka', price: 15000 },
        { id: 't9', name: 'Salad Rong Biển Mè', price: 35000 },
        { id: 't10', name: 'Súp Miso Rong Biển Đậu Hũ', price: 25000 }
      ]
    }
  },
  {
    id: 'f4',
    name: 'Bò Bít Tết Ribeye Black Angus',
    category: 'steak',
    price: 320000,
    originalPrice: 360000,
    rating: 4.9,
    reviewsCount: 180,
    prepTime: '20-25 phút',
    calories: 750,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Thịt thăn lưng bò Black Angus 250g áp chảo bơ tỏi lá hương thảo, kèm khoai tây nghiền mịn nhung sốt tiêu đen Phú Quốc hoặc sốt phô mai.',
    isBestSeller: false,
    isChefSpecial: true,
    isSpicy: 1,
    isVegetarian: false,
    ingredients: ['Bò Black Angus Mỹ 250g', 'Khoai tây nghiền bơ Pháp', 'Măng tây nướng', 'Sốt tiêu đen Phú Quốc'],
    customizations: {
      sizes: [
        { name: 'Khẩu phần 250g (Vừa ăn)', priceOffset: 0 },
        { name: 'Khẩu phần 350g (Đầy đặn)', priceOffset: 95000 }
      ],
      toppings: [
        { id: 't11', name: 'Sốt Gan Ngỗng Foie Gras', price: 65000 },
        { id: 't12', name: 'Măng Tây Xào Tỏi Bơ', price: 30000 },
        { id: 't13', name: 'Khoai Tây Nghiền Truffle', price: 35000 }
      ]
    }
  },
  {
    id: 'f5',
    name: 'Phở Bò Thăn Wagyu Tái Lăn Trứng Chần',
    category: 'asian',
    price: 135000,
    originalPrice: 155000,
    rating: 4.8,
    reviewsCount: 412,
    prepTime: '10-15 phút',
    calories: 590,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    description: 'Nước dùng phở ninh từ xương ống bò và thảo mộc trong 24 giờ, bánh phở tươi dẻo mướt, thăn bò Wagyu thái mỏng xào lăn tỏi gừng thơm phức.',
    isBestSeller: true,
    isChefSpecial: false,
    isSpicy: 1,
    isVegetarian: false,
    ingredients: ['Bánh phở tươi Hà Nội', 'Thăn Bò Wagyu', 'Nước dùng thảo mộc 24h', 'Hành hoa & Quẩy giòn', 'Trứng gà ta lòng đào'],
    customizations: {
      sizes: [
        { name: 'Tô Tiêu Chuẩn', priceOffset: 0 },
        { name: 'Tô Đặc Biệt (+Thịt Wagyu & Gầu Bò)', priceOffset: 35000 },
        { name: 'Tô Khổng Lồ Kèm Đuôi Bò', priceOffset: 70000 }
      ],
      toppings: [
        { id: 't14', name: 'Đĩa Quẩy Giòn (3 cái)', price: 10000 },
        { id: 't15', name: 'Trứng Gà Chần Nước Béo', price: 12000 },
        { id: 't16', name: 'Thêm Thịt Tái Lăn 100g', price: 45000 }
      ]
    }
  },
  {
    id: 'f6',
    name: 'Salad Ức Gà Nướng Bơ Quả Quinoa',
    category: 'healthy',
    price: 125000,
    originalPrice: 145000,
    rating: 4.7,
    reviewsCount: 156,
    prepTime: '10-15 phút',
    calories: 380,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    description: 'Salad tươi giòn với ức gà ướp sốt thảo mộc nướng mềm mọng, quả bơ sáp Đắk Lắk, hạt diêm mạch Quinoa, sốt mè rang béo ngậy.',
    isBestSeller: false,
    isChefSpecial: false,
    isSpicy: 0,
    isVegetarian: false,
    ingredients: ['Ức gà thảo mộc nướng', 'Bơ sáp Đắk Lắk', 'Rau Rocket & Xà lách Romaine', 'Hạt Quinoa hữu cơ', 'Sốt mè rang Nhật'],
    customizations: {
      sizes: [
        { name: 'Phần Tiêu Chuẩn (350g)', priceOffset: 0 },
        { name: 'Phần Fit Pro Double Protein (+150g ức gà)', priceOffset: 35000 }
      ],
      toppings: [
        { id: 't17', name: 'Thêm Bơ Sáp Thái Lát', price: 20000 },
        { id: 't18', name: 'Hạt Óc Chó & Hạnh Nhân Rang', price: 25000 },
        { id: 't19', name: 'Phô Mai Feta Hy Lạp', price: 30000 }
      ]
    }
  },
  {
    id: 'f7',
    name: 'Bánh Mì Kẹp Gà Giòn Sốt Cay Hàn Quốc',
    category: 'burger',
    price: 110000,
    originalPrice: 130000,
    rating: 4.9,
    reviewsCount: 289,
    prepTime: '12-18 phút',
    calories: 620,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    description: 'Má đùi gà chiên vàng rụm tẩm sốt cay ngọt Gochujang chuẩn Hàn, bắp cải tím muối giòn tan và sốt Mayo tỏi ớt béo ngậy.',
    isBestSeller: true,
    isChefSpecial: false,
    isSpicy: 2,
    isVegetarian: false,
    ingredients: ['Má đùi gà rút xương giòn', 'Sốt Gochujang cay ngọt', 'Bắp cải tím ngâm chua', 'Sốt Mayo kim chi'],
    customizations: {
      sizes: [
        { name: 'Single Crispy Chicken', priceOffset: 0 },
        { name: 'Monster Double Chicken', priceOffset: 45000 }
      ],
      toppings: [
        { id: 't20', name: 'Phô Mai Kéo Sợi', price: 20000 },
        { id: 't21', name: 'Khoai Tây Chiên Lắc Phô Mai', price: 30000 }
      ]
    }
  },
  {
    id: 'f8',
    name: 'Mì Ramen Xương Hầm Tonkotsu Chashu',
    category: 'asian',
    price: 165000,
    originalPrice: 190000,
    rating: 4.9,
    reviewsCount: 374,
    prepTime: '15-20 phút',
    calories: 690,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    description: 'Nước cốt xương hầm 18 giờ đậm đà béo thơm, sợi mì tươi Hakata thủ công, thịt ba chỉ Chashu hầm mềm tan trong miệng cùng trứng ngâm tương Ajitsuke Tamago.',
    isBestSeller: true,
    isChefSpecial: true,
    isSpicy: 1,
    isVegetarian: false,
    ingredients: ['Sợi mì Ramen Hakata', 'Nước dùng Tonkotsu', 'Thịt Chashu nướng', 'Trứng lòng đào ngâm tương', 'Măng khô Menma'],
    customizations: {
      sizes: [
        { name: 'Bát Tiêu Chuẩn', priceOffset: 0 },
        { name: 'Bát Đặc Biệt (+3 Lát Chashu)', priceOffset: 40000 }
      ],
      toppings: [
        { id: 't22', name: 'Thêm Trứng Ajitsuke Tamago', price: 15000 },
        { id: 't23', name: 'Thêm Sợi Mì Kaedama', price: 20000 },
        { id: 't24', name: 'Dầu Tỏi Đen Mayu', price: 15000 }
      ]
    }
  },
  {
    id: 'f9',
    name: 'Pizza Bốn Vị Phô Mai Mật Ong Ý (Quattro Formaggi)',
    category: 'pizza',
    price: 230000,
    originalPrice: 260000,
    rating: 4.8,
    reviewsCount: 168,
    prepTime: '18-22 phút',
    calories: 780,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    description: 'Sự hòa quyện tuyệt hảo của 4 loại phô mai trứ danh: Mozzarella, Gorgonzola phô mai xanh, Parmesan và Ricotta, rưới mật ong rừng thơm ngọt ngào.',
    isBestSeller: false,
    isChefSpecial: true,
    isSpicy: 0,
    isVegetarian: true,
    ingredients: ['Phô mai Mozzarella', 'Gorgonzola Blue Cheese', 'Parmigiano-Reggiano', 'Ricotta kem', 'Mật ong hoa rừng nguyên chất'],
    customizations: {
      sizes: [
        { name: 'Cỡ Vừa (9 inch)', priceOffset: 0 },
        { name: 'Cỡ Lớn (12 inch)', priceOffset: 65000 }
      ],
      toppings: [
        { id: 't25', name: 'Mật Ong Rừng Thêm', price: 15000 },
        { id: 't26', name: 'Quả Óc Chó Nướng', price: 25000 }
      ]
    }
  },
  {
    id: 'f10',
    name: 'Cơm Lươn Nhật Nướng Unadon Sốt Kabayaki',
    category: 'asian',
    price: 265000,
    originalPrice: 310000,
    rating: 5.0,
    reviewsCount: 215,
    prepTime: '15-20 phút',
    calories: 610,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
    description: 'Lươn Nhật Bản nướng than hoa mềm rục, mọng nước phết sốt Kabayaki gia truyền óng ánh trên nền cơm gạo Nhật Koshihikari dẻo thơm.',
    isBestSeller: false,
    isChefSpecial: true,
    isSpicy: 0,
    isVegetarian: false,
    ingredients: ['Lươn Unagi Nhật Bản', 'Gạo Nhật Koshihikari', 'Sốt Kabayaki cổ truyền', 'Bột ớt Sansho Nhật', 'Rong biển vụn'],
    customizations: {
      sizes: [
        { name: 'Khẩu phần Tiêu Chuẩn (1/2 con lươn)', priceOffset: 0 },
        { name: 'Khẩu phần Thượng Hạng (Nguyên con lươn)', priceOffset: 120000 }
      ],
      toppings: [
        { id: 't27', name: 'Trứng Chiên Tamagoyaki', price: 20000 },
        { id: 't28', name: 'Canh Miso Rong Biển', price: 20000 }
      ]
    }
  },
  {
    id: 'f11',
    name: 'Bánh Tiramisu Ý Mascarpone Cà Phê Rượu Kahlúa',
    category: 'dessert',
    price: 85000,
    originalPrice: 99000,
    rating: 4.9,
    reviewsCount: 310,
    prepTime: '5-10 phút',
    calories: 340,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    description: 'Bánh ladyfinger nhúng cà phê Espresso đậm đặc và rượu mùi Kahlúa, xen kẽ các lớp kem phô mai Mascarpone béo mịn và phủ bột cacao nguyên chất đắng nhẹ.',
    isBestSeller: true,
    isChefSpecial: true,
    isSpicy: 0,
    isVegetarian: true,
    ingredients: ['Phô mai Mascarpone Ý', 'Cà phê Espresso rang xay', 'Rượu mùi Kahlúa', 'Bánh Ladyfinger', 'Bột Cacao Bỉ'],
    customizations: {
      sizes: [
        { name: 'Hộp Cá Nhân (150g)', priceOffset: 0 },
        { name: 'Hộp Đôi Chia Sẻ (300g)', priceOffset: 65000 }
      ],
      toppings: [
        { id: 't29', name: 'Dâu Tây Đà Lạt Tươi', price: 25000 },
        { id: 't30', name: 'Sốt Chocolate Bỉ Nóng Chảy', price: 20000 }
      ]
    }
  },
  {
    id: 'f12',
    name: 'Bánh Mousse Matcha Trà Xanh Kyoto',
    category: 'dessert',
    price: 79000,
    originalPrice: 95000,
    rating: 4.8,
    reviewsCount: 142,
    prepTime: '5-10 phút',
    calories: 290,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    description: 'Bột trà xanh Uji Kyoto hảo hạng hòa quyện kem tươi thanh nhẹ, đế bánh giòn bùi cùng đậu đỏ Azuki hầm đường ngọt dịu chuẩn vị Nhật.',
    isBestSeller: false,
    isChefSpecial: false,
    isSpicy: 0,
    isVegetarian: true,
    ingredients: ['Bột Matcha Uji Kyoto', 'Đậu đỏ Azuki', 'Kem tươi Anchor', 'Chocolate trắng Valrhona'],
    customizations: {
      sizes: [
        { name: 'Miếng Bánh Tam Giác', priceOffset: 0 },
        { name: 'Bánh Mini Tròn Sinh Nhật (10cm)', priceOffset: 90000 }
      ],
      toppings: [
        { id: 't31', name: 'Viên Kem Matcha', price: 25000 }
      ]
    }
  },
  {
    id: 'f13',
    name: 'Cơm Tấm Sườn Bì Chả Đặc Biệt',
    category: 'asian',
    price: 85000,
    originalPrice: 105000,
    rating: 4.9,
    reviewsCount: 120,
    prepTime: '10-15 phút',
    calories: 650,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'Sườn cốt lết nướng mật ong thơm lừng, chả trứng hấp béo ngậy, bì giòn dai và nước mắm kẹo chua ngọt.',
    isBestSeller: true,
    isChefSpecial: false,
    isSpicy: 0,
    isVegetarian: false,
    ingredients: ['Sườn heo cốt lết', 'Gạo tấm thơm', 'Chả trứng thịt', 'Bì heo trộn thính', 'Mỡ hành tóp mỡ'],
    customizations: {
      sizes: [
        { name: 'Dĩa Tiêu Chuẩn (1 Miếng Sườn)', priceOffset: 0 },
        { name: 'Dĩa Đặc Biệt (+Thêm 1 Sườn & Trứng Ốp La)', priceOffset: 35000 }
      ],
      toppings: [
        { id: 't32', name: 'Thêm Trứng Ốp La Lòng Đào', price: 12000 },
        { id: 't33', name: 'Thêm Chén Mỡ Hành Tóp Mỡ', price: 8000 },
        { id: 't34', name: 'Thêm Chả Trứng Hấp', price: 15000 }
      ]
    }
  }
];

// Danh sách Vouchers ưu đãi khủng
export const vouchers = [
  {
    code: 'KHOA',
    discount: 50000,
    discountType: 'fixed',
    minSpend: 250000,
    description: 'Giảm ngay 50.000đ cho đơn hàng từ 250k',
    expiry: 'Hết hạn hôm nay',
    badge: 'HOT DEAL 🔥',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    code: 'FREESHIP',
    discount: 30000,
    discountType: 'shipping',
    minSpend: 150000,
    description: 'Miễn phí giao hàng toàn quốc đơn từ 150k',
    expiry: 'Còn 3 ngày',
    badge: 'FREESHIP 🚚',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    code: 'NEWBIE',
    discount: 20,
    discountType: 'percent',
    maxDiscount: 60000,
    minSpend: 100000,
    description: 'Giảm 20% tối đa 60k cho khách hàng mới',
    expiry: 'Vĩnh viễn',
    badge: 'MỚI 🎁',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    code: 'GOURMET30',
    discount: 30,
    discountType: 'percent',
    maxDiscount: 100000,
    minSpend: 400000,
    description: 'Giảm 30% tối đa 100k cho đơn ẩm thực thượng hạng',
    expiry: 'Cuối tuần này',
    badge: 'VIP ⭐',
    gradient: 'from-purple-600 to-indigo-600'
  }
];

// Đánh giá khách hàng thực tế
export const reviews = [
  {
    id: 'r1',
    name: 'Anh Khoa',
    avatar: '/images/avatar-anh-khoa.jpg',
    rating: 5,
    date: '2 giờ trước',
    dish: 'Gourmet Wagyu Truffle Burger',
    comment: 'Burger ngon đỉnh chóp luôn mọi người ơi! Thịt bò Wagyu mềm ngọt mọng nước, sốt truffle thơm nức mũi. Giao hàng chỉ mất đúng 18 phút còn nóng hổi!',
    verified: true,
    likes: 24
  },
  {
    id: 'r2',
    name: 'Quỳnh Giao',
    avatar: '/images/avatar-quynh-giao.jpg',
    rating: 5,
    date: 'Hôm qua',
    dish: 'Combo Sushi Sashimi Hoàng Gia',
    comment: 'Sashimi tươi rói, cá hồi béo ngậy không hề có mùi tanh. Đóng gói hộp giữ nhiệt cực kỳ sang trọng và chỉn chu. Rất xứng đáng với tầm giá 5 sao!',
    verified: true,
    likes: 19
  },
  {
    id: 'r3',
    name: 'Thiên Kỳ',
    avatar: '/images/avatar-thien-ky.jpg',
    rating: 5,
    date: '2 ngày trước',
    dish: 'Pizza Hải Sản Pesto Ý',
    comment: 'Đế bánh giòn nhẹ, sốt Pesto thơm dịu rất khác biệt so với các quán pizza thông thường. Cả nhà mình ai ăn cũng khen nức nở.',
    verified: true,
    likes: 31
  },
  {
    id: 'r4',
    name: 'Anh Pha',
    avatar: '/images/avatar-anh-pha.jpg',
    rating: 5,
    date: '3 ngày trước',
    dish: 'Bò Bít Tết Ribeye Black Angus',
    comment: 'Thịt bò nướng Medium Rare chuẩn xác từng ly. Khoai tây nghiền mịn tan, sốt tiêu thơm lừng. Chắc chắn sẽ tiếp tục ủng hộ quán dài lâu!',
    verified: true,
    likes: 15
  }
];

// Định dạng tiền tệ VND
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
