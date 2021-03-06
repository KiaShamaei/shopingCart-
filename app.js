const productDOM=document.querySelector('.products-center');
const cartItem=document.querySelector('.cart-items');
const cartTotal=document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const cartDOM = document.querySelector('.cart');
const cartOverlay =document.querySelector('.cart-overlay');
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');



let cart =[];

class Product {
   async getProducts(){
      try{
        const result = await fetch('products.json');
        const data = await result.json();
        let products = data.items ;
        products = products.map((item)=>{
            const {title,price} = item.fields ;
            const{id} = item.sys ;
            const image = item.fields.image.fields.file.url;
            return{title,price,id,image}
        });
        return products;
      }catch(e){
          console.log(e)
      }

    };
};




class View {
    displayProducts(products){
        let result = "";
        products.forEach((item)=>{
            result+=`
            <article class="product">
              <div class="img-container">
                <img
                src="${item.image}"
                class="product-img"
                />
                <button class="bag-btn" data-id=${item.id}>افزودن</button>
                </div>
                <h3>${item.title}</h3>
                <h4>${item.price}</h4>
            </article>`

        })
        productDOM.innerHTML = result;
    }
    getCartButtons(){
        const Button =[...document.querySelectorAll('.bag-btn')]
        console.log(Button)
        Button.forEach((item)=>{
            let id = item.dataset.id
            item.addEventListener('click', (event)=>{
                let cartItem = {...Storage.getProduct(id), amount : 1}
                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                this.setCartValues(cart);
                this.addCart(cartItem);
                this.showCart();
            })
        })
    }
    setCartValues(cart){
        let totalPrice = 0 ;
        let totalItems = 0 ;
        cart.map((item)=>{
            totalPrice = totalPrice + item.price*item.amount ;
            totalItems = totalItems + item.amount ;
        })
        cartItem.innerText = totalItems;
        cartTotal.innerText = totalPrice;
        console.log(cartItem, cartTotal)
    };
    addCart(item){
       const div=  document.createElement('div');
       div.classList.add('cart-item');
       div.innerHTML = ` <img src=${item.image} alt=${item.title}>
       <div>
         <h4>${item.title}</h4>
         <h5>${item.price}</h5>
       </div>
       <div>
         <i class="fas-fa-chevron-up"></i>
         <p class="item-amount">${item.amount}</p>
         <i class="fas-fa-chevron-down"></i>
       </div>`;
       cartContent.appendChild(div);
    };
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart')
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('shoeCart')
    }
    initApp(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populate(cart)
        cartBtn.addEventListener('click',this.showCart)
        closeCartBtn.addEventListener('click',this.hideCart)
    }
    populate(cart){
        cart.forEach((item)=>{
            return this.addCart(item);
        })
    }

};
class Storage{
    static saveProduct (data){
        localStorage.setItem('products',JSON.stringify(data))
    }
    static getProduct (id){
        const products = JSON.parse(localStorage.getItem('products'))
        return products.find((item)=>item.id==id);
    }
    static saveCart (cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart(){
        return (localStorage.getItem('cart'))
        ? JSON.parse(localStorage.getItem('cart')) : [];
    }
};

document.addEventListener('DOMContentLoaded',()=>{
    const view = new View ();
    const product = new Product();
    view.initApp();
    product.getProducts().then((data)=>{
        view.displayProducts(data);
        Storage.saveProduct(data);
    }).then(()=>{
        view.getCartButtons()
    })
})