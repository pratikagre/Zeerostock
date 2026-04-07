export default async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get('q');
  const category = url.searchParams.get('category');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');

  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return new Response(JSON.stringify({ message: 'Invalid price range: minPrice cannot be greater than maxPrice' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Define static data locally for Netlify Function to avoid path issues
  const inventoryData = [
    { id: 1, productName: "Office Chair", category: "Furniture", price: 120, supplier: "ABC Traders" },
    { id: 2, productName: "Standing Desk", category: "Furniture", price: 350, supplier: "Office World" },
    { id: 3, productName: "Wireless Mouse", category: "Electronics", price: 25, supplier: "Tech Supplies Inc" },
    { id: 4, productName: "Mechanical Keyboard", category: "Electronics", price: 85, supplier: "Tech Supplies Inc" },
    { id: 5, productName: "27-inch Monitor", category: "Electronics", price: 220, supplier: "Tech Supplies Inc" },
    { id: 6, productName: "Notebook 5-pack", category: "Stationery", price: 15, supplier: "Paper & Co" },
    { id: 7, productName: "Blue Pens 10-pack", category: "Stationery", price: 5, supplier: "Paper & Co" },
    { id: 8, productName: "Filing Cabinet", category: "Furniture", price: 180, supplier: "ABC Traders" },
    { id: 9, productName: "Desk Lamp", category: "Furniture", price: 45, supplier: "Office World" },
    { id: 10, productName: "USB-C Hub", category: "Electronics", price: 30, supplier: "Gadget Hub" },
    { id: 11, productName: "Noise Cancelling Headphones", category: "Electronics", price: 150, supplier: "Audio Experts" },
    { id: 12, productName: "Whiteboard 4x3", category: "Stationery", price: 80, supplier: "Office Depot" },
    { id: 13, productName: "Dry Erase Markers", category: "Stationery", price: 12, supplier: "Office Depot" },
    { id: 14, productName: "HDMI Cable 6ft", category: "Electronics", price: 8, supplier: "Tech Supplies Inc" },
    { id: 15, productName: "Ergonomic Footrest", category: "Furniture", price: 40, supplier: "Office World" }
  ];

  let results = inventoryData;

  if (q) {
    const searchString = q.toLowerCase();
    results = results.filter(item => item.productName.toLowerCase().includes(searchString));
  }

  if (category && category.trim() !== '') {
    const searchCategory = category.toLowerCase();
    results = results.filter(item => item.category.toLowerCase() === searchCategory);
  }

  if (minPrice && !isNaN(minPrice)) {
    results = results.filter(item => item.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(maxPrice)) {
    results = results.filter(item => item.price <= Number(maxPrice));
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = {
  path: "/api/search"
};
