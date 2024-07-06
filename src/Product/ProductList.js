import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { addProduct } from "../Store/cartSlice";
import AddWishlistModal from "../Cliente/WishList/WishListAdd";
import SortingDropdown from '../Menu/SortingDropdown'; 
import ProductSearchBar from "./ProductSearchBar.js";
import ViewProductModal from "./DetailsProduct"

const PRODUCT_URI = "https://shopp-7acee9852abd.herokuapp.com/product/";
const WISH_URI = "https://shopp-7acee9852abd.herokuapp.com/wish/";
const CATEGORY_URI = "https://shopp-7acee9852abd.herokuapp.com/category/";

export const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [categories, setCategories] = useState([]);
  const email = useSelector((state) => state.auth.correo);
  const role = useSelector((state) => state.auth.value);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const getProducts = async () => {
    try {
      const res = await axios.get(PRODUCT_URI);
      setProducts(res.data);
      setSortedProducts(res.data);
      setError('');
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setError('Error al cargar los productos');
      setProducts([]);
      setSortedProducts([]);
    }
  };

  const handleSearch = async (term, type) => {
    try {
      let queryParam = term;
      if (type === "categoria") {
        const selectedCategory = categories.find(category => category.CategoryName === term);
        if (selectedCategory) {
          queryParam = selectedCategory.Id;
        } else {
          throw new Error('Categoría no encontrada');
        }
      }

      const res = await axios.get(`${PRODUCT_URI}search`, { params: { query: queryParam, type } });
      setProducts(res.data);
      setSortedProducts(res.data);
      setError('');
    } catch (error) {
      console.error("Error al buscar productos:", error);
      setError('Error al buscar productos');
      setProducts([]);
      setSortedProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URI);
      setCategories(res.data);
      console.log("Categorias obtenidas:", res.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    getProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    sortProducts();
  }, [sortOption]);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  const onAddProduct = (product) => {
    dispatch(addProduct(product));
  };

  const onAddProductToWishlist = async (product) => {
    try {
      const data = {
        EmailUser: email,
        ProductID: product
      };
      await axios.post(WISH_URI, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setError('');
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al agregar a la wishlist:", error);
      setError('Error al agregar a la wishlist');
    }
  };

  const handleSortChange = (sortType) => {
    setSortOption(sortType);
  };

  const sortProducts = () => {
    let sorted = [...products];
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.Price - b.Price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.Price - a.Price);
        break;
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.DateAdded) - new Date(a.DateAdded));
        break;
        case 'popular':
        sorted.sort((a, b) => b.Vendidos - a.Vendidos);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  };

  const handleOpenModal = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
  };

  return (
    <div className="container">
      <SortingDropdown onSortChange={handleSortChange} />
      <ProductSearchBar onSearch={handleSearch} categories={categories} />
      <div className="container-items">
        {error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}
        {sortedProducts.map((product) => (
          <div className="item" key={product.Codigo}>
            <figure>
              {product.ProductImageBase64 && (
                <img
                  src={`data:image/jpeg;base64,${product.ProductImageBase64}`}
                  alt={product.ProductName}
                />
              )}
            </figure>
            <div className="info-product">
              <h2>{product.ProductName}</h2>
              <p className="price">${product.Price}</p>
              <p className="Descripcion1">{product.Descripcion1}</p>
              <p className="Descripcion2">{product.Descripcion2}</p>
              <p className="stock">Stock: {product.Quantity}</p>
              <button onClick={() => onAddProduct(product)}>
                Añadir al carrito
              </button>
              {role !== 0 && (
              <button onClick={() => onAddProductToWishlist(product.Codigo)}>
                Añadir a la lista de deseos
              </button>
              )}
              <button onClick={() => handleOpenModal(product.Codigo)}>
                Ver detalles
              </button>
            </div>
          </div>
        ))}
        <AddWishlistModal
          show={showSuccessModal}
          handleClose={handleCloseSuccessModal}
        />
        <ViewProductModal
          show={showModal}
          handleClose={handleCloseModal}
          productId={selectedProductId}
        />
      </div>
    </div>
  );
};

export default ProductList;