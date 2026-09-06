import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.scss";
import { FaShoppingCart, FaSearch, FaTimes } from "react-icons/fa";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const formatPrice = (price) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

function Rating({ value = 0, count }) {
  const roundedRating = Math.round(value * 2) / 2;
  const stars = Array.from({ length: 5 }, (_, index) => {
    const position = index + 1;
    if (roundedRating >= position) return <BsStarFill key={position} />;
    if (roundedRating === position - 0.5) return <BsStarHalf key={position} />;
    return <BsStar key={position} />;
  });
  return <div className="rating" aria-label={`Avaliação: ${value} de 5`}><span className="rating-stars" aria-hidden="true">{stars}</span>{count !== undefined && <span>{count} avaliações</span>}</div>;
}

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      try {
        const response = await axios.get("https://fakestoreapi.com/products", { signal: controller.signal });
        setProducts(response.data); setStatus("success");
      } catch (error) { if (error.name !== "CanceledError") setStatus("error"); }
    }
    fetchProducts(); return () => controller.abort();
  }, []);
  useEffect(() => {
    const closeWithEscape = (event) => event.key === "Escape" && setSelectedProduct(null);
    window.addEventListener("keydown", closeWithEscape); return () => window.removeEventListener("keydown", closeWithEscape);
  }, []);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))].sort(), [products]);
  const filteredProducts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return products.filter((p) => !selectedCategory || p.category === selectedCategory).filter((p) => !keyword || p.title.toLowerCase().includes(keyword)).sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);
  }, [products, searchKeyword, selectedCategory, sortOrder]);
  return <div className="app-shell">
    <header className="navbar"><div className="navbar-content"><a className="brand" href="#produtos">Nexa<span>Store</span></a><div className="cart-button"><FaShoppingCart aria-hidden="true" /><span>Carrinho</span></div></div></header>
    <main className="container" id="produtos">
      <section className="hero"><p className="eyebrow">Coleção selecionada</p><h1>Encontre algo que combine com você.</h1><p>Produtos para todos os estilos, com uma experiência de compra simples.</p></section>
      <section className="filters" aria-label="Filtros de produtos">
        <label className="search-field"><FaSearch aria-hidden="true" /><span className="sr-only">Buscar produtos</span><input type="search" placeholder="Buscar por produto..." value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} /></label>
        <label><span>Categoria</span><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}><option value="">Todas</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label><span>Ordenar por</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="asc">Menor preço</option><option value="desc">Maior preço</option></select></label>
      </section>
      <div className="catalog-heading"><div><p className="eyebrow">Catálogo</p><h2>Produtos em destaque</h2></div>{status === "success" && <p>{filteredProducts.length} produtos encontrados</p>}</div>
      {status === "loading" && <p className="feedback" role="status">Carregando produtos...</p>}
      {status === "error" && <p className="feedback error" role="alert">Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.</p>}
      {status === "success" && filteredProducts.length === 0 && <p className="feedback">Nenhum produto foi encontrado com esses filtros.</p>}
      <div className="product-list">{filteredProducts.map((product) => <article key={product.id} className="product-card"><button className="product-image" type="button" onClick={() => setSelectedProduct(product)} aria-label={`Ver detalhes de ${product.title}`}><img src={product.image} alt="" /></button><p className="product-category">{product.category}</p><h3>{product.title}</h3><Rating value={product.rating?.rate} count={product.rating?.count} /><div className="product-bottom"><p className="price">{formatPrice(product.price)}</p></div></article>)}</div>
    </main>
    {selectedProduct && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedProduct(null)}><section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="close-button" type="button" onClick={() => setSelectedProduct(null)} aria-label="Fechar detalhes"><FaTimes aria-hidden="true" /></button><div className="product-modal-image"><img src={selectedProduct.image} alt={selectedProduct.title} /></div><div className="product-modal-details"><p className="product-category">{selectedProduct.category}</p><h2 id="modal-title">{selectedProduct.title}</h2><Rating value={selectedProduct.rating?.rate} count={selectedProduct.rating?.count} /><p className="price">{formatPrice(selectedProduct.price)}</p><p className="description">{selectedProduct.description}</p></div></section></div>}
    <footer className="footer">© {new Date().getFullYear()} NexaStore. Projeto demonstrativo.</footer>
  </div>;
}
export default App;
