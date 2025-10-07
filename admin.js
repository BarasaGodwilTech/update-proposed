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
            
            // Fallback: Extract data from index.html and other files
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
        // Load current index.html to extract data
        const response = await fetch('index.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract hero section
        const heroTitle = doc.querySelector('h1')?.textContent || '';
        const heroDescription = doc.querySelector('.hero p')?.textContent || '';
        const whatsappButton = doc.querySelector('a.btn[href*="wa.me"]');
        const whatsappLink = whatsappButton ? whatsappButton.getAttribute('href') : '';
        
        // Extract content
        const storeName = doc.querySelector('title')?.textContent || "Will's Tech Store";
        const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        
        // Extract social links
        const socialLinks = this.extractSocialLinks(doc);
        
        // Try to load products from script.js or existing data
        const products = await this.extractProductsData();
        
        this.currentData = {
            hero: {
                title: heroTitle,
                description: heroDescription,
                whatsappLink: whatsappLink
            },
            products: products,
            content: {
                storeName: storeName,
                tagline: doc.querySelector('.tagline')?.textContent || '',
                description: metaDescription,
                contactInfo: this.extractContactInfo(doc)
            },
            social: socialLinks,
            lastSynced: new Date().toISOString()
        };
        
        console.log('Data extracted from current site:', this.currentData);
    }

    async extractProductsData() {
        // Try to load products from existing data file
        const productsData = await this.fetchFileFromGitHub('data/products.json');
        if (productsData) {
            return productsData;
        }
        
        // Fallback: extract from current HTML or return empty array
        return [];
    }

    extractSocialLinks(doc) {
        const socialLinks = {
            facebook: '#',
            instagram: '#',
            twitter: '#',
            tiktok: '#',
            youtube: '#'
        };
        
        const links = doc.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="tiktok"], a[href*="youtube"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('facebook')) socialLinks.facebook = href;
            if (href.includes('instagram')) socialLinks.instagram = href;
            if (href.includes('twitter') || href.includes('x.com')) socialLinks.twitter = href;
            if (href.includes('tiktok')) socialLinks.tiktok = href;
            if (href.includes('youtube')) socialLinks.youtube = href;
        });
        
        return socialLinks;
    }

    extractContactInfo(doc) {
        // Extract from contact section or meta tags
        return "WhatsApp: +256 751 924 844\nEmail: wills.tech.store.ug@gmail.com\nLocations: Kampala & Mbale, Uganda";
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Form submissions - now with immediate GitHub sync
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
        
        const newProduct = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            image: document.getElementById('productImage').value,
            featured: true
        };
        
        if (!this.currentData.products) {
            this.currentData.products = [];
        }
        
        this.currentData.products.push(newProduct);
        await this.saveToGitHub();
        this.loadProducts();
        
        e.target.reset();
        this.showAlert('Product added successfully!', 'success');
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
            
            // Also save products separately if needed
            if (this.currentData.products) {
                await this.updateFileOnGitHub(
                    'data/products.json',
                    JSON.stringify(this.currentData.products, null, 2)
                );
            }
            
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
        
        this.currentData.products.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });

        const productsCountElement = document.getElementById('productsCount');
        if (productsCountElement) {
            productsCountElement.textContent = this.currentData.products.length;
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <i class="fas fa-box" style="font-size: 3rem; color: #ccc;"></i>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>UGX ${this.formatPrice(product.price)}</strong></p>
            <p><small>Category: ${product.category}</small></p>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="admin.editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="admin.deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        return card;
    }

    async editProduct(productId) {
        const product = this.currentData.products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image;
            
            await this.deleteProduct(productId, false);
            this.switchProductTab('add-product');
        }
    }

    async deleteProduct(productId, showAlert = true) {
        this.currentData.products = this.currentData.products.filter(p => p.id !== productId);
        const success = await this.saveToGitHub();
        
        if (success) {
            this.loadProducts();
            if (showAlert) {
                this.showAlert('Product deleted successfully!', 'success');
            }
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