// Admin Panel JavaScript - Will's Tech Store
class WillTechAdmin {
    constructor() {
        this.currentData = {};
        this.init();
    }

    init() {
        // Check authentication first
        if (!localStorage.getItem('willstech_admin_auth')) {
            window.location.href = 'admin-login.html';
            return;
        }

        this.loadData();
        this.setupEventListeners();
        this.setupNavigation();
        this.loadProducts();
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('heroForm')?.addEventListener('submit', (e) => this.handleHeroForm(e));
        document.getElementById('productForm')?.addEventListener('submit', (e) => this.handleProductForm(e));
        document.getElementById('contentForm')?.addEventListener('submit', (e) => this.handleContentForm(e));
        document.getElementById('socialForm')?.addEventListener('submit', (e) => this.handleSocialForm(e));
        
        // Deployment
        document.getElementById('deployBtn')?.addEventListener('click', () => this.deployChanges());
        document.getElementById('backupBtn')?.addEventListener('click', () => this.downloadBackup());
        document.getElementById('restoreBtn')?.addEventListener('click', () => this.restoreBackup());
        
        // Logout
        document.getElementById('logout')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Product tabs
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchProductTab(tabName);
            });
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showTab(target);
                
                // Update active states
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
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
        // Try to load existing data from localStorage
        const savedData = localStorage.getItem('willstech_data');
        if (savedData) {
            this.currentData = JSON.parse(savedData);
        } else {
            // Initialize with default data
            this.currentData = this.getDefaultData();
            this.saveData();
        }
        
        this.populateForms();
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

    async deployChanges() {
        const token = prompt('🔒 Enter your GitHub Personal Access Token:\n\n(This token is used once and not stored. Make sure it has "repo" permissions.)');
        
        if (!token) {
            this.showAlert('Deployment cancelled. Token is required.', 'error');
            return;
        }

        this.showAlert('Verifying GitHub token...', 'success');

        try {
            const isValid = await this.verifyGitHubToken(token);
            if (!isValid) {
                this.showAlert('❌ Invalid GitHub token. Please check:\n• Token has "repo" permissions\n• Token is not expired\n• Repository access is granted', 'error');
                return;
            }

            this.showAlert('✅ Token verified! Generating updated files...', 'success');

            const repo = 'BarasaGodwilTech/willstech-tempolary';
            const branch = 'main';
            
            const updatedFiles = await this.generateUpdatedFiles();
            this.showAlert('📁 Files generated! Committing to GitHub...', 'success');
            
            await this.commitToGitHub(token, repo, branch, updatedFiles);
            
            this.showAlert('🎉 Changes deployed successfully! Your live website will update within 2-5 minutes.', 'success');
            
        } catch (error) {
            console.error('Deployment error:', error);
            this.showAlert(`❌ Deployment failed: ${error.message}`, 'error');
        }
    }

    async verifyGitHubToken(token) {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async generateUpdatedFiles() {
        // Generate updated HTML and data files
        const files = {
            'index.html': this.generateUpdatedIndexHTML(),
            'data/products.json': JSON.stringify(this.currentData.products, null, 2),
            'data/site-config.json': JSON.stringify({
                hero: this.currentData.hero,
                content: this.currentData.content,
                social: this.currentData.social
            }, null, 2)
        };

        return files;
    }

    generateUpdatedIndexHTML() {
        // This would be your full updated HTML file
        // For now, we'll create a simple version
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.currentData.content.storeName} | Premium Tech Store</title>
    <meta name="description" content="${this.currentData.content.description}">
</head>
<body>
    <header>
        <h1>${this.currentData.content.storeName}</h1>
        <p>${this.currentData.content.tagline}</p>
    </header>
    
    <section class="hero">
        <h2>${this.currentData.hero.title}</h2>
        <p>${this.currentData.hero.description}</p>
        <a href="${this.currentData.hero.whatsappLink}" class="btn">Join WhatsApp Channel</a>
    </section>
    
    <!-- Note: This is a simplified version. Your actual index.html would be more complex -->
</body>
</html>`;
    }

    async commitToGitHub(token, repo, branch, files) {
        try {
            // Get the latest commit SHA
            const refResponse = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!refResponse.ok) {
                throw new Error(`Cannot access repository: ${refResponse.statusText}`);
            }

            const refData = await refResponse.json();
            const latestCommitSha = refData.object.sha;

            // Get the current tree
            const commitResponse = await fetch(`https://api.github.com/repos/${repo}/git/commits/${latestCommitSha}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            const commitData = await commitResponse.json();
            const baseTreeSha = commitData.tree.sha;

            // Create blobs for each file
            const tree = [];
            for (const [path, content] of Object.entries(files)) {
                const blobResponse = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: btoa(unescape(encodeURIComponent(content))),
                        encoding: 'base64'
                    })
                });

                if (!blobResponse.ok) {
                    throw new Error(`Failed to create blob for ${path}`);
                }

                const blobData = await blobResponse.json();
                tree.push({
                    path: path,
                    mode: '100644',
                    type: 'blob',
                    sha: blobData.sha
                });
            }

            // Create new tree
            const treeResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    base_tree: baseTreeSha,
                    tree: tree
                })
            });

            if (!treeResponse.ok) {
                throw new Error('Tree creation failed');
            }

            const treeData = await treeResponse.json();

            // Create new commit
            const commitResponse2 = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Admin Panel Update - ${new Date().toLocaleString()}`,
                    tree: treeData.sha,
                    parents: [latestCommitSha]
                })
            });

            if (!commitResponse2.ok) {
                throw new Error('Commit creation failed');
            }

            const commitData2 = await commitResponse2.json();

            // Update reference
            const updateResponse = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sha: commitData2.sha,
                    force: false
                })
            });

            if (!updateResponse.ok) {
                throw new Error('Reference update failed');
            }

            return true;
        } catch (error) {
            console.error('GitHub commit error:', error);
            throw error;
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
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new WillTechAdmin();
});