import { useState, useEffect  } from 'react';
import Swal from "sweetalert2";
import { 
    Smartphone, 
    Laptop, 
    Headphones, 
    Package, 
    Search,
    AlertCircle,
    Battery,
    Tablet,
    Monitor,
    LayoutGrid,
    List,
    SlidersHorizontal,
    ChevronRight,
    Tv,
    Watch,
    Speaker,
    Camera,
    Filter
  } from 'lucide-react';
  
import axios from 'axios';
  
function ProductView() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);

  // const products = [
  //   // Samsung Phones
  //   {
  //     id: 1,
  //     name: "Samsung",
  //     category: "Smartphones",
  //     stock: 11,
  //     price: 1199,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["Galaxy S25", "Galaxy S24+", "Galaxy A54"],
  //   },
  //   {
  //     id: 2,
  //     name: "Samsung Galaxy S24+",
  //     category: "Smartphones",
  //     stock: 20,
  //     price: 999,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["50MP Camera", '6.7" Display', "Snapdragon 8 Gen 3"],
  //   },
  //   {
  //     id: 3,
  //     name: "Samsung Galaxy A54",
  //     category: "Smartphones",
  //     stock: 30,
  //     price: 449,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["50MP Camera", '6.4" AMOLED', "5G", "IP67"],
  //   },
  //   {
  //     id: 4,
  //     name: "Samsung Galaxy A34",
  //     category: "Smartphones",
  //     stock: 15,
  //     price: 399,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["48MP Camera", '6.6" AMOLED', "5G"],
  //   },

  //   // Vivo Phones
  //   {
  //     id: 5,
  //     name: "Vivo X100 Pro",
  //     category: "Smartphones",
  //     stock: 8,
  //     price: 899,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "Low Stock",
  //     features: ["50MP Camera", "Zeiss Optics", "Dimensity 9300", "5G"],
  //   },
  //   {
  //     id: 6,
  //     name: "Vivo V29",
  //     category: "Smartphones",
  //     stock: 12,
  //     price: 499,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["50MP Camera", "Aura Light", "5G"],
  //   },
  //   {
  //     id: 7,
  //     name: "Vivo Y36",
  //     category: "Smartphones",
  //     stock: 25,
  //     price: 299,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["50MP Camera", "5000mAh Battery", "44W Charging"],
  //   },

  //   // iPhone Models
  //   {
  //     id: 8,
  //     name: "iPhone 15 Pro Max",
  //     category: "Smartphones",
  //     stock: 15,
  //     price: 1199,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["48MP Camera", "A17 Pro", "Titanium Frame", "5G"],
  //   },
  //   {
  //     id: 9,
  //     name: "iPhone 15",
  //     category: "Smartphones",
  //     stock: 20,
  //     price: 799,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["48MP Camera", "A16 Bionic", "USB-C", "5G"],
  //   },

  //   // Google Phones
  //   {
  //     id: 10,
  //     name: "Google Pixel 8 Pro",
  //     category: "Smartphones",
  //     stock: 12,
  //     price: 999,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["50MP Camera", "Tensor G3", "AI Features", "5G"],
  //   },
  //   {
  //     id: 11,
  //     name: "Google Pixel 8",
  //     category: "Smartphones",
  //     stock: 18,
  //     price: 699,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["50MP Camera", "Tensor G3", "5G"],
  //   },

  //   // OnePlus Phones
  //   {
  //     id: 12,
  //     name: "OnePlus 12",
  //     category: "Smartphones",
  //     stock: 0,
  //     price: 899,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "Out of Stock",
  //     features: ["50MP Camera", "Snapdragon 8 Gen 3", "100W Charging", "5G"],
  //   },
  //   {
  //     id: 13,
  //     name: "OnePlus Nord CE 3",
  //     category: "Smartphones",
  //     stock: 22,
  //     price: 399,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["64MP Camera", "5G", "Fast Charging"],
  //   },

  //   // Xiaomi Phones
  //   {
  //     id: 14,
  //     name: "Xiaomi 14 Pro",
  //     category: "Smartphones",
  //     stock: 10,
  //     price: 999,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "Low Stock",
  //     features: [
  //       "50MP Leica Camera",
  //       "Snapdragon 8 Gen 3",
  //       "120W Charging",
  //       "5G",
  //     ],
  //   },
  //   {
  //     id: 15,
  //     name: "Xiaomi Redmi Note 13 Pro",
  //     category: "Smartphones",
  //     stock: 28,
  //     price: 349,
  //     icon: <Smartphone className="w-6 h-6" />,
  //     status: "In Stock",
  //     features: ["200MP Camera", "67W Charging", "5G"],
  //   },
  // ];

 

  const [product, setProduct] = useState([]); // Initialize state to hold an array of products
  const [productLS, setProductLS] = useState([]); 
  const [productOS, setProductOS] = useState([]); 
  const products =product

  useEffect(() => {
    // Fetch product data
    const fetchData = async () => {
      
      const apiUrl = import.meta.env.VITE_APP_BACKENDPRODUCT;
      const apiUrlLS = import.meta.env.VITE_APP_BACKENDPRODUCTLS;
      const apiUrlOS = import.meta.env.VITE_APP_BACKENDPRODUCTOS;

      try {
        const response = await axios.get(apiUrl);
        const responseLS = await axios.get(apiUrlLS);
        setProductLS(responseLS.data.lowStockVariantCount);
        const responseOS = await axios.get(apiUrlOS);
        setProductOS(responseOS.data.outOfStockVariantCount)
        // Log full response to check its structure
        console.log(response.data);

        const backendData = response.data.getProduct; // Array of products

        // Transform the backend data into the desired format
        const transformedData = backendData.map((product, index) => {
          const productVariants = Array.isArray(product.productVariants) ? product.productVariants : [];

          return {
            id: product._id || index + 1, // Use the _id or fall back to index as id
            name: product.productName || 'N/A',
            category: product.productCategory || 'N/A', 
            stock: productVariants.length > 0
              ? productVariants.reduce((acc, variant) => acc + (variant.stock || 0), 0)
              : product.productStock || 0, // Handle stock if variants are empty
            price: productVariants.length > 0
              ? productVariants[0].price
              : product.productTotalWorth || 0, // Handle price fallback
            icon: <Smartphone className="w-6 h-6" />, // You can conditionally change this based on category
            status: product.productStockStatus || 'Unknown',
            features: productVariants.map(variant => variant.name) || [], // Assuming productVariants have features
          };
        });

        // Update the product state with the transformed data
        setProduct(transformedData);
        console.log("Transformed Product data:", transformedData);
        

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStockBarColor = (stock) => {
    if (stock === 0) return "bg-red-500";
    if (stock <= 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];
  const subCategories = [
    "all",
    ...new Set(products.map((product) => product.subCategory)),
  ];
  const brands = ["all", ...new Set(products.map((product) => product.brand))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSubCategory =
      selectedSubCategory === "all" ||
      product.subCategory === selectedSubCategory;
    const matchesBrand =
      selectedBrand === "all" || product.brand === selectedBrand;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubCategory &&
      matchesBrand &&
      matchesPrice
    );
  });

  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
  // const lowStockItems = products.filter(
  //   (product) => product.status === "Low Stock"
  // ).length;
  const lowStockItems = productLS;
  // const outOfStockItems = products.filter(
  //   (product) => product.status === "Out of Stock"
  // ).length;
  const outOfStockItems = productOS;

  const StatCard = ({ title, value, icon, color, textColor }) => (
    <div className="card-gradient rounded-2xl shadow-lg p-6 hover-scale">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="card-gradient rounded-2xl shadow-lg hover-scale overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-xl ${
                    product.status === "In Stock"
                      ? "bg-gradient-to-br from-blue-50 to-blue-100"
                      : "bg-gradient-to-br from-gray-50 to-gray-100"
                  }`}
                >
                  {product.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {product.subCategory}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-blue-600">
                    {product.brand}
                  </p>
                </div>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                  product.status
                )}`}
              >
                {product.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            {product.features && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Stock Level</span>
                <span className="font-medium">{product.stock} units</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`${getStockBarColor(
                    product.stock
                  )} h-full rounded-full transition-all duration-500`}
                  style={{
                    width: `${Math.min((product.stock / 30) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm text-gray-500">Total Worth</p>
                  <p className="font-bold text-lg text-blue-600">
                    ${product.price}
                  </p>
                </div>
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                  onClick={() =>
                    Swal.fire({
                      icon: "info",
                      text: "Edit functionality would go here",
                    })
                  }
                >
                  Edit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    
    <div className="space-y-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="card-gradient rounded-2xl shadow-lg hover-scale"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-xl ${
                    product.status === "In Stock"
                      ? "bg-gradient-to-br from-blue-50 to-blue-100"
                      : "bg-gradient-to-br from-gray-50 to-gray-100"
                  }`}
                >
                  {product.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  {product.features && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-semibold text-blue-600">
                    {product.stock} units
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-bold text-blue-600">${product.price}</p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-effect fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-xl">
                <Package className="w-7 h-7" />
              </div>
              Electronic Shop Storage
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2.5 hover:bg-white/50 rounded-xl transition-colors"
                title={
                  viewMode === "grid"
                    ? "Switch to list view"
                    : "Switch to grid view"
                }
              >
                {viewMode === "grid" ? (
                  <List className="w-5 h-5" />
                ) : (
                  <LayoutGrid className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl transition-colors ${
                  showFilters ? "bg-blue-500 text-white" : "hover:bg-white/50"
                }`}
                title="Toggle filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Items in Stock"
            value={totalStock}
            icon={<Package className="w-6 h-6 text-blue-600" />}
            color="bg-gradient-to-br from-blue-50 to-blue-100 "
            textColor="text-blue-600"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockItems}
            icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
            color="bg-gradient-to-br from-yellow-50 to-yellow-100"
            textColor="text-yellow-600"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockItems}
            icon={<Battery className="w-6 h-6 text-red-600" />}
            color="bg-gradient-to-br from-red-50 to-red-100"
            textColor="text-red-600"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name or description..."
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
          </div>

          {showFilters && (
            <div className="card-gradient rounded-2xl shadow-lg p-6 animate-fade-in">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          if (category === "all") setSelectedSubCategory("all");
                        }}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products */}
        <div className="animate-fade-in">
          {viewMode === "grid" ? <GridView /> : <ListView />}
        </div>
      </main>
    </div>
  );
}

export default ProductView;