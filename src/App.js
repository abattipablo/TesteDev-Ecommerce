import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";
import { FaShoppingCart } from "react-icons/fa";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleSearchKeywordChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filterProducts = (product) => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    if (
      searchKeyword &&
      !product.title.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }
    return true;
  };

  const sortProducts = (a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  };

  const calculateRating = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (roundedRating >= i) {
        stars.push(<BsStarFill key={i} />);
      } else if (roundedRating === i - 0.5) {
        stars.push(<BsStarHalf key={i} />);
      } else {
        stars.push(<BsStar key={i} />);
      }
    }
    return stars;
  };

  const filteredProducts = products.filter(filterProducts).sort(sortProducts);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-blocks">
          <div className="navbar-title">Brand</div>
          <div className="navbar-cart">
            <FaShoppingCart className="cart-icon" />
            <div className="navbar-cart-text">Cart</div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="search-bar">
          <div className="search-blocks">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchKeyword}
              onChange={handleSearchKeywordChange}
            />
          </div>
          <div className="search-blocks">
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelry</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </div>
          <div className="search-blocks">
            <select value={sortOrder} onChange={handleSortOrderChange}>
              <option value="asc">Price - Low to High</option>
              <option value="desc">Price - High to Low</option>
            </select>
          </div>
        </div>

        <h1>Products</h1>

        <div className="product-list">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product"
              onClick={() => handleProductClick(product)}
            >
              <img src={product.image} alt={product.title} />
              <h2>{product.title}</h2>
              <div className="rating">
                {calculateRating(product.rating.rate)}
              </div>
              <p className="price">
                <span className="currency">$</span>
                {product.price}
              </p>
              <p className="reviews">{product.rating.count} reviews</p>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="product-modal">
          <div className="modal-content">
            <div className="product-modal-image">
              <img src={selectedProduct.image} alt={selectedProduct.title} />
            </div>
            <div className="product-modal-details">
              <h2>{selectedProduct.title}</h2>
              <div className="rating">
                {calculateRating(selectedProduct.rating.rate)}
              </div>
              <p className="price">
                <span className="currency">$</span>
                {selectedProduct.price}
              </p>
              <p className="description">{selectedProduct.description}</p>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p className="footer-text">© 2023 All rights reserved. Abatti</p>
      </footer>
    </div>
  );
};

export default App;
