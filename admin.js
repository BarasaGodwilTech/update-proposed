// Admin Panel JavaScript - Will's Tech Store
class WillTechAdmin {
    constructor() {
        this.currentData = {};
        this.githubToken = null;
        this.repoConfig = {
            owner: 'BarasaGodwilTech',
            repo: 'willstech-tempolary',
            branch: 'branch-test'
        };
        this.editingProductId = null;
    }

    async init() {
        console.log('Admin panel initializing...');
        
        // Check authentication first
        if (!localStorage.getItem('willstech_admin_auth')) {
            console.log('Not authenticated, redirecting to login...');
            window.location.href = 'admin-login.html';
            return;
        }

        console.log('Authentication passed, loading data...');
        
        // Load settings first
        await this.loadSettings();
        
        // Then load current data from GitHub
        await this.syncWithGitHub();
        
        this.setupEventListeners();
        this.setupNavigation();
        
        console.log('Admin panel fully initialized');
    }

    async loadSettings() {
        // Load GitHub token and repo config from localStorage
        this.githubToken = localStorage.getItem('willstech_github_token');
        const savedRepoConfig = localStorage.getItem('willstech_repo_config');
        if (savedRepoConfig) {
            this.repoConfig = { ...this.repoConfig, ...JSON.parse(savedRepoConfig) };
        }
        
        // Populate settings form if exists
        if (document.getElementById('githubToken')) {
            document.getElementById('githubToken').value = this.githubToken || '';
        }
        if (document.getElementById('repoOwner')) {
            document.getElementById('repoOwner').value = this.repoConfig.owner;
        }
        if (document.getElementById('repoName')) {
            document.getElementById('repoName').value = this.repoConfig.repo;
        }
        if (document.getElementById('branchName')) {
            document.getElementById('branchName').value = this.repoConfig.branch;
        }
        
        this.updateDeploymentTarget();
    }

    async syncWithGitHub() {
        try {
            this.showAlert('🔄 Syncing with GitHub repository...', 'success');
            
            if (!this.githubToken) {
                this.showAlert('⚠️ Please set GitHub token in Settings tab first', 'error');
                this.showTab('settings');
                return;
            }

            // Load current data from GitHub files
            await this.loadDataFromGitHub();
            
            // Populate forms with current data
            this.populateForms();
            this.loadProducts();
            
            this.showAlert('✅ Successfully synced with GitHub!', 'success');
            
        } catch (error) {
            console.error('Sync failed:', error);
            this.showAlert(`❌ Sync failed: ${error.message}`, 'error');
        }
    }

    async loadDataFromGitHub() {
        console.log('Loading data from GitHub repository...');
        
        try {
            // Try to load from site-config.json first
            const configData = await this.fetchFileFromGitHub('data/site-config.json');
            if (configData) {
                this.currentData = configData;
                console.log('Loaded data from site-config.json');
                return;
            }
            
            // If no config file exists, extract from current site
            await this.extractDataFromCurrentSite();
            
        } catch (error) {
            console.error('Error loading from GitHub:', error);
            throw new Error('Could not load data from repository');
        }
    }

    async fetchFileFromGitHub(filePath) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.repoConfig.owner}/${this.repoConfig.repo}/contents/${filePath}?ref=${this.repoConfig.branch}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (response.ok) {
                const fileData = await response.json();
                const content = atob(fileData.content);
                return JSON.parse(content);
            }
            return null;
        } catch (error) {
            console.error(`Error fetching ${filePath}:`, error);
            return null;
        }
    }

    async extractDataFromCurrentSite() {
        console.log('Extracting data from current website files...');
        
        try {
            // Extract products from HTML
            const products = await this.extractProductsFromHTML();
            
            this.currentData = {
                hero: await this.extractHeroData(),
                products: products,
                content: await this.extractContentData(),
                social: await this.extractSocialData(),
                lastSynced: new Date().toISOString()
            };
            
            console.log('Data extracted from current site:', this.currentData);
            
        } catch (error) {
            console.error('Error extracting data from site:', error);
            // Initialize with empty structure
            this.currentData = this.getEmptyDataStructure();
        }
    }

    async extractProductsFromHTML() {
        console.log('Extracting products from HTML...');
        
        try {
            const response = await fetch('index.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const products = [];
            const productCards = doc.querySelectorAll('.product-card');
            
            productCards.forEach((card, index) => {
                try {
                    const name = card.querySelector('h3')?.textContent?.trim();
                    const description = card.querySelector('.product-description')?.textContent?.trim();
                    const priceElement = card.querySelector('.current-price');
                    const price = priceElement ? this.extractPriceFromText(priceElement.textContent) : '0';
                    const image = card.querySelector('img')?.getAttribute('src') || '';
                    const category = card.getAttribute('data-category') || 'electronics';
                    
                    // Extract badges
                    const badges = [];
                    const badgeElements = card.querySelectorAll('.product-badge');
                    badgeElements.forEach(badge => {
                        if (badge.classList.contains('badge-new')) badges.push('new');
                        if (badge.classList.contains('badge-sale')) badges.push('sale');
                        if (badge.classList.contains('badge-bestseller')) badges.push('bestseller');
                        if (badge.classList.contains('badge-limited')) badges.push('limited');
                    });
                    
                    // Extract rating
                    const stars = card.querySelectorAll('.stars .fa-star, .stars .fa-star-half-alt');
                    let rating = 5; // Default
                    if (stars.length > 0) {
                        rating = 0;
                        stars.forEach(star => {
                            if (star.classList.contains('fa-star')) rating += 1;
                            if (star.classList.contains('fa-star-half-alt')) rating += 0.5;
                        });
                    }

                    const productData = {
                        id: Date.now() + index,
                        name: name || 'Unnamed Product',
                        description: description || '',
                        price: price,
                        image: image,
                        category: category,
                        featured: true,
                        status: 'active',
                        dateAdded: new Date().toISOString(),
                        badges: badges,
                        rating: rating,
                        // Store original price if available
                        originalPrice: this.extractPriceFromText(card.querySelector('.original-price')?.textContent) || null
                    };
                    
                    if (productData.name && productData.name !== 'Unnamed Product') {
                        products.push(productData);
                    }
                } catch (error) {
                    console.log('Error parsing product card:', error);
                }
            });
            
            console.log(`Extracted ${products.length} products from HTML`);
            return products;
            
        } catch (error) {
            console.error('Error extracting products from HTML:', error);
            return [];
        }
    }

    extractPriceFromText(priceText) {
        if (!priceText) return '0';
        // Extract numbers from price text like "UGX 4,500,000"
        const priceMatch = priceText.replace(/[^\d]/g, '');
        return priceMatch || '0';
    }

    async extractHeroData() {
        try {
            const response = await fetch('index.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const heroSection = doc.querySelector('.hero');
            return {
                title: heroSection?.querySelector('h1')?.textContent?.trim() || '',
                description: heroSection?.querySelector('p')?.textContent?.trim() || '',
                whatsappLink: heroSection?.querySelector('.btn-primary[href*="wa.me"]')?.getAttribute('href') || ''
            };
        } catch (error) {
            return { title: '', description: '', whatsappLink: '' };
        }
    }

    async extractContentData() {
        try {
            const response = await fetch('index.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            return {
                storeName: doc.querySelector('title')?.textContent || "Will's Tech Store",
                tagline: doc.querySelector('.header-slogan .tagline')?.textContent || 'Elevate Your Lifestyle With Authentic Tech',
                description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                contactInfo: this.extractContactInfo(doc)
            };
        } catch (error) {
            return { storeName: '', tagline: '', description: '', contactInfo: '' };
        }
    }

    async extractSocialData() {
        try {
            const response = await fetch('index.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            return this.extractSocialLinks(doc);
        } catch (error) {
            return { facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '' };
        }
    }

    extractSocialLinks(doc) {
        const socialLinks = {
            facebook: '',
            instagram: '',
            twitter: '',
            tiktok: '',
            youtube: ''
        };
        
        // Extract from hero section
        const heroLinks = doc.querySelectorAll('.hero .social-links a');
        heroLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('facebook')) socialLinks.facebook = href;
            else if (href.includes('instagram')) socialLinks.instagram = href;
            else if (href.includes('twitter') || href.includes('x.com')) socialLinks.twitter = href;
            else if (href.includes('tiktok')) socialLinks.tiktok = href;
            else if (href.includes('youtube')) socialLinks.youtube = href;
        });
        
        return socialLinks;
    }

    extractContactInfo(doc) {
        const contactSection = doc.querySelector('.contact-info');
        if (contactSection) {
            return contactSection.textContent.trim();
        }
        return "WhatsApp: +256 751 924 844\nEmail: wills.tech.store.ug@gmail.com\nLocations: Kampala & Mbale, Uganda\nBusiness Hours: Mon-Sat 8:00 AM - 8:00 PM, Sun 10:00 AM - 6:00 PM";
    }

    getEmptyDataStructure() {
        return {
            hero: { title: '', description: '', whatsappLink: '' },
            products: [],
            content: { storeName: '', tagline: '', description: '', contactInfo: '' },
            social: { facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '' },
            lastSynced: new Date().toISOString()
        };
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Form submissions
        const heroForm = document.getElementById('heroForm');
        const productForm = document.getElementById('productForm');
        const contentForm = document.getElementById('contentForm');
        const socialForm = document.getElementById('socialForm');
        const settingsForm = document.getElementById('settingsForm');
        
        if (heroForm) {
            heroForm.addEventListener('submit', (e) => this.handleHeroForm(e));
        }
        
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductForm(e));
        }
        
        if (contentForm) {
            contentForm.addEventListener('submit', (e) => this.handleContentForm(e));
        }
        
        if (socialForm) {
            socialForm.addEventListener('submit', (e) => this.handleSocialForm(e));
        }
        
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSettingsForm(e));
        }
        
        // Sync button
        const syncBtn = document.getElementById('syncBtn');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.syncWithGitHub());
        }
        
        // Logout
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Product tabs
        const productTabs = document.querySelectorAll('[data-tab]');
        productTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchProductTab(tabName);
            });
        });

        // Cancel edit button
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.cancelEdit());
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target && target.startsWith('#')) {
                    const tabName = target.substring(1);
                    this.showTab(tabName);
                    
                    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
    }

    showTab(tabName) {
        const allTabs = document.querySelectorAll('.tab-content');
        allTabs.forEach(tab => tab.classList.remove('active'));
        
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    switchProductTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.querySelectorAll('#products .tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // Reset form when switching to add product tab
        if (tabName === 'add-product') {
            this.cancelEdit();
        }
    }

    populateForms() {
        // Populate hero form
        if (document.getElementById('heroTitle') && this.currentData.hero) {
            document.getElementById('heroTitle').value = this.currentData.hero.title || '';
            document.getElementById('heroDescription').value = this.currentData.hero.description || '';
            document.getElementById('whatsappLink').value = this.currentData.hero.whatsappLink || '';
        }

        // Populate content form
        if (document.getElementById('storeName') && this.currentData.content) {
            document.getElementById('storeName').value = this.currentData.content.storeName || '';
            document.getElementById('storeTagline').value = this.currentData.content.tagline || '';
            document.getElementById('storeDescription').value = this.currentData.content.description || '';
            document.getElementById('contactInfo').value = this.currentData.content.contactInfo || '';
        }

        // Populate social form
        if (document.getElementById('facebookLink') && this.currentData.social) {
            document.getElementById('facebookLink').value = this.currentData.social.facebook || '';
            document.getElementById('instagramLink').value = this.currentData.social.instagram || '';
            document.getElementById('twitterLink').value = this.currentData.social.twitter || '';
            document.getElementById('tiktokLink').value = this.currentData.social.tiktok || '';
            document.getElementById('youtubeLink').value = this.currentData.social.youtube || '';
        }
    }

    async handleHeroForm(e) {
        e.preventDefault();
        
        this.currentData.hero = {
            title: document.getElementById('heroTitle').value,
            description: document.getElementById('heroDescription').value,
            whatsappLink: document.getElementById('whatsappLink').value
        };
        
        await this.saveToGitHub();
        this.showAlert('Hero section updated successfully!', 'success');
    }

    async handleProductForm(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            image: document.getElementById('productImage').value,
            featured: document.getElementById('productFeatured').checked,
            status: 'active'
        };

        if (this.editingProductId) {
            // Update existing product
            const productIndex = this.currentData.products.findIndex(p => p.id === this.editingProductId);
            if (productIndex !== -1) {
                this.currentData.products[productIndex] = {
                    ...this.currentData.products[productIndex],
                    ...productData,
                    dateUpdated: new Date().toISOString()
                };
                this.showAlert('Product updated successfully!', 'success');
            }
        } else {
            // Add new product
            const newProduct = {
                id: Date.now(),
                ...productData,
                dateAdded: new Date().toISOString(),
                badges: ['new'],
                rating: 5
            };
            
            if (!this.currentData.products) {
                this.currentData.products = [];
            }
            
            this.currentData.products.push(newProduct);
            this.showAlert('Product added successfully!', 'success');
        }
        
        await this.saveToGitHub();
        this.loadProducts();
        this.cancelEdit();
        e.target.reset();
    }

    async handleContentForm(e) {
        e.preventDefault();
        
        this.currentData.content = {
            storeName: document.getElementById('storeName').value,
            tagline: document.getElementById('storeTagline').value,
            description: document.getElementById('storeDescription').value,
            contactInfo: document.getElementById('contactInfo').value
        };
        
        await this.saveToGitHub();
        this.showAlert('Content updated successfully!', 'success');
    }

    async handleSocialForm(e) {
        e.preventDefault();
        
        this.currentData.social = {
            facebook: document.getElementById('facebookLink').value,
            instagram: document.getElementById('instagramLink').value,
            twitter: document.getElementById('twitterLink').value,
            tiktok: document.getElementById('tiktokLink').value,
            youtube: document.getElementById('youtubeLink').value
        };
        
        await this.saveToGitHub();
        this.showAlert('Social links updated successfully!', 'success');
    }

    async handleSettingsForm(e) {
        e.preventDefault();
        
        const token = document.getElementById('githubToken').value;
        const owner = document.getElementById('repoOwner').value;
        const repo = document.getElementById('repoName').value;
        const branch = document.getElementById('branchName').value;
        
        if (!token) {
            this.showAlert('❌ GitHub Token is required', 'error');
            return;
        }
        
        // Save settings
        this.githubToken = token;
        this.repoConfig = { owner, repo, branch };
        
        localStorage.setItem('willstech_github_token', token);
        localStorage.setItem('willstech_repo_config', JSON.stringify(this.repoConfig));
        
        this.showAlert('Settings saved successfully!', 'success');
        this.updateDeploymentTarget();
        
        // Sync with new settings
        await this.syncWithGitHub();
    }

    async saveToGitHub() {
        if (!this.githubToken) {
            this.showAlert('❌ Please set GitHub token in Settings first', 'error');
            this.showTab('settings');
            return false;
        }

        try {
            this.showAlert('💾 Saving to GitHub...', 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Save site configuration
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            this.showAlert('✅ Successfully saved to GitHub!', 'success');
            return true;
            
        } catch (error) {
            this.showAlert(`❌ Save failed: ${error.message}`, 'error');
            return false;
        }
    }

    async updateFileOnGitHub(filePath, content) {
        let existingSha = null;
        
        try {
            const getResponse = await fetch(
                `https://api.github.com/repos/${this.repoConfig.owner}/${this.repoConfig.repo}/contents/${filePath}?ref=${this.repoConfig.branch}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (getResponse.ok) {
                const fileData = await getResponse.json();
                existingSha = fileData.sha;
            }
        } catch (error) {
            // File doesn't exist, we'll create it
        }

        const putResponse = await fetch(
            `https://api.github.com/repos/${this.repoConfig.owner}/${this.repoConfig.repo}/contents/${filePath}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `🔄 Will's Tech Update - ${filePath} - ${new Date().toLocaleString('en-UG')}`,
                    content: btoa(unescape(encodeURIComponent(content))),
                    branch: this.repoConfig.branch,
                    sha: existingSha
                })
            }
        );

        if (!putResponse.ok) {
            const errorText = await putResponse.text();
            throw new Error(`Failed to update ${filePath}: ${putResponse.status}`);
        }

        return await putResponse.json();
    }

    loadProducts() {
        const container = document.getElementById('productsContainer');
        if (!container || !this.currentData.products) return;

        container.innerHTML = '';
        
        const activeProducts = this.currentData.products.filter(p => p.status !== 'hidden');
        const hiddenProducts = this.currentData.products.filter(p => p.status === 'hidden');
        
        // Display active products
        activeProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });

        // Display hidden products section
        if (hiddenProducts.length > 0) {
            const hiddenSection = document.createElement('div');
            hiddenSection.className = 'hidden-products-section';
            hiddenSection.innerHTML = `
                <h3 style="color: #666; margin: 2rem 0 1rem 0; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem;">
                    <i class="fas fa-eye-slash"></i> Hidden Products (${hiddenProducts.length})
                </h3>
            `;
            container.appendChild(hiddenSection);

            hiddenProducts.forEach(product => {
                const productCard = this.createProductCard(product);
                hiddenSection.appendChild(productCard);
            });
        }

        // Update products count
        const productsCountElement = document.getElementById('productsCount');
        if (productsCountElement) {
            productsCountElement.textContent = `${activeProducts.length} active, ${hiddenProducts.length} hidden`;
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = `product-card ${product.status === 'hidden' ? 'product-hidden' : ''}`;
        
        const formattedPrice = this.formatPrice(product.price);
        const ratingStars = this.generateRatingStars(product.rating || 5);
        
        card.innerHTML = `
            <div class="product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 120px; object-fit: cover;">` :
                    `<i class="fas fa-box" style="font-size: 3rem; color: #ccc;"></i>`
                }
                ${product.featured ? '<div class="featured-badge">Featured</div>' : ''}
                ${product.status === 'hidden' ? '<div class="hidden-badge">Hidden</div>' : ''}
                ${product.badges && product.badges.length > 0 ? `
                    <div class="product-badges">
                        ${product.badges.map(badge => `<span class="product-badge badge-${badge}">${badge}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p><strong>UGX ${formattedPrice}</strong></p>
            <p><small>Category: ${product.category}</small></p>
            <p><small>Added: ${new Date(product.dateAdded).toLocaleDateString()}</small></p>
            ${product.rating ? `
                <div class="product-rating">
                    <div class="stars" aria-label="${product.rating} out of 5 stars">
                        ${ratingStars}
                    </div>
                </div>
            ` : ''}
            <div class="product-actions">
                <button class="btn btn-primary" onclick="admin.editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                ${product.status === 'hidden' ? 
                    `<button class="btn btn-success" onclick="admin.toggleProductVisibility(${product.id})">
                        <i class="fas fa-eye"></i> Show
                    </button>` :
                    `<button class="btn btn-warning" onclick="admin.toggleProductVisibility(${product.id})">
                        <i class="fas fa-eye-slash"></i> Hide
                    </button>`
                }
                <button class="btn btn-danger" onclick="admin.deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        return card;
    }

    generateRatingStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    editProduct(productId) {
        const product = this.currentData.products.find(p => p.id === productId);
        if (product) {
            // Populate form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productFeatured').checked = product.featured || false;
            
            // Set editing mode
            this.editingProductId = productId;
            
            // Update UI for edit mode
            this.setEditMode(true);
            
            // Switch to add product tab (which now becomes edit product)
            this.switchProductTab('add-product');
            
            this.showAlert(`Editing: ${product.name}`, 'success');
        }
    }

    setEditMode(isEdit) {
        const formTitle = document.getElementById('productFormTitle');
        const submitBtn = document.getElementById('productSubmitBtn');
        const cancelBtn = document.getElementById('cancelEditBtn');
        
        if (formTitle) {
            formTitle.textContent = isEdit ? 'Edit Product' : 'Add New Product';
        }
        
        if (submitBtn) {
            submitBtn.innerHTML = isEdit ? 
                '<i class="fas fa-save"></i> Update Product' : 
                '<i class="fas fa-plus"></i> Add Product';
        }
        
        if (cancelBtn) {
            cancelBtn.style.display = isEdit ? 'inline-block' : 'none';
        }
    }

    cancelEdit() {
        this.editingProductId = null;
        this.setEditMode(false);
        
        // Clear the form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.reset();
        }
    }

    async toggleProductVisibility(productId) {
        const product = this.currentData.products.find(p => p.id === productId);
        if (product) {
            product.status = product.status === 'hidden' ? 'active' : 'hidden';
            await this.saveToGitHub();
            this.loadProducts();
            
            const action = product.status === 'hidden' ? 'hidden' : 'shown';
            this.showAlert(`Product ${action} successfully!`, 'success');
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        this.currentData.products = this.currentData.products.filter(p => p.id !== productId);
        const success = await this.saveToGitHub();
        
        if (success) {
            this.loadProducts();
            this.showAlert('Product deleted successfully!', 'success');
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-UG').format(price);
    }

    updateDeploymentTarget() {
        const repo = `${this.repoConfig.owner}/${this.repoConfig.repo}`;
        const targetElement = document.getElementById('deploymentTarget');
        
        if (targetElement) {
            targetElement.innerHTML = `
                <strong>Repository:</strong> ${repo}<br>
                <strong>Branch:</strong> ${this.repoConfig.branch}<br>
                <strong>URL:</strong> https://github.com/${repo}/tree/${this.repoConfig.branch}
            `;
        }
    }

    showAlert(message, type) {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.cssText = `
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            ${type === 'success' ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' : ''}
            ${type === 'error' ? 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;' : ''}
        `;
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(alert, mainContent.firstChild);
        }
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    logout() {
        localStorage.removeItem('willstech_admin_auth');
        window.location.href = 'admin-login.html';
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, creating admin instance...');
    window.admin = new WillTechAdmin();
    window.admin.init();
});