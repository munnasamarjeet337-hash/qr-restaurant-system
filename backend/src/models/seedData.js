export const seedCategories = [
  { id: 'cat-1', name: 'Starters', sort_order: 1 },
  { id: 'cat-2', name: 'Mains', sort_order: 2 },
  { id: 'cat-3', name: 'Desserts', sort_order: 3 },
  { id: 'cat-4', name: 'Beverages', sort_order: 4 }
];

export const seedMenuItems = [
  // Starters
  {
    id: 'item-1',
    category_id: 'cat-1',
    name: 'Crispy Paneer Tikka',
    description: 'Charcoal-grilled cottage cheese cubes marinated in spiced yogurt and fresh mint chutney.',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1567184109411-b28f29ecb89a?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-2',
    category_id: 'cat-1',
    name: 'Tandoori Chicken Wings',
    description: 'Smoked chicken wings tossed in fiery tandoori spices, lemon zest, and coriander.',
    price: 390,
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: false
  },
  {
    id: 'item-3',
    category_id: 'cat-1',
    name: 'Truffle Mushroom Bruschetta',
    description: 'Toasted sourdough topped with sautéed wild mushrooms, thyme, truffle oil, and shaved parmesan.',
    price: 340,
    image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-4',
    category_id: 'cat-1',
    name: 'Dahi Ke Kebab',
    description: 'Delicate hung-curd patties infused with cardamom, green chillies, and golden crispy exterior.',
    price: 290,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },

  // Mains
  {
    id: 'item-5',
    category_id: 'cat-2',
    name: 'Royal Butter Chicken',
    description: 'Tender pulled tandoori chicken simmered in rich creamy tomato and cashew nut gravy with fenugreek.',
    price: 460,
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: false
  },
  {
    id: 'item-6',
    category_id: 'cat-2',
    name: 'Paneer Butter Masala',
    description: 'Fresh cottage cheese simmered in a velvety, spiced butter and tomato-cashew reduction.',
    price: 410,
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-7',
    category_id: 'cat-2',
    name: 'Dum Biryani (Hyderabadi Style)',
    description: 'Fragrant aged basmati rice cooked on slow dum with aromatic whole spices, saffron, and tender marinated cuts.',
    price: 480,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: false
  },
  {
    id: 'item-8',
    category_id: 'cat-2',
    name: 'Creamy Penne Alfredo with Garlic Bread',
    description: 'Artisan penne pasta tossed in garlic parmesan white sauce with sun-dried tomatoes and herbs.',
    price: 380,
    image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-9',
    category_id: 'cat-2',
    name: 'Dal Makhani Bukhara',
    description: 'Slow-cooked black lentils simmered for 24 hours with butter, cream, and mild Kashmiri spices.',
    price: 360,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-10',
    category_id: 'cat-2',
    name: 'Garlic Butter Naan (2 pcs)',
    description: 'Crisp, blistered clay-oven flatbread brushed with roasted garlic and melted butter.',
    price: 90,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },

  // Desserts
  {
    id: 'item-11',
    category_id: 'cat-3',
    name: 'Gulab Jamun with Rabri',
    description: 'Warm, soft milk-solid dumplings soaked in rose saffron syrup served with chilled thickened rabri.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-12',
    category_id: 'cat-3',
    name: 'Molten Chocolate Lava Cake',
    description: 'Decadent dark chocolate cake with a warm flowing ganache center and vanilla bean ice cream.',
    price: 280,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-13',
    category_id: 'cat-3',
    name: 'Classic New York Cheesecake',
    description: 'Velvety baked cream cheese over a graham cracker crust with berry compote drizzle.',
    price: 310,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },

  // Beverages
  {
    id: 'item-14',
    category_id: 'cat-4',
    name: 'Mango Cardamom Lassi',
    description: 'Thick, creamy Alphonso mango puree blended with chilled churned yogurt and cardamom sprinkle.',
    price: 180,
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-15',
    category_id: 'cat-4',
    name: 'Virgin Mint Mojito',
    description: 'Fresh muddled mint leaves, crushed lime wedges, sparkling soda, and cane sugar over crushed ice.',
    price: 190,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  },
  {
    id: 'item-16',
    category_id: 'cat-4',
    name: 'Masala Chai Pot',
    description: 'Authentic Indian black tea brewed with fresh ginger, crushed green cardamom, and full cream milk.',
    price: 120,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    is_veg: true
  }
];

export const seedTables = Array.from({ length: 20 }, (_, i) => ({
  id: `table-${i + 1}`,
  table_number: i + 1,
  capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
  status: 'vacant',
  qr_code_url: `/menu?table=${i + 1}`
}));
