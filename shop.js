const products = [
  {
    name: "Bamboo Grooming Brush",
    category: "Accessories",
    image: "https://th.bing.com/th/id/OIP.q4A4n3dsW5WOlc4MWMFRWwHaHa?rs=1&pid=ImgDetMain",
    price: 16.99,
    reviews: 98,
    badge: "New",
    rating: 4
  },
  {
    name: "Organic Peanut Butter Treats",
    category: "Treats",
    image: "https://m.media-amazon.com/images/I/91jrF3FRaLL._SL1500_.jpg",
    price: 12.49,
    reviews: 123,
    badge: "Best Seller",
    rating: 5
  },
  {
    name: "Multivitamin Chews",
    category: "Supplements",
    image: "https://www.antelopepets.com/cdn/shop/files/JointPowerChewsFront.jpg?v=1684692704&width=750",
    price: 22.95,
    reviews: 85,
    badge: "New",
    rating: 4
  },
  {
    name: "Pet Spa Shampoo Bar",
    category: "Grooming",
    image: "https://i.etsystatic.com/8747013/r/il/1722a9/878906908/il_570xN.878906908_37lu.jpg",
    price: 18.5,
    reviews: 65,
    badge: "New",
    rating: 3
  },
  {
    name: "Pet Collars",
    category: "Accessories",
    image: "https://th.bing.com/th/id/OIP.tG-gAhYCyk0aQiHMw9WDTQAAAA?rs=1&pid=ImgDetMain",
    price: 11.5,
    reviews: 56,
    badge: "Popular",
    rating: 3
  },
  {
    name: "Pet Nail cutter",
    category: "Grooming",
    image: "https://mydoglikes.com/wp-content/uploads/2016/05/Ergonomic-Handle.jpg",
    price: 11.5,
    reviews: 56,
    badge: "Popular",
    rating: 3
  }
];

const productGrid = document.querySelector('.products-grid');
const filterButtons = document.querySelectorAll('.filter-button');
const sortSelect = document.getElementById('sort-select');
const cartCount = document.querySelector('.cart-count');

let cartItems = localStorage.getItem('pawlorCartItems') ? JSON.parse(localStorage.getItem('pawlorCartItems')) : [];

function renderProducts(filteredProducts) {
  productGrid.innerHTML = '';

  filteredProducts.forEach((product, index) => {
    productGrid.innerHTML += `
      <div class="product-card">
        <div class="product-badge">${product.badge}</div>
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
          <h3>${product.name}</h3>
          <div class="product-category">${product.category}</div>
          <div class="product-rating">
            <div class="stars">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
            <span>(${product.reviews} reviews)</span>
          </div>
          <div class="btnAll">
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn btn-secondary">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });

  const addToCartButtons = document.querySelectorAll('.product-card .btn-secondary');
  addToCartButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPriceText = productCard.querySelector('.product-price').textContent;
      const productImage = productCard.querySelector('.product-image img').getAttribute('src');

      const productPrice = parseFloat(productPriceText.replace('$', ''));

      const existingItem = cartItems.find(item => item.name === productName);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const cartItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1
        };
        cartItems.push(cartItem);
      }

      localStorage.setItem('pawlorCartItems', JSON.stringify(cartItems));
      updateCartCount();
      showNotification(`${productName} added to cart!`);

      const originalText = button.textContent;
      button.textContent = 'Added!';
      button.classList.add('added');

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('added');
      }, 2000);
    });
  });
}

function filterAndSortProducts(category = "All", sortBy = "popular") {
  let filtered = [...products];

  if (category !== "All") {
    filtered = filtered.filter(p => p.category === category);
  }

  switch (sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered = filtered.filter(p => p.badge === "New");
      break;
    case "popular":
    default:
      filtered.sort((a, b) => b.reviews - a.reviews);
  }

  renderProducts(filtered);
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-button.active')?.classList.remove('active');
    button.classList.add('active');

    const selectedCategory = button.textContent;
    const selectedSort = sortSelect.value;
    filterAndSortProducts(selectedCategory, selectedSort);
  });
});

sortSelect.addEventListener('change', () => {
  const selectedCategory = document.querySelector('.filter-button.active')?.textContent || "All";
  const selectedSort = sortSelect.value;
  filterAndSortProducts(selectedCategory, selectedSort);
});

function updateCartCount() {
  if (cartCount) {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalCount;
  }
}
function showNotification(message) {
  let notification = document.querySelector('.cart-notification');

  if (!notification) {
    const style = document.createElement('style');
    style.textContent = `
      .btn.added {
        background-color: #16a34a;
        color: white;
      }
    `;
    document.head.appendChild(style);
    
  }

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
/*function showNotification(message) {
  let notification = document.querySelector('.cart-notification');

  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'cart-notification';
    document.body.appendChild(notification);

    const style = document.createElement('style');
    style.textContent = `
      .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--secondary-color, #f1c40f);
        color: var(--text-dark, #000);
        padding: 1.5rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        z-index: 1001;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .cart-notification.show {
        opacity: 1;
        transform: translateY(0);
      }
      .btn.added {
        background-color: #16a34a;
        color: white;
      }
    `;
    document.head.appendChild(style);
    
  }

  notification.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
*/
updateCartCount();
filterAndSortProducts();

