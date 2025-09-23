const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe-order-sweet-receipts';

const menuItems = [
  // COFFEE LOVER (NEW)
  { name: 'Coffee Nirvana', price: 120, imageUrl: 'https://i.pinimg.com/1200x/71/a5/62/71a56235307038a80fb3ce4bf5d09a34.jpg', category: 'Coffee Lover' },
  { name: 'Espresso 1 Shot', price: 40, imageUrl: 'https://i.pinimg.com/736x/a2/d6/0e/a2d60ee8a87657525de4ecfe1e6b803e.jpg', category: 'Coffee Lover' },
  { name: 'Espresso Romano', price: 60, imageUrl: 'https://i.pinimg.com/736x/b1/e6/df/b1e6dfde3da49f5d6534b68ac10918a4.jpg', category: 'Coffee Lover' },
  { name: 'Macchiato', price: 70, imageUrl: 'https://i.pinimg.com/1200x/c1/b3/ff/c1b3ffe379a90ef2ddb42f7b6c667a94.jpg', category: 'Coffee Lover' },
  // HOT BEVERAGES
  { name: 'Cappuccino', price: 0, imageUrl: 'https://i.pinimg.com/736x/f8/56/1e/f8561ea80e14bd1989b4fe87736e1468.jpg' },
  { name: 'Vennila Cappuccino', price: 0, imageUrl: 'https://i.pinimg.com/736x/5a/6a/08/5a6a085e7aec80da1ffebeac661a109e.jpg' },
  { name: 'Hazelnut Cappuccino', price: 0, imageUrl: 'https://i.pinimg.com/1200x/cd/9c/46/cd9c46c324127c347798f53b7f55996c.jpg' },
  { name: 'Latte', price: 0, imageUrl: 'https://i.pinimg.com/736x/f0/65/5f/f0655f2737da76be9b4ac435c65e3d9b.jpg' },
  { name: 'Vennila Latte', price: 0, imageUrl: 'https://i.pinimg.com/1200x/1c/5b/fb/1c5bfb32fecd0c138b99631a9a160bad.jpg' },
  { name: 'Hazelnut Latte', price: 0, imageUrl: 'https://i.pinimg.com/1200x/cd/9c/46/cd9c46c324127c347798f53b7f55996c.jpg' },
  { name: 'Hot Mocha', price: 0, imageUrl: 'https://i.pinimg.com/736x/22/8b/72/228b72a03cb98c19063193cf0188a6a3.jpg' },
  { name: 'Hot Chocolate', price: 0, imageUrl: 'https://i.pinimg.com/736x/92/4d/da/924ddab4f7ad7192b593baab3603c1d5.jpg' },
  { name: 'Americano', price: 0, imageUrl: 'https://i.pinimg.com/736x/de/72/1c/de721cf98ef9c6a06906e094fe337f4e.jpg' },
  { name: 'Espresso', price: 0, imageUrl: 'https://i.pinimg.com/736x/b4/f5/ad/b4f5ad1461dec75462325d2a30264c04.jpg' },
  { name: 'Espresso Romano', price: 0, imageUrl: 'https://i.pinimg.com/736x/db/35/1d/db351d7b69fe2ce291bbde648fcefec7.jpg' },
  { name: 'Wippy Hot Mocha', price: 0, imageUrl: 'https://i.pinimg.com/1200x/80/af/5f/80af5f93e6c721249c7f4ef83f1583d1.jpg' },
  { name: 'Instant Coffee', price: 20, imageUrl: 'https://i.pinimg.com/736x/b4/f5/ad/b4f5ad1461dec75462325d2a30264c04.jpg' },
  { name: 'Milk', price: 15, imageUrl: 'https://i.pinimg.com/1200x/10/1b/12/101b12bb1461e61f9de2c1eb840db9fe.jpg' },
  // COLD BEVERAGES
  { name: 'Cold coffee', price: 0, imageUrl: 'https://i.pinimg.com/1200x/db/ae/64/dbae64ad1529f3f9b74b91b19f21620a.jpg' },
  { name: 'Hazelnut Frappe', price: 0, imageUrl: 'https://i.pinimg.com/736x/db/12/65/db1265b9e7b0f61b1580c47b4073e783.jpg' },
  { name: 'Iced Latte', price: 0, imageUrl: 'https://i.pinimg.com/736x/1e/67/b7/1e67b7c6fcbd33018697e88fafdd8f7c.jpg' },
  { name: 'Iced Mocha', price: 0, imageUrl: 'https://i.pinimg.com/1200x/c8/ad/10/c8ad107ac4da5b217944daaa25f78bea.jpg' },
  { name: 'H3 Devils', price: 0, imageUrl: 'https://i.pinimg.com/736x/82/33/a0/8233a09ba26e0e430a47612b84d66bbd.jpg' },
  { name: 'Strawberry Frappe', price: 0, imageUrl: 'https://i.pinimg.com/736x/1b/7e/be/1b7ebeb50c01ced69964ffef2ca9f7ee.jpg' },
  { name: 'Mango Frappe', price: 0, imageUrl: 'https://i.pinimg.com/736x/44/0e/83/440e838cc4c2991fbefbf38a5f8fe3ee.jpg' },
  { name: 'Choco Frappy', price: 0, imageUrl: 'https://i.pinimg.com/736x/8c/3c/fd/8c3cfd6d32b634ab37c6b6e874b69928.jpg' },
  { name: 'Peanut Choco Frappe', price: 0, imageUrl: 'https://i.pinimg.com/1200x/dd/a1/67/dda1677e7f1a2473e3c9c26ded5d203b.jpg' },
  // SPARKLINGS
  { name: 'Iced Americano', price: 0, imageUrl: 'https://i.pinimg.com/1200x/e8/06/81/e8068186818ad7f0223acf7732643d98.jpg' },
  { name: 'Lemon Iced Tea', price: 0, imageUrl: 'https://i.pinimg.com/736x/c9/c9/9b/c9c99bbdd968c2448b222c6b7bb5b6c4.jpg' },
  { name: 'Strawberry Iced Tea', price: 0, imageUrl: 'https://i.pinimg.com/1200x/e1/ed/86/e1ed86825f6d1b89ce9c68d00fba81af.jpg' },
  { name: 'Mojito', price: 0, imageUrl: 'https://i.pinimg.com/1200x/57/cd/dd/57cddd925ee9c23164c2cfb69faf0e92.jpg' },
  { name: 'Green Apple Mojito', price: 0, imageUrl: 'https://i.pinimg.com/736x/a5/05/57/a50557d789ec53eb8dcbb7eb74b92882.jpg' },
  { name: 'Orange Mojito', price: 100, imageUrl: 'https://i.pinimg.com/1200x/3f/b2/11/3fb211f15ee6b0cb9342e91bebf3e5ea.jpg' },
  { name: 'Strawberry Mojito', price: 150, imageUrl: 'https://i.pinimg.com/1200x/5c/da/e5/5cdae51c7ea99515926e457c128ee225.jpg' },
  { name: 'Strawberry Basil Mojito', price: 160, imageUrl: 'https://i.pinimg.com/736x/dc/2a/85/dc2a85137fee62793d865c037aeb06d1.jpg' },
  { name: 'Blue Lady', price: 120, imageUrl: 'https://i.pinimg.com/1200x/4d/c1/17/4dc117d0e99a89100aec3f47d6737f18.jpg' },
  // VEG SNACKS
  { name: 'Cheese Garlic Bomb(Korean)', price: 0, imageUrl: 'https://i.pinimg.com/736x/7f/4b/12/7f4b1201b6c8da63a419ab23435a156e.jpg' },
  { name: 'Cheese Balls', price: 0, imageUrl: 'https://i.pinimg.com/736x/2b/f1/24/2bf124a8ae1c13c73d9ddb3e05176c18.jpg' },
  { name: 'Avo Toast', price: 0, imageUrl: 'https://i.pinimg.com/736x/35/07/4f/35074f51b7d779c43f6ff49f43b7d515.jpg' },
  { name: 'Chilli Garlic Bread', price: 0, imageUrl: 'https://i.pinimg.com/1200x/d1/93/e2/d193e2ae90dcc3e24e6f534693e46a93.jpg' },
  { name: 'Cheese Garlic Bread', price: 0, imageUrl: 'https://i.pinimg.com/1200x/1e/ef/f9/1eeff9416fa750e1ecdc32d4c9d3ff43.jpg' },
  { name: 'Veg Wrap', price: 0, imageUrl: 'https://i.pinimg.com/1200x/b5/9e/76/b59e76ba0980d92413a0ed8add3b5f90.jpg' },
  { name: 'Veg Burger', price: 0, imageUrl: 'https://i.pinimg.com/736x/dc/41/0c/dc410c7fc60c5847d07243482a4fb1ad.jpg' },
  { name: 'Spicy Veg Burger', price: 0, imageUrl: 'https://i.pinimg.com/736x/2e/cd/ff/2ecdffe0cff2de575ec82f0f188debac.jpg' },
  { name: 'Veg Twin Burger', price: 220, imageUrl: 'https://i.pinimg.com/736x/dc/41/0c/dc410c7fc60c5847d07243482a4fb1ad.jpg' },
  { name: 'Spicy Veg Twin Burger', price: 240, imageUrl: 'https://i.pinimg.com/736x/2e/cd/ff/2ecdffe0cff2de575ec82f0f188debac.jpg' },
  // NON-VEG SNACKS
  { name: 'Golden Chicky Wrap', price: 160, imageUrl: 'https://i.pinimg.com/1200x/05/ba/6c/05ba6c08d8eb8d4b2035eb10462b6328.jpg' },
  { name: 'Chicky Wrap', price: 150, imageUrl: 'https://i.pinimg.com/1200x/b3/36/d1/b336d18b22b9263a02d7f0fe17f42d4c.jpg' },
  { name: 'Eggbell Wrap', price: 0, imageUrl: 'https://i.pinimg.com/736x/3a/79/1d/3a791dbf354995dbbd437a4623690642.jpg' },
  { name: 'Spring Fry(Hot Dog)', price: 0, imageUrl: 'https://i.pinimg.com/736x/2e/61/58/2e615816d7a6a2d7a2d28bb4b1f79f4e.jpg' },
  { name: 'Chicky Cheese Garlic Bomb(Korean)', price: 0, imageUrl: 'https://i.pinimg.com/1200x/ea/e8/34/eae83495a307b0c89fb40a75ac2c861d.jpg' },
  { name: 'Chicky Nuggets', price: 0, imageUrl: 'https://i.pinimg.com/736x/d4/29/e8/d429e802340dd3ea7465182adfba959f.jpg' },
  { name: 'Chicky Burger', price: 0, imageUrl: 'https://i.pinimg.com/736x/7f/ca/38/7fca38e9d231422f59433ffa7411f3cd.jpg' },
  { name: 'Spicy Chicky Burger', price: 0, imageUrl: 'https://i.pinimg.com/1200x/8b/5e/0b/8b5e0b79be294df37ed82917b60861c9.jpg' },
  { name: 'Chicky Pops', price: 0, imageUrl: 'https://i.pinimg.com/1200x/7c/16/ca/7c16caad0186eca4c385123aaf56bf64.jpg' },
  { name: 'Chicky Cheese ball', price: 0, imageUrl: 'https://i.pinimg.com/736x/c8/cd/a9/c8cda9673f5e3a4ade8369db5bc22894.jpg' },
  { name: 'Non-Veg Twin Burger', price: 260, imageUrl: 'https://i.pinimg.com/736x/7f/ca/38/7fca38e9d231422f59433ffa7411f3cd.jpg' },
  { name: 'Spicy Non-Veg Twin Burger', price: 280, imageUrl: 'https://i.pinimg.com/1200x/8b/5e/0b/8b5e0b79be294df37ed82917b60861c9.jpg' },
  // VEG FRIES
  { name: 'French Fries', price: 0, imageUrl: 'https://i.pinimg.com/736x/7c/af/e9/7cafe93e17792d26f12919260b380f2a.jpg' },
  { name: 'Cheesy Fries', price: 0, imageUrl: 'https://i.pinimg.com/736x/fe/00/47/fe00473ee205b8562ffbf6ec8f06682f.jpg' },
  { name: 'Peri Peri Fries', price: 0, imageUrl: 'https://i.pinimg.com/736x/fe/00/47/fe00473ee205b8562ffbf6ec8f06682f.jpg' },
  { name: 'Veg Loaded Fries', price: 0, imageUrl: 'https://i.pinimg.com/736x/23/7d/5e/237d5ed01014de9bc47b366119ce3a77.jpg' },
  // NON-VEG FRIES
  { name: 'Chicky Loaded Fries', price: 0, imageUrl: 'https://i.pinimg.com/736x/86/9c/52/869c528679862d37f1cce6027939a39f.jpg' },
  { name: 'Peri Peri Chicky Loaded Fries', price: 0, imageUrl: 'https://i.pinimg.com/1200x/b1/9f/5b/b19f5ba8ffd27b07a7ab1044b1e174ae.jpg' },
  { name: 'Chicky Garlic Loaded Fries', price: 0, imageUrl: 'https://i.pinimg.com/1200x/b5/19/bb/b519bb5ff1996d4ef64b5f126a26e46e.jpg' },
  { name: 'Sausage Loaded Fries', price: 0, imageUrl: 'https://i.pinimg.com/1200x/a1/18/6e/a1186e7835954ec02cf3f4edcb5abed3.jpg' },
  // DESSERTS
  { name: 'Vennila Scope', price: 0, imageUrl: 'https://i.pinimg.com/1200x/36/40/1c/36401c4cf41352071947d62c40afaa19.jpg' },
  { name: 'Vennila Honey', price: 0, imageUrl: 'https://i.pinimg.com/1200x/03/dc/85/03dc852b6e8c72737baa73a8cd12bc74.jpg' },
  { name: 'Affogato', price: 0, imageUrl: 'https://i.pinimg.com/736x/3e/72/a4/3e72a46e744028f3f3087adebdcb6e15.jpg' },
  { name: 'Coffee Crisp Bowl', price: 0, imageUrl: 'https://i.pinimg.com/1200x/a7/db/00/a7db005dbdb7be6cacb77d736e99c054.jpg' },
  { name: 'Honey Crisp Bowl', price: 0, imageUrl: 'https://i.pinimg.com/736x/95/3e/71/953e71d10118e233e6e90ab4f919e4d0.jpg' },
  { name: 'Strawberry Crisp Bowl', price: 0, imageUrl: 'https://i.pinimg.com/736x/02/ca/31/02ca31e9169188bb65b452bdab3e77eb.jpg' },
  { name: 'Orange Hon-Crisp Bowl', price: 0, imageUrl: 'https://i.pinimg.com/1200x/27/c9/ed/27c9edf110be7d2fc38ec5ffdf992545.jpg' },
  { name: 'Nutty Hon-Crisp Bowl', price: 0, imageUrl: 'https://i.pinimg.com/736x/b1/4d/27/b14d27738e9ba1d4375553722469994f.jpg' },
  { name: 'Figgy Hon-Crisp Bowl', price: 0, imageUrl: 'https://i.pinimg.com/1200x/40/d4/9d/40d49d59a7152f609118e2b720145b64.jpg' },
  { name: 'Banana Hon-Crisp Bowl', price: 0, imageUrl: 'https://i.pinimg.com/736x/83/82/2d/83822d410173f2ef2de7b82a7ebde00a.jpg' },
  { name: 'Brownie', price: 0, imageUrl: 'https://i.pinimg.com/1200x/3f/b0/eb/3fb0eb836ff71a4bb8c0a32824e58a85.jpg' },
  { name: 'Brownie with Ice Cream', price: 80, imageUrl: 'https://i.pinimg.com/1200x/8f/8a/16/8f8a16aacb8e5b550dd34961dc3d932d.jpg' },
  { name: 'Mango Topped Ice Cream', price: 0, imageUrl: 'https://i.pinimg.com/1200x/ae/38/58/ae3858a073993023932bcf972bace1fe.jpg' },
  { name: 'Strawberry Topped Ice Cream', price: 0, imageUrl: 'https://i.pinimg.com/1200x/c0/4a/30/c04a309a82b8026a6f2e8a356fac37ea.jpg' },
  { name: 'Choco Topped Ice Cream', price: 0, imageUrl: 'https://i.pinimg.com/1200x/99/cf/42/99cf42f264127766fc5626f81d321efe.jpg' },
  // ADD-ONS
  { name: 'Chocolate Sauce', price: 0, imageUrl: 'https://i.pinimg.com/736x/86/ac/70/86ac7052f9acf98e1b77a60fea5b28b6.jpg' },
  { name: 'Mango Sauce', price: 0, imageUrl: 'https://i.pinimg.com/1200x/e8/aa/cf/e8aacf2b9fdf2e4f54b3f915162fc638.jpg' },
  { name: 'Strawberry Sauce', price: 0, imageUrl: 'https://i.pinimg.com/1200x/32/c2/a2/32c2a2cc40b48348f5cb6d6578e8efae.jpg' },
  { name: 'Brownie', price: 0, imageUrl: 'https://i.pinimg.com/1200x/3f/b0/eb/3fb0eb836ff71a4bb8c0a32824e58a85.jpg' },
  { name: 'Biscoff', price: 0, imageUrl: 'https://i.pinimg.com/1200x/4f/77/27/4f7727f267edb731b1e7be749a6b643e.jpg' },
  { name: 'Oreo', price: 0, imageUrl: 'https://i.pinimg.com/1200x/d8/76/fc/d876fc2380c6af9d6b4ffeb3c799848a.jpg' },
  { name: 'Fresh Cream', price: 0, imageUrl: 'https://i.pinimg.com/1200x/10/1b/12/101b12bb1461e61f9de2c1eb840db9fe.jpg' },
  { name: 'Vennila Scope', price: 0, imageUrl: 'https://i.pinimg.com/1200x/36/40/1c/36401c4cf41352071947d62c40afaa19.jpg' },
  { name: 'Cheese', price: 0, imageUrl: 'https://i.pinimg.com/1200x/a9/e5/15/a9e5153870538e36ffe90553ef5ffeb6.jpg' },
  { name: 'Mayo', price: 0, imageUrl: 'https://i.pinimg.com/1200x/f1/88/39/f18839bd715a7e845831ae52cbac18dc.jpg' },
  { name: 'Mojito Swap', price: 10, imageUrl: 'https://i.pinimg.com/1200x/57/cd/dd/57cddd925ee9c23164c2cfb69faf0e92.jpg' },
];

async function seedMenu() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    for (const item of menuItems) {
      await MenuItem.findOneAndUpdate(
        { name: item.name },
        item,
        { upsert: true, new: true }
      );
      console.log(`Seeded: ${item.name}`);
    }
    console.log('Menu seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedMenu(); 