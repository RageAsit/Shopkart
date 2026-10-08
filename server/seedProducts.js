// Script to create and populate sample products using the createProduct endpoint (POST /products)
const BASE_URL = process.env.API_URL || 'http://localhost:8080';

const sampleProducts = [
  // --- ELECTRONICS ---
  {
    name: 'Ultra-Wide Curved Gaming Monitor 34"',
    description: '34-inch WQHD (3440 x 1440) 144Hz curved gaming display with HDR400, 1ms response time, and ultra-thin bezels for immersive productivity and gaming.',
    price: 34999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    stock: 8,
  },
  {
    name: 'Ergonomic Wireless Mouse',
    description: 'Precision ergonomic wireless mouse with multi-device connectivity, hyper-fast scroll wheel, and custom thumb controls for all-day comfort.',
    price: 1899,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    stock: 25,
  },
  {
    name: 'Smart Fitness Watch Series 5',
    description: 'Advanced AMOLED smartwatch featuring continuous heart rate, SpO2 tracking, sleep monitor, built-in GPS, and 7-day battery life.',
    price: 4499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    stock: 12,
  },

  // --- FASHION ---
  {
    name: 'Classic Denim Trucker Jacket',
    description: 'Timeless standard-fit denim jacket crafted from 100% durable cotton denim with button-flap chest pockets and side welt pockets.',
    price: 2499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    stock: 20,
  },
  {
    name: 'Minimalist White Leather Sneakers',
    description: 'Sleek low-top sneakers constructed with genuine full-grain leather, cushioned insoles, and durable vulcanized rubber outsoles.',
    price: 3299,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    stock: 14,
  },
  {
    name: 'Vintage Polarized Sunglasses',
    description: 'Retro handcrafted acetate frame sunglasses with UV400 polarized lenses that eliminate glare while providing rich visual clarity.',
    price: 1299,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    stock: 30,
  },
  {
    name: 'Heavyweight Oversized Hoodie',
    description: 'Ultra-soft 450 GSM fleece hoodie with dropped shoulders, roomy kangaroo pocket, and double-layered hood for ultimate warmth and style.',
    price: 1999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    stock: 18,
  },

  // --- BOOKS ---
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy & proven way to build good habits & break bad ones. Learn how tiny, incremental changes lead to remarkable, lasting results.',
    price: 599,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    stock: 40,
  },
  {
    name: 'The Pragmatic Programmer',
    description: '20th Anniversary Edition: Your journey to mastery. One of the most significant books on software craftsmanship, practical architecture, and career development.',
    price: 1499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    stock: 15,
  },
  {
    name: 'Clean Code: Handbook of Agile Craftsmanship',
    description: 'A must-read guide by Robert C. Martin detailing principles, patterns, and practices for writing readable, maintainable, and elegant software.',
    price: 1199,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    stock: 12,
  },
  {
    name: 'Designing Data-Intensive Applications',
    description: 'The definitive big ideas behind reliable, scalable, and maintainable systems by Martin Kleppmann. Key reference for distributed systems engineering.',
    price: 1899,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    stock: 10,
  },

  // --- HOME ---
  {
    name: 'Ceramic Pour-Over Coffee Dripper Set',
    description: 'Artisanal matte ceramic coffee dripper with heat-resistant glass carafe and measuring scoop for the perfect morning hand-drip brew.',
    price: 1299,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    stock: 22,
  },
  {
    name: 'Minimalist Nordic Desk Lamp',
    description: 'Modern architect lamp featuring touch controls, 3 adjustable color temperatures, smooth dimming, and flexible articulation.',
    price: 2199,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    stock: 16,
  },
  {
    name: 'Ultrasonic Aromatherapy Diffuser',
    description: 'Whisper-quiet 500ml ultrasonic cool-mist humidifier with soothing 7-color ambient LED lighting and automatic waterless shutoff.',
    price: 1599,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    stock: 25,
  },
  {
    name: 'Ergonomic Memory Foam Lumbar Cushion',
    description: 'High-density contoured memory foam back support cushion designed to promote healthy posture and reduce lower back pressure while working.',
    price: 1099,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    stock: 35,
  },
];

async function seedProducts() {
  console.log(`🚀 Adding products via createProduct endpoint (${BASE_URL}/products)...\n`);

  // Fetch current products to avoid duplicates
  let existingNames = new Set();
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    if (data && data.products) {
      data.products.forEach((p) => existingNames.add(p.name));
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch existing products from server:', err.message);
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const product of sampleProducts) {
    if (existingNames.has(product.name)) {
      console.log(`⏩ Skipped (already exists): "${product.name}"`);
      skippedCount++;
      continue;
    }

    try {
      const response = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.status === 201) {
        const created = await response.json();
        console.log(`✅ Created [${product.category}]: "${created.name}" (ID: ${created._id}) - ₹${created.price}`);
        createdCount++;
      } else {
        const errorData = await response.json();
        console.error(`❌ Failed to create "${product.name}":`, response.status, errorData);
      }
    } catch (err) {
      console.error(`❌ Error calling createProduct for "${product.name}":`, err.message);
    }
  }

  console.log(`\n🎉 Summary: ${createdCount} products created, ${skippedCount} skipped.`);
}

seedProducts();
