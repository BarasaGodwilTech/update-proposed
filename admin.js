// Admin Panel JavaScript - Will's Tech Store
class WillTechAdmin {
    constructor() {
        this.currentData = {};
    }

    init() {
        console.log('Admin panel initializing...');
        
        // Check authentication first
        if (!localStorage.getItem('willstech_admin_auth')) {
            console.log('Not authenticated, redirecting to login...');
            window.location.href = 'admin-login.html';
            return;
        }

        console.log('Authentication passed, loading data...');
        this.loadData();
        this.setupEventListeners();
        this.setupNavigation();
        this.loadProducts();
        
        console.log('Admin panel fully initialized');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Form submissions
        const heroForm = document.getElementById('heroForm');
        const productForm = document.getElementById('productForm');
        const contentForm = document.getElementById('contentForm');
        const socialForm = document.getElementById('socialForm');
        
        if (heroForm) {
            heroForm.addEventListener('submit', (e) => this.handleHeroForm(e));
            console.log('Hero form listener added');
        }
        
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductForm(e));
            console.log('Product form listener added');
        }
        
        if (contentForm) {
            contentForm.addEventListener('submit', (e) => this.handleContentForm(e));
            console.log('Content form listener added');
        }
        
        if (socialForm) {
            socialForm.addEventListener('submit', (e) => this.handleSocialForm(e));
            console.log('Social form listener added');
        }
        
        // Deployment
        const deployBtn = document.getElementById('deployBtn');
        const backupBtn = document.getElementById('backupBtn');
        const restoreBtn = document.getElementById('restoreBtn');
        
        if (deployBtn) {
            deployBtn.addEventListener('click', () => this.deployChanges());
            console.log('Deploy button listener added');
        }
        
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.downloadBackup());
        }
        
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
            console.log('Logout button listener added');
        }

        // Product tabs
        const productTabs = document.querySelectorAll('[data-tab]');
        productTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchProductTab(tabName);
            });
        });
        console.log('Product tab listeners added');
    }

    setupNavigation() {
        console.log('Setting up navigation...');
        
        const navLinks = document.querySelectorAll('.nav-links a');
        console.log('Found nav links:', navLinks.length);
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target && target.startsWith('#')) {
                    const tabName = target.substring(1);
                    console.log('Navigation clicked:', tabName);
                    this.showTab(tabName);
                    
                    // Update active states
                    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Activate first tab by default
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
    }

    showTab(tabName) {
        console.log('Showing tab:', tabName);
        
        // Hide all tabs
        const allTabs = document.querySelectorAll('.tab-content');
        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Tab activated:', tabName);
        } else {
            console.error('Tab not found:', tabName);
        }
    }

    switchProductTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('#products .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    loadData() {
        console.log('Loading data from localStorage...');
        
        // Try to load existing data from localStorage
        try {
            const savedData = localStorage.getItem('willstech_data');
            if (savedData) {
                this.currentData = JSON.parse(savedData);
                console.log('Data loaded successfully');
            } else {
                // Initialize with default data
                console.log('No saved data, using defaults');
                this.currentData = this.getDefaultData();
                this.saveData();
            }
            
            this.populateForms();
        } catch (error) {
            console.error('Error loading data:', error);
            this.currentData = this.getDefaultData();
            this.saveData();
        }
    }

    getDefaultData() {
        return {
            hero: {
                title: "Your Ultimate Online Tech Store Is Coming Soon!",
                description: "We're working hard to bring you the ultimate tech shopping experience, delivering authentic and top-notch technologies and innovation to your doorstep without lifting a foot. Uganda, are you ready? Join our WhatsApp channel for exclusive early-bird deals!",
                whatsappLink: "https://wa.me/256751924844?text=Hi%20Will's%20Tech!%20I%20want%20to%20join%20your%20channel.%20Thanks."
            },
            products: [
                {
                    id: 1,
                    name: "iPhone 15 Pro",
                    category: "smartphones",
                    description: "Latest Apple flagship with titanium design and A17 Pro chip",
                    price: "4500000",
                    image: "public/iphone-15-pro.png",
                    featured: true
                },
                {
                    id: 2,
                    name: "MacBook Pro M3",
                    category: "laptops",
                    description: "Professional laptop with M3 chip for demanding workflows",
                    price: "8500000",
                    image: "public/macbook-pro-m3-laptop.jpg",
                    featured: true
                }
            ],
            content: {
                storeName: "Will's Tech Store",
                tagline: "Elevate Your Lifestyle With Authentic Tech",
                description: "Uganda's trusted tech store for 100% authentic smartphones, laptops & gadgets. Elevate Your Lifestyle With Authentic Tech. Free delivery around Kampala and Mbale. WhatsApp: +256 751 924 844",
                contactInfo: "WhatsApp: +256 751 924 844\nEmail: wills.tech.store.ug@gmail.com\nLocations: Kampala & Mbale, Uganda\nBusiness Hours: Mon-Sat 8:00 AM - 8:00 PM, Sun 10:00 AM - 6:00 PM"
            },
            social: {
                facebook: "#",
                instagram: "https://instagram.com/willstech.store",
                twitter: "https://x.com/willstech_store",
                tiktok: "http://www.tiktok.com/@willstech.store",
                youtube: "https://www.youtube.com/@Willstech.storeug"
            }
        };
    }

    populateForms() {
        // Populate hero form
        if (document.getElementById('heroTitle')) {
            document.getElementById('heroTitle').value = this.currentData.hero.title;
            document.getElementById('heroDescription').value = this.currentData.hero.description;
            document.getElementById('whatsappLink').value = this.currentData.hero.whatsappLink;
        }

        // Populate content form
        if (document.getElementById('storeName')) {
            document.getElementById('storeName').value = this.currentData.content.storeName;
            document.getElementById('storeTagline').value = this.currentData.content.tagline;
            document.getElementById('storeDescription').value = this.currentData.content.description;
            document.getElementById('contactInfo').value = this.currentData.content.contactInfo;
        }

        // Populate social form
        if (document.getElementById('facebookLink')) {
            document.getElementById('facebookLink').value = this.currentData.social.facebook;
            document.getElementById('instagramLink').value = this.currentData.social.instagram;
            document.getElementById('twitterLink').value = this.currentData.social.twitter;
            document.getElementById('tiktokLink').value = this.currentData.social.tiktok;
            document.getElementById('youtubeLink').value = this.currentData.social.youtube;
        }
    }

    handleHeroForm(e) {
        e.preventDefault();
        
        this.currentData.hero = {
            title: document.getElementById('heroTitle').value,
            description: document.getElementById('heroDescription').value,
            whatsappLink: document.getElementById('whatsappLink').value
        };
        
        this.saveData();
        this.showAlert('Hero section updated successfully!', 'success');
    }

    handleProductForm(e) {
        e.preventDefault();
        
        const newProduct = {
            id: Date.now(), // Simple ID generation
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            image: document.getElementById('productImage').value,
            featured: true
        };
        
        this.currentData.products.push(newProduct);
        this.saveData();
        this.loadProducts();
        
        // Reset form
        e.target.reset();
        this.showAlert('Product added successfully!', 'success');
    }

    handleContentForm(e) {
        e.preventDefault();
        
        this.currentData.content = {
            storeName: document.getElementById('storeName').value,
            tagline: document.getElementById('storeTagline').value,
            description: document.getElementById('storeDescription').value,
            contactInfo: document.getElementById('contactInfo').value
        };
        
        this.saveData();
        this.showAlert('Content updated successfully!', 'success');
    }

    handleSocialForm(e) {
        e.preventDefault();
        
        this.currentData.social = {
            facebook: document.getElementById('facebookLink').value,
            instagram: document.getElementById('instagramLink').value,
            twitter: document.getElementById('twitterLink').value,
            tiktok: document.getElementById('tiktokLink').value,
            youtube: document.getElementById('youtubeLink').value
        };
        
        this.saveData();
        this.showAlert('Social links updated successfully!', 'success');
    }

    loadProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        container.innerHTML = '';
        
        this.currentData.products.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });

        // Update products count
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

    editProduct(productId) {
        const product = this.currentData.products.find(p => p.id === productId);
        if (product) {
            // Populate form and switch to add product tab
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image;
            
            // Remove the product (will be re-added on save)
            this.deleteProduct(productId, false);
            this.switchProductTab('add-product');
        }
    }

    deleteProduct(productId, showAlert = true) {
        this.currentData.products = this.currentData.products.filter(p => p.id !== productId);
        this.saveData();
        this.loadProducts();
        
        if (showAlert) {
            this.showAlert('Product deleted successfully!', 'success');
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-UG').format(price);
    }

    saveData() {
        localStorage.setItem('willstech_data', JSON.stringify(this.currentData));
    }

    async verifyGitHubToken(token) {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            console.log('✅ GitHub token verified for user:', userData.login);
            return true;
        } else {
            console.error('❌ GitHub token verification failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Error verifying GitHub token:', error);
        return false;
    }
}

   async deployChanges() {
    const token = prompt('🔒 Enter your GitHub token to update ACTUAL website files:');
    
    if (!token) {
        this.showAlert('Deployment cancelled.', 'error');
        return;
    }

    try {
        this.showAlert('🚀 Starting FULL website deployment...', 'success');
        
        // Verify token first
        const isValid = await this.verifyGitHubToken(token);
        if (!isValid) {
            this.showAlert('❌ Invalid GitHub token', 'error');
            return;
        }

        this.showAlert('✅ Token verified! Generating files...', 'success');
        
        // Generate all updated files
        const files = await this.generateUpdatedFiles();
        
        // Deploy each file
        const fileEntries = Object.entries(files);
        for (let i = 0; i < fileEntries.length; i++) {
            const [filePath, content] = fileEntries[i];
            this.showAlert(`📁 Updating: ${filePath} (${i + 1}/${fileEntries.length})`, 'success');
            await this.updateFileOnGitHub(token, filePath, content);
        }
        
        this.showAlert('🎉 SUCCESS! Entire website updated!', 'success');
        this.showAlert('🌐 Your live site will refresh within 2-5 minutes', 'success');
        this.showAlert('📊 Changes include: Hero section, Meta tags, Social links, Products', 'success');
        
    } catch (error) {
        this.showAlert(`❌ Deployment failed: ${error.message}`, 'error');
    }
}

    async generateUpdatedFiles() {
    this.showAlert('📄 Generating updated website files...', 'success');
    
    try {
        // Get current index.html to use as template
        const currentHTML = await this.fetchCurrentFile('index.html');
        
        // Generate updated HTML with new content
        const updatedHTML = this.updateHTMLContent(currentHTML);
        
        // Get current CSS
        const currentCSS = await this.fetchCurrentFile('styles.css');
        
        // Get current JS
        const currentJS = await this.fetchCurrentFile('script.js');
        
        const files = {
            'index.html': updatedHTML,
            'styles.css': currentCSS,
            'script.js': currentJS,
            'data/site-config.json': JSON.stringify({
                hero: this.currentData.hero,
                content: this.currentData.content,
                social: this.currentData.social,
                products: this.currentData.products,
                lastUpdated: new Date().toISOString()
            }, null, 2),
            'data/products.json': JSON.stringify(this.currentData.products, null, 2)
        };

        this.showAlert('✅ Generated: index.html, styles.css, script.js + data files', 'success');
        return files;
        
    } catch (error) {
        this.showAlert('⚠️ Using fallback template', 'error');
        // Fallback to data-only deployment
        return {
            'data/site-config.json': JSON.stringify(this.currentData, null, 2)
        };
    }
}

async fetchCurrentFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error('File not found');
        return await response.text();
    } catch (error) {
        throw new Error(`Cannot fetch ${filename}`);
    }
}

updateHTMLContent(html) {
    let updatedHTML = html;
    
    // Update meta tags
    updatedHTML = updatedHTML.replace(
        /<title>.*?<\/title>/,
        `<title>${this.currentData.content.storeName} | Premium Gadgets & Tech in Uganda, Kampala | Mbale</title>`
    );
    
    updatedHTML = updatedHTML.replace(
        /<meta name="description" content=".*?"\/>/,
        `<meta name="description" content="${this.currentData.content.description}"\/>`
    );
    
    // Update hero section
    updatedHTML = this.updateHeroSection(updatedHTML);
    
    // Update social links
    updatedHTML = this.updateSocialLinks(updatedHTML);
    
    // Update WhatsApp links
    updatedHTML = this.updateWhatsAppLinks(updatedHTML);
    
    return updatedHTML;
}

updateHeroSection(html) {
    const newHeroContent = `
                <h1>${this.escapeHTML(this.currentData.hero.title)}</h1>
                <p>${this.escapeHTML(this.currentData.hero.description)}</p>
                <div class="hero-buttons">
                    <a href="${this.currentData.hero.whatsappLink}" class="btn btn-primary" rel="noopener noreferrer">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i> Join WhatsApp Channel
                    </a>
                    <a href="#notify" class="btn btn-outline">Notify Me at Launch</a>
                </div>`;
    
    // Find and replace hero content
    return html.replace(
        /<h1>[\s\S]*?<\/h1>\s*<p>[\s\S]*?<\/p>\s*<div class="hero-buttons">[\s\S]*?<\/div>/,
        newHeroContent
    );
}

updateSocialLinks(html) {
    let updatedHTML = html;
    
    // Update Instagram
    if (this.currentData.social.instagram) {
        updatedHTML = updatedHTML.replace(
            /https:\/\/instagram\.com\/willstech\.store/g,
            this.currentData.social.instagram
        );
    }
    
    // Update Twitter/X
    if (this.currentData.social.twitter) {
        updatedHTML = updatedHTML.replace(
            /https:\/\/x\.com\/willstech_store/g,
            this.currentData.social.twitter
        );
    }
    
    // Update TikTok
    if (this.currentData.social.tiktok) {
        updatedHTML = updatedHTML.replace(
            /http:\/\/www\.tiktok\.com\/@willstech\.store/g,
            this.currentData.social.tiktok
        );
    }
    
    // Update YouTube
    if (this.currentData.social.youtube) {
        updatedHTML = updatedHTML.replace(
            /https:\/\/www\.youtube\.com\/@Willstech\.storeug/g,
            this.currentData.social.youtube
        );
    }
    
    return updatedHTML;
}

updateWhatsAppLinks(html) {
    let updatedHTML = html;
    
    // Update all WhatsApp links
    const currentWhatsApp = 'https://wa.me/256751924844';
    if (this.currentData.hero.whatsappLink) {
        updatedHTML = updatedHTML.replace(
            new RegExp(currentWhatsApp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            this.currentData.hero.whatsappLink
        );
    }
    
    return updatedHTML;
}

escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

    async updateFileOnGitHub(token, filePath, content) {
        const repo = 'BarasaGodwilTech/update-proposed';
        const branch = 'main';

        // First, check if file exists to get its SHA
        let existingSha = null;
        try {
            const getResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (getResponse.ok) {
                const fileData = await getResponse.json();
                existingSha = fileData.sha;
            }
        } catch (error) {
            // File doesn't exist, we'll create it
        }

        // Create or update the file
        const putResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `🔄 Will's Tech Update - ${filePath} - ${new Date().toLocaleString('en-UG')}`,
                content: btoa(unescape(encodeURIComponent(content))),
                branch: branch,
                sha: existingSha
            })
        });

        if (!putResponse.ok) {
            const errorText = await putResponse.text();
            throw new Error(`Failed to update ${filePath}: ${putResponse.status}`);
        }

        return await putResponse.json();
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
                    this.saveData();
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
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
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
        
        // Add to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(alert, mainContent.firstChild);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    logout() {
        localStorage.removeItem('willstech_admin_auth');
        localStorage.removeItem('willstech_data');
        window.location.href = 'admin-login.html';
    }

    // Temporary debug function
    testAdmin() {
        console.log('=== ADMIN PANEL DEBUG INFO ===');
        console.log('Authentication:', localStorage.getItem('willstech_admin_auth'));
        console.log('Nav links found:', document.querySelectorAll('.nav-links a').length);
        console.log('Forms found:', document.querySelectorAll('form').length);
        console.log('Current data:', this.currentData);
        console.log('=== END DEBUG INFO ===');
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, creating admin instance...');
    window.admin = new WillTechAdmin();
    window.admin.init();
});