import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ProductSearchBar = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nombre');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchType);
    console.log(searchTerm);
    onSearch(searchTerm, searchType);
  };

  return (
    <Form onSubmit={handleSearch} className="mb-3">
      <Row>
        <Col md={8}>
          {searchType === 'categoria' ? (
            <Form.Control
              as="select"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.CategoryName}>
                  {category.CategoryName}
                </option>
              ))}
            </Form.Control>
          ) : (
            <Form.Control
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </Col>
        <Col md={3}>
          <Form.Control
            as="select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="categoria">Categoría</option>
            <option value="nombre">Nombre Producto</option>
            <option value="Descripcion">Descripción del producto</option>
          </Form.Control>
        </Col>
        <Col md={1}>
          <Button type="submit" variant="primary">
            Buscar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ProductSearchBar;