// Change in Cart
function updateQuantity(line,quantity) {
    $.ajax({
        type: 'POST',
        url: '/cart/change',
        data: 'quantity=' + quantity + '&line=' + line,
        dataType: 'json',
        success: function(cart) {
            FreeShippingPrice();
        },
      });
    
  }
  // ===============================================================================
  // Fetch product to cart Drawer
  $(document).ready(function() {
    $('.cv--atc').click(function(e){
      e.preventDefault();
      var data = $(this).parents('form').serialize();
      var qty = 1;
      $.ajax({
        type: 'POST',
        url: '/cart/add',
        data: data,
        dataType: 'html',
        success: function(response){
          $('.cart__drawer-item').html($(response).find('.cart__drawer-item').html());
          $('.cart__drawer').html($(response).filter('.cart__drawer').html()).addClass('show-cart__drawer');
          $('.cart__drawer').addClass('show-cart__drawer');
          $('body').addClass('cv--show-cart__drawer');
          $('html').addClass('close-scroll');
          $('.cross').click(function(){
            $('.cart__drawer').removeClass('show-cart__drawer');
          });
          FreeShippingPrice();
        }
      });
  
    });
  });
  // ===============================================================================
  
  
  $(document).ready(function() {
  
    // Cart Drawer Open On Click Cart Icon
    $(document).on("click",".header-cart-icon", function(e) {
      e.preventDefault();
      $('.cart__drawer').addClass('show-cart__drawer');
      $('body').addClass('cv--show-cart__drawer');
      $('html').addClass('close-scroll');
      FreeShippingPrice(); 
    });
    // Cart Drawer Close On Click cross Icon
    $(document).on("click",".cross",function() {
        
      $('.cart__drawer').removeClass('show-cart__drawer');
      $('body').removeClass('cv--show-cart__drawer');
      $('html').removeClass('close-scroll');
    });
  //   Close Cart Drawer click anywhere
    $(document).mouseup(function(e){
      var container = $(".cart__drawer");
      if (!container.is(e.target) && container.has(e.target).length === 0){
        container.show();
        $('.cart__drawer').removeClass('show-cart__drawer');
        $('body').removeClass('cv--show-cart__drawer');
        $('html').removeClass('close-scroll');
      }
    });
    
  });
  
  
  
  // ===============================================================================
  
  
  $(document).ready(function() {
    // Remove Item from Cart
    $(document).on("click",".cart__remove",function(e) {
      e.preventDefault();
      var itemUrl = $(this).attr('href');
      $.ajax({
        url: itemUrl,
        type:'GET',
        dataType: 'html',
        success: function(response){
          $('.cart__drawer-section').html($(response).find('.cart__drawer-section').html());
          $('.header-cart-icon').html($(response).find('.header-cart-icon').html());
          FreeShippingPrice();
        }
      });
    });
  });
  
  // ===============================================================================
  
  
  
  
  // Change In Quantity Selector
  $(document).ready(function() {
  
    $(document).on("click",".plus",function() {
      $(this).prev().val(+$(this).prev().val() + 1);
      var data =  $(this).parents('form').serialize();
      console.log(data);
      var quantity = $(this).prev().val();
      updateQuantity(data,quantity);
      $.ajax({
        type: 'POST',
        url: '/cart/update',
        data: data,
        dataType: 'html',
        success: function(response){
            $('.cart__drawer-section').html($(response).find('.cart__drawer-section').html());
            $('.header-cart-icon').html($(response).find('.header-cart-icon').html());
            FreeShippingPrice();
        }
      });
  
    });
  
    $(document).on("click",".minus",function() {
      if ($(this).next().val() > 0) {
        $(this).next().val(+$(this).next().val() - 1);
        var data =  $(this).parents('form').serialize();
        var quantity = $(this).next().val();
        updateQuantity(data,quantity);
        
        $.ajax({
          type: 'POST',
          url: '/cart/update',
          data: data,
          dataType: 'html',
          success: function(response){
            $('.cart__drawer-section').html($(response).find('.cart__drawer-section').html());
            $('.header-cart-icon').html($(response).find('.header-cart-icon').html());
            FreeShippingPrice();
          }
        });
      }
    });
  });
  
   // Open cart drawer after add to cart button is clicked
  $(document).ready(function() {
    $('.product__add-to-cart-button').one('click', function(){
      setTimeout(function(){ $('.site-header__cart ').click() }, 1500);
      FreeShippingPrice();
    });
  });

//   const AddToCart = document.querySelectorAll("[data-add-to-cart]");
//   AddToCart.forEach(button => {
//     button.addEventListener('click', function(e) {
//         e.preventDefault();
//         upsellItem = document.querySelector("[data-item-id]");
//     });
//   });
  
  class RecommedProduct extends HTMLElement {
    constructor() {
      super();
        this.addToCartBtn = this.querySelector('button');
        this.form = this.querySelector('form');
        this.addToCartBtn.addEventListener('click', this.addToCart.bind(this));
        this.checkRecommendProduct();
    }

    addToCart(e) {
        e.preventDefault();
        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];
        const formData = new FormData(this.form);
        config.body = formData;
        fetch(`/cart/add`, config)
          .then((response) => response.json())
          .then((response) => {
            fetch(`/cart?section_id=cart-drawer`)
            .then((response) => response.text())
            .then((responseText) => {
              const html = new DOMParser().parseFromString(responseText, 'text/html');
              console.log(html)
              const selectors = ['#cart-drawer .cart__drawer-section'];
              for (const selector of selectors) {
                const targetElement = document.querySelector(selector);
                const sourceElement = html.querySelector(selector);
                if (targetElement && sourceElement) {
                  targetElement.replaceWith(sourceElement);
                    this.checkRecommendProduct();
                    FreeShippingPrice()
                }
              }
            })
            .catch((e) => {
              console.error(e);
            });
            
          })
          .catch((e) => {
            console.error(e);
          })
          
    }

    checkRecommendProduct() {
        FreeShippingPrice()
        const cartItemIds = new Set([...document.querySelectorAll('.cart_items')].map(item => item.dataset.id));  

        document.querySelectorAll('.recommend-product--wrapper').forEach(recommendItem => {  
            if (cartItemIds.has(recommendItem.dataset.itemId)) {  
                recommendItem.remove();  
            }  
        }); 
        if (document.querySelectorAll('.recommend-product--wrapper').length == 0 ) {
            document.querySelector('.drawer__recommend-product--title').classList.add('hidden');
        }
        else{
            document.querySelector('.drawer__recommend-product--title').classList.remove('hidden');
        };

        // if(!document.querySelector('.custom-upsell-products')?.classList.contains('swiper-container-initialized' && document.querySelectorAll('.recommend-product--wrapper').length > 1)){
        //     var galleryProductHybrid = new Swiper(`.custom-upsell-products`, {
        //         slidesPerView: 1,
        //         spaceBetween: 30,
        //         loop: true,
        //         navigation: {
        //           nextEl: '.swiper-button-next',
        //           prevEl: '.swiper-button-prev',
        //         }
        //   });

        //     function handleFocus(e, i) {
        //         galleryProductHybrid.slideTo(i);
        //     }
  
        //     const iconHybridSliders = document.querySelectorAll('.custom-upsell-products .swiper-slide');
        //     iconHybridSliders.forEach((slide, i) => slide.addEventListener('focusin', (e) => handleFocus(e, i)));
        // }
    }
}

customElements.define('recommend-product', RecommedProduct);

function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
    };
}

class CartShippingproduct extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        this.shippingCheck = this.querySelector(".toggle-switch");
        this.checkButton = this.querySelector('[data-add-to-cart]');
        this.status = this.shippingCheck.querySelector('input');
        this.status.addEventListener("change", this.switchCheckBox.bind(this));
        
    }

    switchCheckBox(e) {
        if (this.status.checked) {
        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];
        const formData = new FormData(this.form);
        config.body = formData;
        fetch(`/cart/add`, config)
          .then((response) => response.json())
          .then((response) => {
            fetch(`/cart?section_id=cart-drawer`)
            .then((response) => response.text())
            .then((responseText) => {
              const html = new DOMParser().parseFromString(responseText, 'text/html');
              console.log(html)
              const selectors = ['#cart-drawer .cart__drawer-section'];
              for (const selector of selectors) {
                const targetElement = document.querySelector(selector);
                const sourceElement = html.querySelector(selector);
                if (targetElement && sourceElement) {
                  targetElement.replaceWith(sourceElement);
                }
              }
            })
            .catch((e) => {
              console.error(e);
            });
            
          })
          .catch((e) => {
            console.error(e);
          })
        }else {
            document.querySelector('.cart__remove').click();
        }
        FreeShippingPrice();
    }
    
}

customElements.define('cart-shiping', CartShippingproduct);
function FreeShippingPrice() {
    fetch("/cart.js")
    .then((response) => response.json())
    .then((cart) => {
       
        var subTotalPrice = cart.total_price;
        let subtotal = parseFloat(subTotalPrice);  
        
        var freeAmount = document.querySelector('.free-shipping--amount').value;
        document.querySelector('.upcart-rewards-bar-foreground').style.width = Number(subtotal / freeAmount) + "%";
    
        if(Number(subtotal / 100) > freeAmount ){
        console.log(Number(subtotal / 100) > freeAmount, "ddddddd")
            document.querySelector('.cart-rewards-successful--msg').classList.remove('hidden');
            document.querySelector('.cart-rewards-progressing--msg').classList.add('hidden');
        }
        else {
            document.querySelector('.cart-rewards-price').textContent = (freeAmount - Number(subtotal / 100)).toFixed(2) ;
            document.querySelector('.cart-rewards-successful--msg').classList.add('hidden');
            document.querySelector('.cart-rewards-progressing--msg').classList.remove('hidden');
        }

        if(!document.querySelector('.custom-upsell-products')?.classList.contains('swiper-container-initialized' && document.querySelectorAll('.recommend-product--wrapper').length > 1)){
            console.log('hererddddddd');
            var galleryProductHybrid = new Swiper(`.custom-upsell-products`, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: false,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
            //     slidesPerView: 1,
            //     spaceBetween: 30,
            //     loop: true,
            //     navigation: {
            //     nextEl: '.swiper-button-next',
            //     prevEl: '.swiper-button-prev',
            //     }
            // });
            // function handleFocus(e, i) {
            //     galleryProductHybrid.slideTo(i);
            // }
            // const iconHybridSliders = document.querySelectorAll('.custom-upsell-products .swiper-slide');
            // iconHybridSliders.forEach((slide, i) => slide.addEventListener('focusin', (e) => handleFocus(e, i)));
        }
    })
}

class CartRecommendations extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form');
    //   new theme.AjaxProduct(this.form);
      this.selects = document.querySelectorAll('.recommend-porduct-variant');
      this.selects.forEach(select=>{
        
      select.addEventListener("change", this.updateImage.bind(this));
      });
      
    }

    updateImage(e){
       e.preventDefault();
      const selectedVariant = e.target.value;
      const select = e.target;
        var variantImages = select.closest('.recommend-product--wrapper').querySelectorAll('.variant--image__item');
        variantImages.forEach(function(image) {
          if(image.querySelector('img').getAttribute('data-value') == selectedVariant ) {
            image.querySelector('img').classList.remove('hidden');
          }else {
            image.querySelector('img').classList.add('hidden');
          }
        });
       
    }
}

customElements.define('cart-recommendations', CartRecommendations);
