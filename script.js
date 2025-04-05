document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('header');

  window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  });

  // Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenu) {
      mobileMenu.addEventListener('click', function() {
          mobileMenu.classList.toggle('active');
          navMenu.classList.toggle('active');
      });
  }

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          navMenu.classList.remove('active');
      });
  });

  // Animate elements on scroll
  const animateElements = document.querySelectorAll('.feature, .product-card, .box-item, .box-content h3, .box-cta, .newsletter-content, .section-heading');

  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);

  animateElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(element);
  });

  // Testimonial Slider
  const testimonialSlider = document.getElementById('testimonial-slider');
  const slides = testimonialSlider ? testimonialSlider.querySelectorAll('.testimonial-slide') : [];
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentSlide = 0;

  function showSlide(index) {
      if (!testimonialSlider) return;
      
      // Hide all slides
      slides.forEach(slide => {
          slide.style.display = 'none';
      });
      
      // Remove active class from all dots
      dots.forEach(dot => {
          dot.classList.remove('active');
      });
      
      // Show current slide and activate corresponding dot
      slides[index].style.display = 'block';
      dots[index].classList.add('active');
      
      // Add fade-in animation
      slides[index].style.animation = 'fadeIn 0.5s ease-out';
  }

  // Initialize slider
  if (slides.length > 0) {
      showSlide(currentSlide);
      
      // Event listeners for prev/next buttons
      if (prevBtn) {
          prevBtn.addEventListener('click', () => {
              currentSlide = (currentSlide - 1 + slides.length) % slides.length;
              showSlide(currentSlide);
          });
      }
      
      if (nextBtn) {
          nextBtn.addEventListener('click', () => {
              currentSlide = (currentSlide + 1) % slides.length;
              showSlide(currentSlide);
          });
      }
      
      // Event listeners for dots
      dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
              currentSlide = index;
              showSlide(currentSlide);
          });
      });
      
      // Auto slide every 5 seconds
      setInterval(() => {
          currentSlide = (currentSlide + 1) % slides.length;
          showSlide(currentSlide);
      }, 5000);
  }

  // Add to Cart Functionality
  const addToCartButtons = document.querySelectorAll('.product-card .btn-secondary');
  const cartCount = document.querySelector('.cart-count');
  let cartItems = localStorage.getItem('pawlorCartItems') ? JSON.parse(localStorage.getItem('pawlorCartItems')) : [];
  
  // Update cart count display
  function updateCartCount() {
      if (cartCount) {
          cartCount.textContent = cartItems.length;
      }
  }
  
  // Initialize cart count
  updateCartCount();
  
  // Add to cart event listeners
  addToCartButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
          const product = this.closest('.product-card');
          const productName = product.querySelector('h3').textContent;
          const productPrice = product.querySelector('.product-price').textContent;
          const productImage = product.querySelector('.product-image img').getAttribute('src');
          
          // Create cart item object
          const cartItem = {
              id: Date.now() + index,
              name: productName,
              price: productPrice,
              image: productImage,
              quantity: 1
          };
          
          // Add to cart array
          cartItems.push(cartItem);
          
          // Save to local storage
          localStorage.setItem('pawlorCartItems', JSON.stringify(cartItems));
          
          // Update cart count
          updateCartCount();
          
          // Show notification
          showNotification(`${productName} added to cart!`);
          
          // Change button text temporarily
          const originalText = button.textContent;
          button.textContent = 'Added!';
          button.classList.add('added');
          
          setTimeout(() => {
              button.textContent = originalText;
              button.classList.remove('added');
          }, 2000);
      });
  });
  
  // Notification function
  function showNotification(message) {
      // Create notification element if it doesn't exist
      let notification = document.querySelector('.cart-notification');
      
      if (!notification) {
          notification = document.createElement('div');
          notification.className = 'cart-notification';
          document.body.appendChild(notification);
          
          // Add styles
          const style = document.createElement('style');
          style.textContent = `
              .cart-notification {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background-color: var(--secondary-color);
                  color: var(--text-dark);
                  padding: 1.5rem 2rem;
                  border-radius: var(--border-radius);
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
      
      // Set message and show notification
      notification.textContent = message;
      notification.classList.add('show');
      
      // Hide notification after delay
      setTimeout(() => {
          notification.classList.remove('show');
      }, 3000);
  }

  // Newsletter Subscription
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const emailInput = document.getElementById('email-subscription');
          const email = emailInput.value.trim();
          
          if (email && validateEmail(email)) {
              // In a real app, this would submit to a server
              // Here we'll just show a success message
              
              // Save to localStorage to simulate subscription
              const subscribers = localStorage.getItem('pawlorSubscribers') ? 
                  JSON.parse(localStorage.getItem('pawlorSubscribers')) : [];
              
              if (!subscribers.includes(email)) {
                  subscribers.push(email);
                  localStorage.setItem('pawlorSubscribers', JSON.stringify(subscribers));
              }
              
              // Update UI
              const formGroup = emailInput.parentElement;
              formGroup.innerHTML = `
                  <div class="success-message">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <span>Thank you for joining the Pawlor Pack!</span>
                  </div>
              `;
              
              // Add styles
              const style = document.createElement('style');
              style.textContent = `
                  .success-message {
                      display: flex;
                      align-items: center;
                      gap: 1rem;
                      background-color: rgba(255, 255, 255, 0.2);
                      padding: 1.5rem 2rem;
                      border-radius: var(--border-radius);
                      color: white;
                      animation: fadeIn 0.5s ease-out;
                  }
                  
                  .success-message svg {
                      color: white;
                  }
              `;
              document.head.appendChild(style);
              
              // Update disclaimer text
              document.querySelector('.form-disclaimer p').textContent = 
                  "We've sent a confirmation email. Check your inbox!";
          } else {
              // Show error
              emailInput.classList.add('error');
              
              // Remove error after delay
              setTimeout(() => {
                  emailInput.classList.remove('error');
              }, 3000);
              
              // Add error styles
              const style = document.createElement('style');
              style.textContent = `
                  #email-subscription.error {
                      border: 2px solid rgba(255, 0, 0, 0.5);
                      background-color: rgba(255, 0, 0, 0.1);
                  }
              `;
              document.head.appendChild(style);
          }
      });
  }
  
  // Email validation function
  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }

  // Smooth scrolling for anchor links with improved easing
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              const headerHeight = document.querySelector('header').offsetHeight;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
              
              // Smooth scroll with cubic-bezier easing
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });

  // Active navigation based on scroll position with improved accuracy
  const sections = document.querySelectorAll('section');

  function setActiveNav() {
      const scrollPosition = window.scrollY + 100; // Offset for better accuracy
      
      sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              document.querySelectorAll('.nav-menu a').forEach(link => {
                  link.classList.remove('active');
                  if (link.getAttribute('href') === `#${sectionId}`) {
                      link.classList.add('active');
                  }
              });
          }
      });
  }

  window.addEventListener('scroll', setActiveNav);

  // Initialize active nav on page load
  setActiveNav();
  
  // Hover effect for product cards
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
          card.querySelector('.btn-secondary').style.opacity = '1';
      });
      
      card.addEventListener('mouseleave', () => {
          card.querySelector('.btn-secondary').style.opacity = '0.9';
      });
  });
  
  // Product image hover effect
  const productImages = document.querySelectorAll('.product-image');
  
  productImages.forEach(image => {
      image.addEventListener('mouseenter', () => {
          image.style.transform = 'scale(1.02)';
      });
      
      image.addEventListener('mouseleave', () => {
          image.style.transform = 'scale(1)';
      });
  });
});