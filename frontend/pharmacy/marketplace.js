document.addEventListener('DOMContentLoaded', function() {
  // Initialize quantity selectors
  initQuantitySelectors();
  
  // Initialize cart
  loadCart();
  updateCartCount();
  
  // Initialize event listeners
  initAddToCartButtons();
  
  // Initialize product preview
  initProductPreview();
  
  // Mobile filter toggle
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const closeFiltersBtn = document.getElementById('close-filters');
  const filtersSection = document.querySelector('.marketplace-filters');
  
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      filtersSection.style.position = 'fixed';
      filtersSection.style.top = '0';
      filtersSection.style.left = '0';
      filtersSection.style.right = '0';
      filtersSection.style.bottom = '0';
      filtersSection.style.zIndex = '1000';
      filtersSection.style.display = 'block';
      filtersSection.style.overflowY = 'auto';
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (closeFiltersBtn) {
    closeFiltersBtn.addEventListener('click', () => {
      filtersSection.style.position = '';
      filtersSection.style.top = '';
      filtersSection.style.left = '';
      filtersSection.style.right = '';
      filtersSection.style.bottom = '';
      filtersSection.style.zIndex = '';
      document.body.style.overflow = '';
    });
  }
  
  // Product Preview Functionality
  function initProductPreview() {
    const previewButtons = document.querySelectorAll('.product-preview-btn');
    const previewModal = document.getElementById('product-preview-modal');
    const previewClose = document.querySelector('.preview-close');
    
    if (!previewModal) return;
    
    previewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = button.closest('.product-card');
        
        if (productCard) {
          const productId = productCard.dataset.productId;
          const imgSrc = productCard.querySelector('.product-image').src;
          const name = productCard.querySelector('.product-name').textContent;
          const manufacturer = productCard.querySelector('.product-manufacturer').textContent;
          const description = productCard.querySelector('.product-description').textContent;
          const priceEl = productCard.querySelector('.product-price');
          const unitEl = productCard.querySelector('.product-unit');
          const stockEl = productCard.querySelector('.product-stock');
          
          // Populate modal with product data
          previewModal.querySelector('.preview-image').src = imgSrc;
          previewModal.querySelector('.preview-image').alt = name;
          previewModal.querySelector('.preview-name').textContent = name;
          previewModal.querySelector('.preview-manufacturer').textContent = manufacturer;
          previewModal.querySelector('.preview-description').textContent = description;
          
          if (priceEl) {
            previewModal.querySelector('.preview-price').textContent = priceEl.textContent;
          }
          
          if (unitEl) {
            previewModal.querySelector('.preview-unit').textContent = unitEl.textContent;
          }
          
          if (stockEl) {
            const stockStatus = stockEl.textContent;
            const previewStockEl = previewModal.querySelector('.preview-stock');
            
            previewStockEl.textContent = stockStatus;
            previewStockEl.className = 'preview-stock';
            
            if (stockEl.classList.contains('in-stock')) {
              previewStockEl.classList.add('in-stock');
            } else if (stockEl.classList.contains('limited-stock')) {
              previewStockEl.classList.add('limited-stock');
            } else if (stockEl.classList.contains('out-of-stock')) {
              previewStockEl.classList.add('out-of-stock');
            }
          }
          
          // Setup add to cart button
          const addToCartBtn = previewModal.querySelector('.add-to-cart-btn');
          const qtyInput = previewModal.querySelector('.qty-input');
          
          addToCartBtn.onclick = () => {
            const product = {
              id: productId,
              name: name,
              manufacturer: manufacturer,
              price: parseFloat(priceEl.textContent.replace('JD ', '')),
              unit: unitEl.textContent,
              quantity: parseInt(qtyInput.value),
              imageUrl: imgSrc
            };
            
            addToCart(product);
            previewModal.style.display = 'none';
          };
          
          // Show modal
          previewModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close modal
    if (previewClose) {
      previewClose.addEventListener('click', () => {
        previewModal.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
    
    // Close when clicking outside
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) {
        previewModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
    
    // Initialize quantity selectors in preview modal
    const previewMinusBtn = previewModal.querySelector('.qty-minus');
    const previewPlusBtn = previewModal.querySelector('.qty-plus');
    const previewInput = previewModal.querySelector('.qty-input');
    
    if (previewMinusBtn && previewPlusBtn && previewInput) {
      previewMinusBtn.addEventListener('click', () => {
        const value = parseInt(previewInput.value);
        if (value > 1) {
          previewInput.value = value - 1;
        }
      });
      
      previewPlusBtn.addEventListener('click', () => {
        const value = parseInt(previewInput.value);
        previewInput.value = value + 1;
      });
      
      previewInput.addEventListener('change', () => {
        if (previewInput.value < 1 || isNaN(previewInput.value)) {
          previewInput.value = 1;
        }
      });
    }
  }
  
  // Get cart button and modal
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeModal = cartModal.querySelector('.close-modal');
  const continueShopping = document.getElementById('continue-shopping-btn');
  
  // Toggle cart modal
  cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCartItems();
  });
  
  // Close cart modal
  closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
  
  continueShopping.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });
  
  // Price range slider
  const priceRange = document.getElementById('price-range');
  const maxPrice = document.getElementById('max-price');
  
  priceRange.addEventListener('input', () => {
    maxPrice.textContent = `${priceRange.value} JD`;
  });
  
  // Apply filters button
  const applyFilters = document.getElementById('apply-filters');
  applyFilters.addEventListener('click', () => {
    // In a real app, this would filter products based on selected criteria
    alert('Filters applied!');
    
    // Close filters on mobile after applying
    if (window.innerWidth <= 768 && closeFiltersBtn) {
      closeFiltersBtn.click();
    }
  });
  
  // Reset filters button
  const resetFilters = document.getElementById('reset-filters');
  resetFilters.addEventListener('click', () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = checkbox.name === 'availability' && checkbox.value === 'in-stock';
    });
    priceRange.value = 100;
    maxPrice.textContent = '100 JD';
  });
  
  // Pagination
  const prevBtn = document.querySelector('.prev-page');
  const nextBtn = document.querySelector('.next-page');
  const pageNumbers = document.querySelectorAll('.page-number');
  
  pageNumbers.forEach(page => {
    page.addEventListener('click', () => {
      document.querySelector('.page-number.active').classList.remove('active');
      page.classList.add('active');
      updatePaginationButtons();
    });
  });
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const activePage = document.querySelector('.page-number.active');
      if (activePage && activePage.nextElementSibling) {
        activePage.classList.remove('active');
        activePage.nextElementSibling.classList.add('active');
        updatePaginationButtons();
      }
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const activePage = document.querySelector('.page-number.active');
      if (activePage && activePage.previousElementSibling) {
        activePage.classList.remove('active');
        activePage.previousElementSibling.classList.add('active');
        updatePaginationButtons();
      }
    });
  }
  
  function updatePaginationButtons() {
    if (prevBtn && nextBtn) {
      const activePage = document.querySelector('.page-number.active');
      prevBtn.disabled = !activePage.previousElementSibling;
      nextBtn.disabled = !activePage.nextElementSibling;
    }
  }
  
  // Fix qty buttons for better touch experience
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      this.click();
    });
  });
});

// Initialize quantity selectors
function initQuantitySelectors() {
  const quantitySelectors = document.querySelectorAll('.quantity-selector');
  
  quantitySelectors.forEach(selector => {
    const minusBtn = selector.querySelector('.qty-minus');
    const plusBtn = selector.querySelector('.qty-plus');
    const input = selector.querySelector('.qty-input');
    
    minusBtn.addEventListener('click', () => {
      const value = parseInt(input.value);
      if (value > 1) {
        input.value = value - 1;
      }
    });
    
    plusBtn.addEventListener('click', () => {
      const value = parseInt(input.value);
      input.value = value + 1;
    });
    
    input.addEventListener('change', () => {
      if (input.value < 1 || isNaN(input.value)) {
        input.value = 1;
      }
    });
  });
}

// Initialize add to cart buttons
function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product-card');
      const name = productCard.querySelector('.product-name').textContent;
      const manufacturer = productCard.querySelector('.product-manufacturer').textContent;
      const price = parseFloat(productCard.querySelector('.product-price').textContent.replace('JD ', ''));
      const unit = productCard.querySelector('.product-unit').textContent;
      const quantity = parseInt(productCard.querySelector('.qty-input').value);
      const imageUrl = productCard.querySelector('.product-image').src;
      
      const product = {
        id: generateProductId(name),
        name,
        manufacturer,
        price,
        unit,
        quantity,
        imageUrl
      };
      
      addToCart(product);
    });
  });
}

// Generate a product ID based on the name
function generateProductId(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Add a product to the cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += product.quantity;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Show confirmation - use a toast notification or some other non-blocking UI
  const productName = product.name;
  const confirmationElement = document.createElement('div');
  confirmationElement.className = 'cart-confirmation';
  confirmationElement.innerHTML = `
    <div class="cart-confirmation-content">
      <p>${productName} has been added to your cart</p>
      <button class="view-cart-btn">View Cart</button>
    </div>
  `;
  
  document.body.appendChild(confirmationElement);
  
  // Animate the confirmation in
  setTimeout(() => {
    confirmationElement.classList.add('show');
  }, 10);
  
  // Remove the confirmation after 3 seconds
  setTimeout(() => {
    confirmationElement.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(confirmationElement);
    }, 300);
  }, 3000);
  
  // Add event listener to view cart button
  confirmationElement.querySelector('.view-cart-btn').addEventListener('click', () => {
    document.body.removeChild(confirmationElement);
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'block';
    renderCartItems();
  });
}

// Remove a product from the cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Update the quantity of a cart item
function updateCartItemQuantity(productId, newQuantity) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const productIndex = cart.findIndex(item => item.id === productId);
  
  if (productIndex > -1) {
    cart[productIndex].quantity = parseInt(newQuantity);
    if (cart[productIndex].quantity < 1) {
      cart[productIndex].quantity = 1;
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
}

// Load cart from localStorage
function loadCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Update the cart count in the UI
function updateCartCount() {
  const cart = loadCart();
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalCount;
  
  // Update checkout button disabled state
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = totalCount === 0;
  }
}

// Render the cart items in the cart modal
function renderCartItems() {
  const cart = loadCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmptyMessage = document.getElementById('cart-empty-message');
  const cartTotalAmount = document.getElementById('cart-total-amount');
  
  if (!cartItemsContainer || !cartEmptyMessage || !cartTotalAmount) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    cartEmptyMessage.style.display = 'block';
    cartTotalAmount.textContent = 'JD 0.00';
    return;
  }
  
  cartEmptyMessage.style.display = 'none';
  
  let total = 0;
  let cartItemsHTML = '';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    cartItemsHTML += `
      <tr data-id="${item.id}">
        <td>
          <div class="cart-item-product">
            <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-manufacturer">${item.manufacturer}</span>
            </div>
          </div>
        </td>
        <td>JD ${item.price.toFixed(2)}</td>
        <td>
          <div class="cart-item-quantity">
            <button class="cart-qty-btn qty-minus">-</button>
            <span class="cart-qty-value">${item.quantity}</span>
            <button class="cart-qty-btn qty-plus">+</button>
          </div>
        </td>
        <td>JD ${itemTotal.toFixed(2)}</td>
        <td>
          <button class="remove-item-btn">Remove</button>
        </td>
      </tr>
    `;
  });
  
  cartItemsContainer.innerHTML = cartItemsHTML;
  cartTotalAmount.textContent = `JD ${total.toFixed(2)}`;
  
  // Add event listeners for cart item buttons
  addCartButtonListeners();
}

// Add event listeners for cart buttons
function addCartButtonListeners() {
  const minusButtons = document.querySelectorAll('#cart-items .qty-minus');
  const plusButtons = document.querySelectorAll('#cart-items .qty-plus');
  const removeButtons = document.querySelectorAll('.remove-item-btn');
  
  minusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const productId = row.dataset.id;
      const quantitySpan = row.querySelector('.cart-qty-value');
      let quantity = parseInt(quantitySpan.textContent);
      
      if (quantity > 1) {
        quantity--;
        updateCartItemQuantity(productId, quantity);
      }
    });
  });
  
  plusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const productId = row.dataset.id;
      const quantitySpan = row.querySelector('.cart-qty-value');
      let quantity = parseInt(quantitySpan.textContent);
      
      quantity++;
      updateCartItemQuantity(productId, quantity);
    });
  });
  
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const productId = row.dataset.id;
      removeFromCart(productId);
    });
  });
}