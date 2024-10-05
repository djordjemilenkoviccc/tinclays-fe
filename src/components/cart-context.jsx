import React, { createContext, useState, useRef } from 'react';
import products from '../assets/data/products.json';

export const CartContext = createContext();

export default function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const cartItemsEndRef = useRef(null);

    const scrollToBottom = () => {
        cartItemsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingProduct = prevItems.find(item => item.id === product.id);
            if (existingProduct) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        setShowCart(true);
        scrollToBottom();
    };

    const increaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            return prevItems.map(item => {
                if (item.id === productId) {
                    const product = products.find(p => p.id === productId);
                    if (item.quantity < product.amount) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                }
                return item;
            });
        });
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const product = prevItems.find(item => item.id === productId);
            if (product.quantity === 1) {
                return prevItems.filter(item => item.id !== productId);
            } else {
                return prevItems.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            removeFromCart,
            showCart,
            handleCloseCart,
            handleShowCart,
            cartItemsEndRef
        }}>
            {children}
        </CartContext.Provider>
    );
}
