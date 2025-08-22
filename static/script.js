class TherapistSearch {
    constructor() {
        // Use production backend API (CORS works when both are deployed)
        this.apiBaseUrl = 'https://therapistsearch-production.up.railway.app';
        this.initializeElements();
        this.attachEventListeners();
        this.loadExampleQuery();
        this.loadStats();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loading = document.getElementById('loading');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.resultsStats = document.getElementById('resultsStats');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.noResults = document.getElementById('noResults');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        
        // Stats elements
        this.statsDisplay = document.getElementById('statsDisplay');
        this.totalProfiles = document.getElementById('totalProfiles');
        
        // Filters
        this.maxFeeSelect = document.getElementById('maxFee');
        this.stateSelect = document.getElementById('state');
        this.languageSelect = document.getElementById('language');
        this.providerTypeSelect = document.getElementById('providerType');
        this.telehealthCheckbox = document.getElementById('telehealthOnly');
    }

    attachEventListeners() {
        // Search functionality
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Quick search buttons
        document.querySelectorAll('.quick-search').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.target.getAttribute('data-query');
                this.searchInput.value = query;
                this.performSearch();
            });
        });

        // Filter changes
        [this.maxFeeSelect, this.stateSelect, this.languageSelect, this.providerTypeSelect, this.telehealthCheckbox].forEach(element => {
            element.addEventListener('change', () => {
                if (this.searchInput.value.trim()) {
                    this.performSearch();
                }
            });
        });
    }

    loadExampleQuery() {
        this.searchInput.value = "spanish speaking therapist for anxiety and college stress";
        this.searchInput.focus();
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            
            if (response.ok) {
                const data = await response.json();
                this.totalProfiles.textContent = data.total_profiles.toLocaleString();
                this.statsDisplay.style.display = 'block';
            } else {
                // Silently fail - don't show stats if unavailable
                console.warn('Failed to load stats:', response.status);
            }
        } catch (error) {
            // Silently fail - don't show stats if unavailable  
            console.warn('Failed to load stats:', error);
        }
    }

    buildSearchPayload(query) {
        // Build payload to match your production API format
        const payload = {
            query: query,
            max_results: 3
        };

        // Add filters if specified
        if (this.maxFeeSelect.value) {
            payload.max_fee = parseFloat(this.maxFeeSelect.value);
        }

        if (this.stateSelect.value) {
            payload.state = this.stateSelect.value;
        }

        if (this.languageSelect.value) {
            payload.languages = [this.languageSelect.value];
        }

        if (this.providerTypeSelect.value) {
            payload.provider_type = this.providerTypeSelect.value;
        }

        return payload;
    }

    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            this.showError('Please enter a search query');
            return;
        }

        this.showLoading();

        const searchPayload = this.buildSearchPayload(query);

        try {
            console.log('🔍 Searching with payload:', searchPayload);
            console.log('🌐 API URL:', this.apiBaseUrl);
            console.log('🔗 Full URL:', `${this.apiBaseUrl}/search`);

            const response = await fetch(`${this.apiBaseUrl}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchPayload)
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Search failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Search results:', data);
            
            // Debug: Check if ranking_explanation exists in results
            if (data.results && data.results.length > 0) {
                console.log('🔍 Sample therapist data:', data.results[0]);
                console.log('🔍 Ranking explanation:', data.results[0].ranking_explanation);
            }
            
            this.displayResults(data);

        } catch (error) {
            console.error('❌ Search error:', error);
            console.error('❌ Error stack:', error.stack);
            this.showError(`Search failed: ${error.message}. Please check browser console for details.`);
        }
    }

    showLoading() {
        this.hideAllSections();
        this.loading.style.display = 'block';
        this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        this.searchBtn.disabled = true;
    }

    hideAllSections() {
        this.loading.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.noResults.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    displayResults(data) {
        this.hideAllSections();
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
        this.searchBtn.disabled = false;

        if (!data.results || data.results.length === 0) {
            this.noResults.style.display = 'block';
            return;
        }

        this.resultsSection.style.display = 'block';
        this.resultsTitle.textContent = `Search Results for "${data.query}"`;
        this.resultsStats.textContent = `Found ${data.total_found} providers`;

        this.resultsGrid.innerHTML = data.results.map(therapist => this.createTherapistCard(therapist)).join('');
    }

    createTherapistCard(therapist) {
        // Safely handle arrays and potential null values
        const languages = Array.isArray(therapist.languages) ? therapist.languages.join(', ') : (therapist.languages || 'English');
        const specialties = Array.isArray(therapist.specialties) ? 
            therapist.specialties.slice(0, 5).map(s => `<span class="specialty-tag">${s}</span>`).join('') : 
            '';

        const fee = therapist.fee_individual ? `$${therapist.fee_individual}` : 'Contact for pricing';
        const similarity = (therapist.similarity_score * 100).toFixed(1);
        
        // Handle description preview
        const description = therapist.description_preview || 'Professional therapist committed to helping clients achieve their mental health goals.';
        const truncatedDescription = description.length > 150 ? 
            description.substring(0, 150) + '...' : 
            description;

        // Determine telehealth availability (your API might use different field names)
        const telehealthAvailable = therapist.telehealth_available || 
                                   (therapist.glance_appointments && therapist.glance_appointments.includes('online')) ||
                                   false;

        // Provider type badge
        const providerTypeInfo = {
            'therapist': { label: 'Licensed Therapist', icon: 'fas fa-user-md', class: 'provider-therapist' },
            'life_coach': { label: 'Life Coach', icon: 'fas fa-lightbulb', class: 'provider-coach' },
            'nutrition_coach': { label: 'Nutrition Coach', icon: 'fas fa-apple-alt', class: 'provider-nutrition' }
        };
        const providerInfo = providerTypeInfo[therapist.provider_type] || providerTypeInfo['therapist'];
        
        return `
            <div class="therapist-card">
                <div class="therapist-header">
                    <div class="therapist-info">
                        <h3>${therapist.name || 'Professional Therapist'}</h3>
                        <div class="title">${therapist.job_title || 'Licensed Therapist'}</div>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${therapist.city || ''}, ${therapist.state || ''}
                        </div>
                    </div>
                    <div class="similarity-score">
                        ${similarity}% match
                    </div>
                </div>

                <div class="therapist-details">
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${fee}/session</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-globe"></i>
                        <span>${languages}</span>
                    </div>
                    ${telehealthAvailable ? 
                        '<div class="detail-item"><i class="fas fa-video"></i><span>Telehealth Available</span></div>' : 
                        '<div class="detail-item"><i class="fas fa-building"></i><span>In-Person Available</span></div>'
                    }
                </div>

                ${specialties ? `
                    <div class="specialties">
                        <strong><i class="fas fa-stethoscope"></i> Specialties:</strong>
                        <div class="specialties-list">
                            ${specialties}
                        </div>
                    </div>
                ` : ''}

                <div class="description">
                    ${truncatedDescription}
                </div>

                ${therapist.ranking_explanation ? `
                    <div class="ranking-explanation">
                        <i class="fas fa-lightbulb"></i>
                        <strong>Why this match:</strong> ${therapist.ranking_explanation}
                    </div>
                ` : `
                    <div class="ranking-explanation">
                        <i class="fas fa-lightbulb"></i>
                        <strong>Why this match:</strong> High similarity score (${similarity}%) based on specialties and location match.
                    </div>
                `}

                <div class="therapist-actions">
                    <a href="${therapist.profile_url || '#'}" target="_blank" class="view-profile">
                        <i class="fas fa-external-link-alt"></i>
                        View Full Profile
                    </a>
                    <span class="provider-badge ${providerInfo.class}">
                        <i class="${providerInfo.icon}"></i>
                        ${providerInfo.label}
                    </span>
                    ${telehealthAvailable ? '<span class="telehealth-badge">Online Available</span>' : ''}
                </div>
            </div>
        `;
    }

    showError(message) {
        this.hideAllSections();
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
        this.searchBtn.disabled = false;
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'block';
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TherapistSearch();
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add typing animation to placeholder
    const searchInput = document.getElementById('searchInput');
    const placeholders = [
        "spanish speaking therapist for anxiety and college stress",
        "couples counselor with evening hours", 
        "child psychologist for ADHD therapy",
        "trauma therapist accepting insurance",
        "online therapy for depression"
    ];
    
    let currentPlaceholder = 0;
    
    function updatePlaceholder() {
        searchInput.placeholder = placeholders[currentPlaceholder];
        currentPlaceholder = (currentPlaceholder + 1) % placeholders.length;
    }
    
    // Update placeholder every 4 seconds when input is empty
    setInterval(() => {
        if (!searchInput.value && document.activeElement !== searchInput) {
            updatePlaceholder();
        }
    }, 4000);
});