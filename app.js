document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartCountElement = document.querySelector('.cart-count');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalElement = document.getElementById('cartTotal');
    const closeCartModal = document.querySelector('.close-cart-modal');
    
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count display
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Calculate cart total
    function calculateCartTotal() {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            return total + (price * item.quantity);
        }, 0);
    }
    
    // Display cart items
    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotalElement.textContent = '$0.00';
            return;
        }
        
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            const subtotal = price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price} × ${item.quantity}</div>
                    <div class="cart-item-subtotal">Subtotal: $${subtotal.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="cart-item-decrease">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="cart-item-increase">+</button>
                        <button class="cart-item-remove">Remove</button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            cartItem.querySelector('.cart-item-decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(cartItem => cartItem.id !== item.id);
                }
                updateCart();
            });
            
            cartItem.querySelector('.cart-item-increase').addEventListener('click', () => {
                item.quantity++;
                updateCart();
            });
            
            cartItem.querySelector('.cart-item-remove').addEventListener('click', () => {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                updateCart();
            });
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update total
        const total = calculateCartTotal();
        cartTotalElement.textContent = $${total.toFixed(2)};
    }
    
    // Update both cart count and display
    function updateCart() {
        updateCartCount();
        displayCartItems();
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImg = productCard.querySelector('.product-img img').src;
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImg,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification(${productName} added.to.cart!);
        });
    });
    
    // Cart icon click - show modal
    cartIcon.addEventListener('click', function() {
        displayCartItems();
        cartModal.style.display = 'block';
    });
    
    // Close modal
    closeCartModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Initialize cart
    updateCartCount();
});