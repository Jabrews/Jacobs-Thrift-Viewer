class App {
    constructor() {
        this.currentPage = null;
        this.Fetch = new Fetch()
        this.ProductDisplay = new ProductDisplay()
        this.DataDeconstructor = new DataDeconstructor()

        // Initialize elements
        this.appInitializeElements();

        // Create an instance of AppEventHandlers and pass the App instance
        this.eventHandlers = new AppEventHandlers(this);

        // Hack for filter dropwdown menu
        this.filterDropdownInitialize();

        this.webpageManager();

        //Attempt to get cached data to put in display, 
        //Else fetch new data for page and replace placeholder
        let data = this.loadContent(this.currentPage);
        //this.ProductDisplay.replaceCard(data)
    }

    // defult loading from cache (OTEHR FUNC VERY SIMMILAR FOR SEARCH LOADING- JUS LESS LIMITS
    async loadContent() {

        //Attempt to get cached data to put in display, 
        //Else fetch new data for page and replace placeholder
        let data = await this.Fetch.loadCachedData(this.currentPage);


        //Depending On The Page, Disect data into readable objects
        let productInfoArray = await this.DataDeconstructor.deconstructData(this.currentPage, data)
        console.log(productInfoArray)

        //Use data to make cards and modals and upload to DOM
        this.ProductDisplay.replaceCard(productInfoArray)



    }

    webpageManager() {
        this.currentPage = window.location.href;
        if (
            this.currentPage.includes('grailed-view') ||
            this.currentPage.includes('ebay-view') ||
            this.currentPage.includes('depop-view') ||
            this.currentPage.includes('etsy-view')
        ) {
            this.eventHandlers.initProductPageListeners();
        } else if (this.currentPage.includes('want-cart')) {
            this.eventHandlers.initCartPageListeners();
        }
    }

    appInitializeElements() {
        this.btn = document.querySelector('#btn');
        this.sidebar = document.querySelector('.sidebar');
        this.mobileButton = document.querySelector('#btn-mobile');
        this.mobileNavList = document.querySelector('.mobile-nav-list');

        this.filterForm = document.querySelector('#filter-form');
        this.filter = document.querySelector('.filter');
        this.filterBody = document.querySelector('.filter-body');
        this.filterHead = document.querySelector('.filter-head')
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.filterSubmit = document.querySelector('#submit-btn');

        this.prevButtons = document.querySelectorAll('.pre-btn');
        this.nextButtons = document.querySelectorAll('.nxt-btn');
        this.cardShowcase = document.querySelectorAll('.card-showcase');

        this.cardBtns = document.querySelectorAll('.card_image');
        this.modalCloses = document.querySelectorAll('.modal_close');
        this.modals = document.querySelectorAll('.modal');
        this.modalCards = document.querySelectorAll('.modal_card');
        this.modalButton = document.querySelector('.modal_button');

        this.searchBar = document.querySelector('#search-bar');
        this.cardCloseBtn = document.querySelectorAll('.back i');
    }

    filterDropdownInitialize() {
        this.dropdowns.forEach(dropdown => {
            const select = dropdown.querySelector('.select');
            const caret = dropdown.querySelector('.caret');
            const menu = dropdown.querySelector('.menu');
            const options = dropdown.querySelectorAll('.menu li');
            const selected = dropdown.querySelector('.selected');

            select.addEventListener('click', () => {
                select.classList.toggle('select-clicked');
                caret.classList.toggle('caret-rotate');
                menu.classList.toggle('menu-open');
            });

            options.forEach(option => {
                option.addEventListener('click', () => {
                    selected.innerText = option.innerText;
                    select.classList.remove('select-clicked');
                    caret.classList.remove('caret-rotate');
                    menu.classList.remove('menu-open');
                    options.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                });
            });
        });
    }
}

class AppEventHandlers {
    constructor(app) {
        this.app = app; // Store a reference to the main App instance
        this.initNavbarListeners();
        this.initModalListeners();
    }

    // Initialize navbar event listeners
    initNavbarListeners() {
        this.app.btn.addEventListener('click', () => this.expandNavbar());
        this.app.mobileButton.addEventListener('click', () => this.toggleMobileNav());
    }

    // Initialize modal-related event listeners
    initModalListeners() {
        this.app.cardBtns.forEach((btn, i) => {
            btn.addEventListener('click', () => this.activateModal(i));
        });

        this.app.modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeAllModals());
        });

        this.app.modals.forEach(mod => {
            mod.addEventListener('click', () => this.closeModal(mod));
        });

        this.app.modalCards.forEach(card => {
            card.addEventListener('click', e => e.stopPropagation());
        });
    }

    // Initialize product page event listeners
    initProductPageListeners() {
        this.app.filter.addEventListener('mouseenter', () => this.displayFilter());

        this.app.filter.addEventListener('mouseleave', () => this.hideFilter());
        this.app.filterForm.addEventListener('submit', e => this.submitFilter(e));

        this.app.nextButtons.forEach((button, index) => {
            button.addEventListener('click', e => this.scrollRight(e, index));
        });

        this.app.prevButtons.forEach((button, index) => {
            button.addEventListener('click', e => this.scrollLeft(e, index));
        });

        this.app.searchBar.addEventListener('submit', e => this.searchProducts(e));
        this.app.modalButton.addEventListener('click', e => this.addToCart(e));
    }

    // Initialize cart page event listeners
    initCartPageListeners() {
        this.app.cardCloseBtn.forEach(button => {
            button.addEventListener('click', e => this.deleteCard(e));
        });
    }

    ////// Event Handler Functions //////

    expandNavbar() {
        this.app.sidebar.classList.toggle('active');
    }

    toggleMobileNav() {
        this.app.mobileNavList.classList.toggle('active');
    }

    displayFilter() {
        this.app.filterBody.style.visibility = 'visible';
        setTimeout(() => {
            this.app.filterBody.classList.add('show');
        }, 30);
    }

    hideFilter() {
        this.app.filterBody.classList.remove('show');
        setTimeout(() => {
            this.app.filterBody.style.visibility = 'hidden';
        }, 500);
    }

    submitFilter(e) {
        e.preventDefault();
    }

    scrollLeft(e, index) {
        const scrollDistance = this.calculateScrollDistance();
        this.app.cardShowcase[index].scrollLeft -= scrollDistance;
    }

    scrollRight(e, index) {
        const scrollDistance = this.calculateScrollDistance();
        this.app.cardShowcase[index].scrollLeft += scrollDistance;
    }

    calculateScrollDistance() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 375) return viewportWidth * 0.355;
        if (viewportWidth <= 768) return viewportWidth * 0.3;
        return viewportWidth;
    }

    activateModal(index) {
        this.app.modals[index].classList.add('active-modal');
    }

    closeModal(modal) {
        modal.classList.remove('active-modal');
    }

    closeAllModals() {
        this.app.modals.forEach(mod => mod.classList.remove('active-modal'));
    }

    searchProducts(e) {
        e.preventDefault();
        const searchQuery = this.app.searchBar.querySelector('input').value.toLowerCase();
    }

    addToCart(e) {
        console.log(e.target.parentElement);
    }

    deleteCard(e) {
        e.target.parentElement.parentElement.remove();
    }
}


class Fetch {
    constructor() {

        this.placeholderFetchUrls = {
            'grailed-view': 'https://grailed.p.rapidapi.com/search?query=shirt&page=1&hitsPerPage=24&sortBy=popular',
            'ebay-view': 'https://ebay38.p.rapidapi.com/search?page=1&query=shirt&country=us',
            'depop-view': 'https://depop-thrift.p.rapidapi.com/search?page=1&query=shirt&country=us&sort=newlyListed',
        };

        this.apiKeys = {
            'grailed-view': 'b4945d3706msh60efc25e098af79p138f3fjsne76aae88b9e6',
            'ebay-view': 'b4945d3706msh60efc25e098af79p138f3fjsne76aae88b9e6',
            'depop-view': 'b4945d3706msh60efc25e098af79p138f3fjsne76aae88b9e6',
        };

        this.rapidApiHost = {
            'grailed-view': 'grailed.p.rapidapi.com',
            'ebay-view': 'ebay38.p.rapidapi.com',
            'depop-view': 'depop-thrift.p.rapidapi.com'
        };
    }

    // Althought this looks just like im returning the same info, the currentPage has a bunch of link info that;s ugly
    getPageFromURL(currentPage) {
        if (currentPage.includes('depop-view')) {
            return 'depop-view'
        }

        if (currentPage.includes('ebay-view')) {
            return 'ebay-view'
        }
        if (currentPage.includes('grailed-view')) {
            return 'grailed-view'
        }

    }

    // Generalized fetch request based on current page
    async makeDeafultRequest(currentPage) {
        const url = this.placeholderFetchUrls[this.getPageFromURL(currentPage)];
        const apiKey = this.apiKeys[this.getPageFromURL(currentPage)];
        const host = this.rapidApiHost[this.getPageFromURL(currentPage)];
        console.log(url, apiKey, host);

       
            let headers = {
                'Content-Type': 'application/json',
            };
        
            if (host) {
                headers['x-rapidapi-key'] = apiKey;
                headers['x-rapidapi-host'] = host;
            } else {
                headers['x-api-key'] = apiKey;  // For Etsy API
            }
        
            console.log(headers)

            try {
                const response = await fetch(url, { method: 'GET', headers });
                let data = await response.json();
        
                // Check for specific page to process data accordingly
                if (this.getPageFromURL(currentPage) === 'etsy-view') {
                    // Hack because etsys data strucutre is diffrent
                    this.cacheData(currentPage, data);
                } else if (this.getPageFromURL(currentPage) === 'grailed-view') {
                    // Assuming Grailed returns an object with items in the hits property
                    if (data.hits) {
                        data = data.hits;
                    }
                    this.cacheData(currentPage, data);
                } else {
                    // Handle other pages similarly if needed
                    this.cacheData(currentPage, data);
                }
        
                return data;
            } catch (error) {
                console.error('Error fetching data for ${currentPage}:, error');
            }
        
    }

    // Cache data in local storage
    cacheData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Load cached data from local storage
    async loadCachedData(currentPage) {
        const cachedData = localStorage.getItem(currentPage);
    
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
    
            if (Array.isArray(parsedData) && parsedData.length >= 24) {
                console.log('Data loaded from cache:', parsedData);
                return parsedData;
            } else {
                console.log('Cached data found, but it has fewer than 10 items.');
                const newData = this.makeDeafultRequest(currentPage); // Grab data from fetch apis
                localStorage.setItem(currentPage, JSON.stringify(newData)); // Cache the new data
                console.log('NEW data from fetch:', parsedData);
                return newData;
            }
        } else {
            console.log('No cached data found, running fallback function.');
            const newData = this.makeDeafultRequest(currentPage); // Grab data from fetch apis
            localStorage.setItem(currentPage, JSON.stringify(newData)); // Cache the new data
            console.log('NEW data from fetch:', parsedData);
            return newData;
        }
    }

}

class ProductDisplay {
    constructor() {
        this.cardDisplays = document.querySelectorAll('.card-showcase'); //holds all modals and cards
    }

    replaceCard(productInfoArray) {
        console.log('running replace cards');
    
        // Delete pre-existing cards
        this.clearProductDisplays();
    
        let productIndex = 0; // Keep track of which product to add
    
        // Iterate through each card display to fill them with products
        this.cardDisplays.forEach(display => {
            while (this.checkDisplayCapacity(display) && productIndex < productInfoArray.length) {
                const product = productInfoArray[productIndex];
    
                // Add the product to the display
                this.createCardAndModal(product, display);
    
                // Move to the next product
                productIndex++;
            }
        });
    
        if (productIndex < productInfoArray.length) {
            console.log('Not enough space for all products');
        } else {
            console.log('All products added successfully');
        }
    
        // Add cached data to local storage through Storage class if needed
    }
    
    checkDisplayCapacity(display) {
        // Check if the display has room for more cards
        if (display.childElementCount >= 8) {
            return false;
        } else {
            return true;
        }
    }

    createCardAndModal(product, parent) {
        // Create product card container
        const productCardContainer = document.createElement('div');
        productCardContainer.classList.add('product-card-container');
    
        // Create card element
        const card = document.createElement('div');
        card.classList.add('card');
    
        const cardImage = document.createElement('img');
        cardImage.src = product.productImg['480'] || product.productImg || 'placeholder_images/slider-1.jpg'; // Default image if not provided
        cardImage.alt = 'Image of ${product.name}';
        cardImage.classList.add('card_image');
    
        card.appendChild(cardImage);
    
        // Create card display
        const cardDisplay = document.createElement('div');
        cardDisplay.classList.add('card-display');
    
        const cardName = document.createElement('h1');
        cardName.classList.add('card-name');
        cardName.textContent = (product.productName.length > 15 
            ? product.productName.substring(0, 10) + '...' 
            : product.productName) || 'Sample';        
    
        const cardPrice = document.createElement('span');
        cardPrice.classList.add('card-price');
        cardPrice.textContent = product.price;
    
        cardDisplay.appendChild(cardName);
        cardDisplay.appendChild(cardPrice);
    
        // Create modal
        const modal = document.createElement('div');
        modal.classList.add('modal');
    
        const modalCard = document.createElement('div');
        modalCard.classList.add('modal_card');
    
        const modalClose = document.createElement('i');
        modalClose.classList.add('bx', 'bxs-right-top-arrow-circle', 'modal_close');
    
        const modalImg = document.createElement('img');
        modalImg.src = product.image || 'placeholder_images/slider-1.jpg'; // Use the same image
        modalImg.alt = 'Modal image of ${product.name}';
        modalImg.classList.add('modal_img');
    
        const modalContent = document.createElement('div');
    
        const modalName = document.createElement('h3');
        modalName.classList.add('modal_name');
        modalName.textContent = product.description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';
    
        const modalInfo = document.createElement('p');
        modalInfo.classList.add('modal_info');
        modalInfo.textContent = product.info || 'Lorem ipsum dolor sit amet.';
    
        const modalPrice = document.createElement('span');
        modalPrice.classList.add('modal_price');
        modalPrice.textContent = product.price ;
    
        const modalButton = document.createElement('button');
        modalButton.classList.add('modal_button');
        modalButton.textContent = 'Add To Cart';
    
        // Append elements to modal content
        modalContent.appendChild(modalName);
        modalContent.appendChild(modalInfo);
        modalContent.appendChild(modalPrice);
    
        // Append elements to modal card
        modalCard.appendChild(modalClose);
        modalCard.appendChild(modalImg);
        modalCard.appendChild(modalContent);
        modalCard.appendChild(modalButton);
    
        // Append modal card to modal
        modal.appendChild(modalCard);
    
        // Append card, display, and modal to product container
        productCardContainer.appendChild(card);
        productCardContainer.appendChild(cardDisplay);
        productCardContainer.appendChild(modal);
    
        // Append the product container to the parent element (e.g., ".card-showcase")
        parent.appendChild(productCardContainer);
    }

    fetchErrorPlaceholders(errorCode) {
        //self.deleteCards
        // Use error code and create place holder cards
        // !!! not to sure what to do with cached data, dont wanna delete it
    }

    clearProductDisplays() {
        this.cardDisplays.forEach(display => {
            while (display.firstChild) {
                display.removeChild(display.firstChild);
            }
        });
    }



}

class Storage {
    constructor() {
        // Depop cached data in local storage
        // Ebay cached data in local storage
        // Etsy cached data in local storage
        // Grailed cached data in local storage    }

    }

    addToLS(self, product) {

    }

    deleteFromLS(self, productId) {

    }


}  

class DataDeconstructor {
    constructor() {
        this.Fetch = new Fetch()
    }

    deconstructData(currentPage, data) {
        let productsArray = [];  // This will hold the product info objects

        currentPage = this.Fetch.getPageFromURL(currentPage)
        console.log('current page :', currentPage)

        switch (currentPage) {
            case 'depop-view':
                productsArray = this.deconstructDepop(data);
                break;
            // You can add more cases for different platforms as needed
            case 'ebay-view':
                productsArray = this.deconstructEbay(data);
                break;
            case 'grailed-view':
                productsArray = this.deconstructGrailed(data);
                break
            default:
                console.error('Unknown page: ${currentPage}');
        }

        return productsArray;  // Return the complete array of product information
    }

    deconstructDepop(data) {
        let productsArray = [];  // Collect all the productInfo objects in this array

        for (let product of data) {  // Iterating over array
            let productInfo = {
                "productId": product.id,
                "productImg": product.pictures[0],
                "price": product.price.priceAmount,
                "productName": this.extractProductName(product.slug),
                "productSize": product.sizes[0],
            };
            productsArray.push(productInfo); // Collect each productInfo into the array
        }

        return productsArray;  // Return the complete array of product information
    }

    deconstructGrailed(data) {
        let productsArray = [];

        for (let product of data) {
            let productInfo = {
                "productId": product.id,
                "productImg": product.cover_photo.url,
                "price": product.price,
                "productName": product.title,
                "productSize": product.size,
            };
            productsArray.push(productInfo);
        }


        return productsArray;  // Return the complete array of product information
    }

    deconstructEbay(data){

        console.log(data)
        
        let productsArray = [];  // Collect all the productInfo objects in this array

        for (let product of data) {  // Iterating over array
            let productInfo = {
                "productId": product.id,
                "productImg": product.image,
                "price": product.buyItNowPrice ?? product.bidPrice,
                "productName": product.title,
                "productSize": product.condition,
            };
            productsArray.push(productInfo); // Collect each productInfo into the array
        }

        return productsArray;  // Return the complete array of product information
    }

    extractProductName(grossString) {
        // Step 1: Split the string at the first '-'
        const parts = grossString.split('-');
        
        // Step 2: Remove the account name (first part) and keep the rest
        parts.shift();  // This removes the account name
    
        // Step 3: Join the rest back together with spaces and format it
        const productName = parts.join(' ')
            .replace(/-/g, ' ')       // Replace any remaining dashes with spaces
            .replace(/\b\w/g, char => char.toUpperCase());  // Capitalize the first letter of each word
    
        return productName;
    }
 
}




function navigateTo(link) {
    window.location.replace(link);

}

document.addEventListener('DOMContentLoaded', () => {
    App = new App();
});

