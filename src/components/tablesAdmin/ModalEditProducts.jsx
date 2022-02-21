import axios from "axios";
import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import swal from "sweetalert";

export default function ModalEditProducts(props) {
  const { showModalEditar, closeModal, productFind, getProductos } = props;
  const [input, setInput] = useState({
    name: productFind.name,
    description: productFind.description,
    image: productFind.image,
    background: productFind.background,
    category: productFind.category,
    price: productFind.price,
    discount: productFind.discount
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    const newInput = { ...input, [name]: value };
    setInput(newInput);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.put(`https://proyecto-final-db.herokuapp.com/api/productos/${productFind._id}`, input)
      swal("Producto modificado");
      await getProductos();
      closeModal();
      getProductos();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Modal show={showModalEditar} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-register px-3" onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3 row">
              <Form.Label className="col-12 col-md-3">Nombre:</Form.Label>
              <input
                className="col-12 col-md-9"
                name="name"
                onChange={(e) => handleChange(e)}
                required
                type="text"
                defaultValue={productFind.name}
              />
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="description">
              <Form.Label className="col-12 col-md-3">Descripcion:</Form.Label>
              <input
                className="col-12 col-md-9"
                name="description"
                onChange={(e) => handleChange(e)}
                required
                type="text"
                defaultValue={productFind.description}
              />
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="image">
              <Form.Label className="col-12 col-md-3">Imagen:</Form.Label>
              <input
                className="col-12 col-md-9"
                name="image"
                onChange={(e) => handleChange(e)}
                required
                type="text"
                defaultValue={productFind.image}
              />
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="background">
              <Form.Label className="col-12 col-md-3">Imagen fondo:</Form.Label>
              <input
                className="col-12 col-md-9"
                name="background"
                onChange={(e) => handleChange(e)}
                required
                type="text"
                defaultValue={productFind.background}
              />
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="category">
              <Form.Label className="col-12 col-md-3">Categoria:</Form.Label>
              <select name="category" onChange={(e) => handleChange(e)} className="col-12 col-md-9" required>
                <option value="" disabled selected={""}>Tipo de vino...</option>
                <option value="Rojo">Rojo</option>
                <option value="Espumoso">Espumoso</option>
                <option value="Blanco">Blanco</option>
              </select>
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="price">
              <Form.Label className="col-12 col-md-3">Precio:</Form.Label>
              <input
                className="col-12 col-md-9"
                name="price"
                onChange={(e) => handleChange(e)}
                required
                type="text"
                defaultValue={productFind.price}
              />
            </Form.Group>
            <Form.Group className="mb-3 row" controlId="discount">
              <Form.Label className="col-12 col-md-3">Descuento:</Form.Label>
              <input
                className="col-12 col-md-9"
                name="discount"
                onChange={(e) => handleChange(e)}
                required
                type="text"
                defaultValue={productFind.discount}
              />
            </Form.Group>
            <hr />
            <div className="d-flex justify-content-center">
              <button type="submit" className="m-auto btn-admin ">
                <h5 className="text-center m-0 py-2  ">Guardar cambios</h5>
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
