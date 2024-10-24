import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = () => {
    const [product, setProduct] = useState({
        product_code: '',
        name: '',
        description: '',
        price: '',
        qty: '',
        date_added: ''
    });

    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    useEffect(() => {
        fetchProducts(); // Fetching
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5173/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editing) {
            // Create new product
            try {
                const response = await axios.post('http://localhost:5173/api/products', product);
                setProducts([...products, response.data]);
                alert('Product saved successfully!!!');
            } catch (error) {
                console.error('Error saving product', error);
                alert('Error occurred while saving the product');
            }
        } else {
            // Update the product
            try {
                const response = await axios.put(`http://localhost:5173/api/products/${currentProductId}`, product);
                const updatedProducts = products.map((prod) =>
                    prod._id === currentProductId ? response.data : prod
                );
                setProducts(updatedProducts);
                setEditing(false);
                setCurrentProductId(null);
                alert('Product updated successfully!!!');
            } catch (error) {
                console.error('Error updating product', error);
                alert('Error occurred while updating the product');
            }
        }
        setProduct({ product_code: '', name: '', description: '', price: '', qty: '', date_added: '' });
    };

    const handleEdit = (product) => {
        setProduct(product);
        setEditing(true);
        setCurrentProductId(product._id);
    };
    /* Delete save products */
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5173/api/products/${id}`);
                setProducts(products.filter((product) => product._id !== id));
                alert('Product deleted successfully!!!');
            } catch (error) {
                console.error('Error deleting product', error);
                alert('Error occurred while deleting the product');
            }
        }
    };

    return (
        <div style={{ display: 'grid', justifyContent: 'space-between', padding: '60px' }}>
            <div style={{ width: '570px' }}>
                <h2>ADD PRODUCT</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="product_code"
                        placeholder="Product Code"
                        value={product.product_code}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={product.description}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={product.price}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="qty"
                        placeholder="Quantity"
                        value={product.qty}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="date_added"
                        placeholder="Date Added"
                        value={product.date_added}
                        onChange={handleChange}
                    />
                    <div className="form-buttons">
                    <button className="save-btn" type="submit">{editing ? 'Update' : 'Save'}</button>
                    <button className="clear-btn" type="button" onClick={() => setProduct({ product_code: '', name: '', description: '', price: '', qty: '', date_added: '' })}>Clear</button>
                    </div>
                </form>
            </div>

            {/* Saved Products */}
            <div style={{ marginLeft: '1px', width: '600px' }}>
                <h3>SAVED PRODUCTS</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product Code</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.product_code}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.qty}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductForm;
