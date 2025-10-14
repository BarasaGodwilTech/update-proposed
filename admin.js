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
        this.lastSavedData = {}; // Track last saved state for comparison
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
        this.setupEditFormListener(); // ADD THIS LINE
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
            
            // Store the initial state for comparison
            this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
            
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
                // Handle both string content (new files) and object content (existing files)
                let content;
                if (typeof fileData.content === 'string') {
                    content = atob(fileData.content);
                } else if (fileData.content && fileData.content.content) {
                    content = atob(fileData.content.content);
                } else {
                    content = '';
                }
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

        // ADD THIS LINE for the edit form:
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', (e) => this.handleEditProductForm(e));
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
        
        // Deploy button
        const deployBtn = document.getElementById('deployBtn');
        if (deployBtn) {
            deployBtn.addEventListener('click', () => this.deployChanges());
        }
        
        // Backup buttons
        const backupBtn = document.getElementById('backupBtn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.downloadBackup());
        }
        
        const restoreBtn = document.getElementById('restoreBtn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => this.restoreBackup());
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

    // Add this method to switch to edit tab
showEditTab() {
    // Hide all tabs first
    document.querySelectorAll('.tab').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show the edit tab
    const editTab = document.querySelector('[data-tab="edit-product"]');
    if (editTab) {
        editTab.style.display = 'block';
        editTab.classList.add('active');
    }
    
    // Hide other tab contents and show edit form
    document.querySelectorAll('#products .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('edit-product').classList.add('active');
}

// Add this method to reset tabs to normal state
resetProductTabs() {
    // Show all tabs except edit tab
    document.querySelectorAll('.tab').forEach(tab => {
        const tabName = tab.getAttribute('data-tab');
        if (tabName !== 'edit-product') {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });
    
    // Reset active states
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector('[data-tab="products-list"]').classList.add('active');
    
    // Reset tab contents
    document.querySelectorAll('#products .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('products-list').classList.add('active');
}

// Handle edit form submission
async handleEditProductForm(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('editProductName').value,
        category: document.getElementById('editProductCategory').value,
        description: document.getElementById('editProductDescription').value,
        price: document.getElementById('editProductPrice').value,
        image: document.getElementById('editProductImage').value,
        featured: document.getElementById('editProductFeatured').checked,
        status: 'active'
    };

    if (this.editingProductId) {
        // Update existing product
        const productIndex = this.currentData.products.findIndex(p => p.id === this.editingProductId);
        if (productIndex !== -1) {
            const oldProduct = this.currentData.products[productIndex];
            this.currentData.products[productIndex] = {
                ...oldProduct,
                ...productData,
                dateUpdated: new Date().toISOString()
            };
            
            // Check if product actually changed
            if (this.hasProductChanged(oldProduct, this.currentData.products[productIndex])) {
                await this.saveProductChanges(this.currentData.products[productIndex]);
                this.showAlert('Product updated successfully!', 'success');
                this.cancelEdit(); // Go back to products list
            } else {
                this.showAlert('No changes detected in product.', 'info');
            }
        }
    }
}

// Setup edit form listener
setupEditFormListener() {
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => this.handleEditProductForm(e));
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

    // NEW VERSION - REPLACE WITH THIS:
switchProductTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('#products .tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    // Reset form when switching to add product tab
    if (tabName === 'add-product') {
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.reset();
        }
    }
    
    // Cancel edit if switching away from edit tab
    if (tabName !== 'edit-product' && this.editingProductId) {
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
        
        const newHeroData = {
            title: document.getElementById('heroTitle').value,
            description: document.getElementById('heroDescription').value,
            whatsappLink: document.getElementById('whatsappLink').value
        };
        
        // Check if hero data actually changed
        if (this.hasDataChanged('hero', newHeroData)) {
            this.currentData.hero = newHeroData;
            await this.saveHeroChanges();
            this.showAlert('Hero section updated successfully!', 'success');
        } else {
            this.showAlert('No changes detected in hero section.', 'info');
        }
    }

    async handleProductForm(e) {
    e.preventDefault();
    
    // Get badges from checkboxes
    const badgeCheckboxes = document.querySelectorAll('#add-product input[name="productBadges"]:checked');
    const badges = Array.from(badgeCheckboxes).map(cb => cb.value);
    
    // Get features from textarea
    const featuresText = document.getElementById('productFeatures').value;
    const features = featuresText.split('\n').filter(f => f.trim() !== '');
    
    // Parse specifications
    let specifications = {};
    try {
        const specsText = document.getElementById('productSpecifications').value;
        if (specsText.trim()) {
            specifications = JSON.parse(specsText);
        }
    } catch (error) {
        this.showAlert('Invalid specifications JSON format', 'error');
        return;
    }

    const productData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        originalPrice: document.getElementById('productOriginalPrice').value || null,
        image: document.getElementById('productImage').value,
        stock: document.getElementById('productStock').value,
        rating: parseFloat(document.getElementById('productRating').value),
        reviewCount: parseInt(document.getElementById('productReviewCount').value),
        badges: badges,
        features: features,
        specifications: specifications,
        featured: document.getElementById('productFeatured').checked,
        status: 'active'
    };

    if (this.editingProductId) {
        // Update existing product
        const productIndex = this.currentData.products.findIndex(p => p.id === this.editingProductId);
        if (productIndex !== -1) {
            const oldProduct = this.currentData.products[productIndex];
            this.currentData.products[productIndex] = {
                ...oldProduct,
                ...productData,
                dateUpdated: new Date().toISOString()
            };
            
            if (this.hasProductChanged(oldProduct, this.currentData.products[productIndex])) {
                await this.saveProductChanges(this.currentData.products[productIndex]);
                this.showAlert('Product updated successfully!', 'success');
                this.cancelEdit();
            } else {
                this.showAlert('No changes detected in product.', 'info');
            }
        }
    } else {
        // Add new product
        const newProduct = {
            id: Date.now(),
            ...productData,
            dateAdded: new Date().toISOString()
        };
        
        if (!this.currentData.products) {
            this.currentData.products = [];
        }
        
        this.currentData.products.push(newProduct);
        await this.saveNewProduct(newProduct);
        this.showAlert('Product added successfully!', 'success');
    }
    
    this.loadProducts();
    this.cancelEdit();
    e.target.reset();
}

//handleContentForm
    async handleContentForm(e) {
        e.preventDefault();
        
        const newContentData = {
            storeName: document.getElementById('storeName').value,
            tagline: document.getElementById('storeTagline').value,
            description: document.getElementById('storeDescription').value,
            contactInfo: document.getElementById('contactInfo').value
        };
        
        // Check if content data actually changed
        if (this.hasDataChanged('content', newContentData)) {
            this.currentData.content = newContentData;
            await this.saveContentChanges();
            this.showAlert('Content updated successfully!', 'success');
        } else {
            this.showAlert('No changes detected in content.', 'info');
        }
    }

    async handleSocialForm(e) {
        e.preventDefault();
        
        const newSocialData = {
            facebook: document.getElementById('facebookLink').value,
            instagram: document.getElementById('instagramLink').value,
            twitter: document.getElementById('twitterLink').value,
            tiktok: document.getElementById('tiktokLink').value,
            youtube: document.getElementById('youtubeLink').value
        };
        
        // Check if social data actually changed
        if (this.hasDataChanged('social', newSocialData)) {
            this.currentData.social = newSocialData;
            await this.saveSocialChanges();
            this.showAlert('Social links updated successfully!', 'success');
        } else {
            this.showAlert('No changes detected in social links.', 'info');
        }
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

    // NEW: Intelligent save methods for specific changes
    async saveHeroChanges() {
        if (!this.githubToken) {
            this.showAlert('❌ Please set GitHub token in Settings first', 'error');
            this.showTab('settings');
            return false;
        }

        try {
            this.showAlert('💾 Updating hero section...', 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Update site-config.json with only hero changes
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            // Update last saved state
            this.lastSavedData.hero = JSON.parse(JSON.stringify(this.currentData.hero));
            
            this.showAlert('✅ Hero section updated successfully!', 'success');
            return true;
            
        } catch (error) {
            this.showAlert(`❌ Hero update failed: ${error.message}`, 'error');
            return false;
        }
    }

    async saveContentChanges() {
        if (!this.githubToken) {
            this.showAlert('❌ Please set GitHub token in Settings first', 'error');
            this.showTab('settings');
            return false;
        }

        try {
            this.showAlert('💾 Updating website content...', 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Update site-config.json with content changes
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            // Update last saved state
            this.lastSavedData.content = JSON.parse(JSON.stringify(this.currentData.content));
            
            this.showAlert('✅ Content updated successfully!', 'success');
            return true;
            
        } catch (error) {
            this.showAlert(`❌ Content update failed: ${error.message}`, 'error');
            return false;
        }
    }

    async saveSocialChanges() {
        if (!this.githubToken) {
            this.showAlert('❌ Please set GitHub token in Settings first', 'error');
            this.showTab('settings');
            return false;
        }

        try {
            this.showAlert('💾 Updating social links...', 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Update site-config.json with social changes
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            // Update last saved state
            this.lastSavedData.social = JSON.parse(JSON.stringify(this.currentData.social));
            
            this.showAlert('✅ Social links updated successfully!', 'success');
            return true;
            
        } catch (error) {
            this.showAlert(`❌ Social links update failed: ${error.message}`, 'error');
            return false;
        }
    }

    async saveProductChanges(updatedProduct) {
        if (!this.githubToken) {
            this.showAlert('❌ Please set GitHub token in Settings first', 'error');
            this.showTab('settings');
            return false;
        }

        try {
            this.showAlert(`💾 Updating product: ${updatedProduct.name}...`, 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Update site-config.json with product changes
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            this.showAlert(`✅ Product "${updatedProduct.name}" updated successfully!`, 'success');
            return true;
            
        } catch (error) {
            this.showAlert(`❌ Product update failed: ${error.message}`, 'error');
            return false;
        }
    }

    async saveNewProduct(newProduct) {
        if (!this.githubToken) {
            this.showAlert('❌ Please set GitHub token in Settings first', 'error');
            this.showTab('settings');
            return false;
        }

        try {
            this.showAlert(`💾 Adding new product: ${newProduct.name}...`, 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Update site-config.json with new product
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            this.showAlert(`✅ Product "${newProduct.name}" added successfully!`, 'success');
            return true;
            
        } catch (error) {
            this.showAlert(`❌ Product addition failed: ${error.message}`, 'error');
            return false;
        }
    }

    async toggleProductVisibility(productId) {
        const product = this.currentData.products.find(p => p.id === productId);
        if (product) {
            product.status = product.status === 'hidden' ? 'active' : 'hidden';
            await this.saveProductChanges(product);
            
            const action = product.status === 'hidden' ? 'hidden' : 'shown';
            this.showAlert(`Product ${action} successfully!`, 'success');
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        const product = this.currentData.products.find(p => p.id === productId);
        if (!product) return;

        this.currentData.products = this.currentData.products.filter(p => p.id !== productId);
        
        try {
            this.showAlert(`💾 Deleting product: ${product.name}...`, 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Update site-config.json
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            this.loadProducts();
            this.showAlert(`✅ Product "${product.name}" deleted successfully!`, 'success');
            
        } catch (error) {
            this.showAlert(`❌ Product deletion failed: ${error.message}`, 'error');
            // Revert the change if deletion failed
            this.currentData.products.push(product);
            this.loadProducts();
        }
    }

    // NEW: Data comparison methods
    hasDataChanged(section, newData) {
        if (!this.lastSavedData[section]) return true;
        
        return JSON.stringify(this.lastSavedData[section]) !== JSON.stringify(newData);
    }

    hasProductChanged(oldProduct, newProduct) {
        return JSON.stringify(oldProduct) !== JSON.stringify(newProduct);
    }

    // Load products display
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
    const formattedOriginalPrice = product.originalPrice ? this.formatPrice(product.originalPrice) : null;
    const ratingStars = this.generateRatingStars(product.rating || 5);
    const discount = formattedOriginalPrice ? 
        Math.round((1 - product.price / product.originalPrice) * 100) : null;
    
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
        <p class="product-sku"><small>SKU: ${product.sku || 'N/A'}</small></p>
        <p class="product-description">${product.description}</p>
        
        <div class="product-pricing">
            <p><strong>UGX ${formattedPrice}</strong></p>
            ${formattedOriginalPrice ? `
                <p><small style="text-decoration: line-through; color: #666;">UGX ${formattedOriginalPrice}</small></p>
                ${discount ? `<p><small style="color: #ef4444;">Save ${discount}%</small></p>` : ''}
            ` : ''}
        </div>
        
        <p><small>Category: ${product.category}</small></p>
        <p><small>Stock: <span class="stock-${product.stock || 'in-stock'}">${this.formatStockStatus(product.stock)}</span></small></p>
        
        ${product.rating ? `
            <div class="product-rating">
                <div class="stars" aria-label="${product.rating} out of 5 stars">
                    ${ratingStars}
                </div>
                <span class="rating-count">(${product.reviewCount || 0} reviews)</span>
            </div>
        ` : ''}
        
        ${product.features && product.features.length > 0 ? `
            <div class="product-features-preview">
                <strong>Key Features:</strong>
                <ul>
                    ${product.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
                    ${product.features.length > 3 ? `<li>+${product.features.length - 3} more</li>` : ''}
                </ul>
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

    // NEW VERSION - REPLACE WITH THIS:

    editProduct(productId) {
    const product = this.currentData.products.find(p => p.id === productId);
    if (product) {
        // Populate basic fields
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductSku').value = product.sku || '';
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductOriginalPrice').value = product.originalPrice || '';
        document.getElementById('editProductImage').value = product.image || '';
        document.getElementById('editProductStock').value = product.stock || 'in-stock';
        document.getElementById('editProductRating').value = product.rating || 5;
        document.getElementById('editProductReviewCount').value = product.reviewCount || 0;
        document.getElementById('editProductFeatured').checked = product.featured || false;
        
        // Populate badges
        const badgeCheckboxes = document.querySelectorAll('#edit-product input[name="editProductBadges"]');
        badgeCheckboxes.forEach(checkbox => {
            checkbox.checked = product.badges ? product.badges.includes(checkbox.value) : false;
        });
        
        // Populate features
        document.getElementById('editProductFeatures').value = product.features ? product.features.join('\n') : '';
        
        // Populate specifications
        document.getElementById('editProductSpecifications').value = product.specifications ? 
            JSON.stringify(product.specifications, null, 2) : '';
        
        // Set editing mode
        this.editingProductId = productId;
        
        // Switch to edit tab
        this.showEditTab();
        
        this.showAlert(`Editing: ${product.name}`, 'success');
    }
}

    // NEW VERSION - REPLACE WITH THIS:
cancelEdit() {
    this.editingProductId = null;
    this.resetProductTabs();
    
    // Clear the edit form
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.reset();
    }
}

    formatPrice(price) {
        return new Intl.NumberFormat('en-UG').format(price);
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

    async deployChanges() {
        const token = document.getElementById('githubToken')?.value;
        const repoOwner = document.getElementById('repoOwner')?.value || 'BarasaGodwilTech';
        const repoName = document.getElementById('repoName')?.value || 'willstech-tempolary';
        const branch = document.getElementById('branchName')?.value || 'branch-test';
        
        if (!token) {
            this.showAlert('❌ Please enter your GitHub Personal Access Token in the Settings tab', 'error');
            this.showTab('settings');
            return;
        }
        
        const repo = `${repoOwner}/${repoName}`;
        
        try {
            this.showAlert(`🚀 Starting deployment to ${repo} (${branch})...`, 'success');
            
            const isValid = await this.verifyGitHubAccess(token, repoOwner, repoName, branch);
            if (!isValid) {
                this.showAlert('❌ Cannot access repository. Check token permissions and repository name.', 'error');
                return;
            }

            this.showAlert('✅ Repository access verified!', 'success');
            
            // Update sync timestamp
            this.currentData.lastUpdated = new Date().toISOString();
            
            // Save site configuration
            await this.updateFileOnGitHub(
                'data/site-config.json',
                JSON.stringify(this.currentData, null, 2)
            );
            
            this.showAlert(`🎉 SUCCESS! Deployed to ${repo} on branch: ${branch}`, 'success');
            this.showAlert('🌐 Your changes will be live soon!', 'success');
            
            // Update deployment target display
            this.updateDeploymentTarget();
            
        } catch (error) {
            this.showAlert(`❌ Deployment failed: ${error.message}`, 'error');
        }
    }

    async verifyGitHubAccess(token, repoOwner, repoName, branch) {
        const repo = `${repoOwner}/${repoName}`;
        
        try {
            // Test repository access
            const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!repoResponse.ok) {
                throw new Error(`Repository not found or no access: ${repoResponse.status}`);
            }
            
            // Test branch access
            const branchResponse = await fetch(`https://api.github.com/repos/${repo}/branches/${branch}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!branchResponse.ok) {
                this.showAlert(`⚠️ Branch "${branch}" not found. It will be created on first commit.`, 'success');
            }
            
            return true;
        } catch (error) {
            console.error('GitHub access verification failed:', error);
            return false;
        }
    }

    updateDeploymentTarget() {
        const repoOwner = document.getElementById('repoOwner')?.value || 'BarasaGodwilTech';
        const repoName = document.getElementById('repoName')?.value || 'willstech-tempolary';
        const branch = document.getElementById('branchName')?.value || 'branch-test';
        
        const repo = `${repoOwner}/${repoName}`;
        const targetElement = document.getElementById('deploymentTarget');
        
        if (targetElement) {
            targetElement.innerHTML = `
                <strong>Repository:</strong> ${repo}<br>
                <strong>Branch:</strong> ${branch}<br>
                <strong>URL:</strong> https://github.com/${repo}/tree/${branch}
            `;
        }
    }

    downloadBackup() {
        const dataStr = JSON.stringify(this.currentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `willstech-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showAlert('Backup downloaded successfully!', 'success');
    }

    restoreBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    this.currentData = backupData;
                    this.populateForms();
                    this.loadProducts();
                    this.showAlert('Backup restored successfully!', 'success');
                } catch (error) {
                    this.showAlert('Invalid backup file', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
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
            ${type === 'info' ? 'background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;' : ''}
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
       // ============ NEW METHODS ADD HERE ============

    // Helper method to format stock status
    formatStockStatus(stock) {
        const statusMap = {
            'in-stock': 'In Stock',
            'out-of-stock': 'Out of Stock',
            'pre-order': 'Pre-Order',
            'limited': 'Limited Stock'
        };
        return statusMap[stock] || 'In Stock';
    }

    // Bulk product management methods
    async exportProducts() {
        const productsData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            products: this.currentData.products
        };
        
        const dataStr = JSON.stringify(productsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `willstech-products-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showAlert('Products exported successfully!', 'success');
    }

    async importProducts() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = async event => {
                try {
                    const importData = JSON.parse(event.target.result);
                    
                    if (!importData.products || !Array.isArray(importData.products)) {
                        throw new Error('Invalid import file format');
                    }
                    
                    // Merge imported products with existing ones
                    const existingIds = new Set(this.currentData.products.map(p => p.id));
                    let newProductsCount = 0;
                    let updatedProductsCount = 0;
                    
                    importData.products.forEach(importedProduct => {
                        const existingIndex = this.currentData.products.findIndex(p => p.id === importedProduct.id);
                        
                        if (existingIndex !== -1) {
                            // Update existing product
                            this.currentData.products[existingIndex] = {
                                ...this.currentData.products[existingIndex],
                                ...importedProduct,
                                dateUpdated: new Date().toISOString()
                            };
                            updatedProductsCount++;
                        } else {
                            // Add new product with new ID if ID already exists
                            const newProduct = {
                                ...importedProduct,
                                id: existingIds.has(importedProduct.id) ? Date.now() + Math.random() : importedProduct.id,
                                dateAdded: new Date().toISOString()
                            };
                            this.currentData.products.push(newProduct);
                            existingIds.add(newProduct.id);
                            newProductsCount++;
                        }
                    });
                    
                    // Save to GitHub
                    await this.updateFileOnGitHub(
                        'data/site-config.json',
                        JSON.stringify(this.currentData, null, 2)
                    );
                    
                    this.loadProducts();
                    this.showAlert(`Import successful! ${newProductsCount} new products added, ${updatedProductsCount} products updated.`, 'success');
                    
                } catch (error) {
                    this.showAlert(`Import failed: ${error.message}`, 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    async bulkHideProducts() {
        if (!confirm('Are you sure you want to hide all products?')) {
            return;
        }
        
        this.currentData.products.forEach(product => {
            product.status = 'hidden';
        });
        
        await this.updateFileOnGitHub(
            'data/site-config.json',
            JSON.stringify(this.currentData, null, 2)
        );
        
        this.loadProducts();
        this.showAlert('All products hidden successfully!', 'success');
    }

    async bulkShowProducts() {
        if (!confirm('Are you sure you want to show all products?')) {
            return;
        }
        
        this.currentData.products.forEach(product => {
            product.status = 'active';
        });
        
        await this.updateFileOnGitHub(
            'data/site-config.json',
            JSON.stringify(this.currentData, null, 2)
        );
        
        this.loadProducts();
        this.showAlert('All products shown successfully!', 'success');
    }

} // <-- This is the closing brace of the WillTechAdmin class


// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, creating admin instance...');
    window.admin = new WillTechAdmin();
    window.admin.init();
});