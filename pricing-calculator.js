// Pricing Calculator JavaScript

const pricing = {
    monthly: 12.99,
    yearly: 5.99,
    '2year': 3.99
};

const addons = {
    dedicatedIP: 4.99,
    passwordManager: 2.99,
    cloudBackup: 3.99
};

document.addEventListener('DOMContentLoaded', function() {
    try {
        initCalculator();
    } catch (error) {
        console.error('Pricing calculator initialization error:', error);
    }
});

function initCalculator() {
    const deviceSlider = document.getElementById('deviceSlider');
    const deviceValue = document.getElementById('deviceValue');
    const billingOptions = document.querySelectorAll('input[name="billing"]');
    const addonCheckboxes = document.querySelectorAll('.addon-item input[type="checkbox"]');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    // Device slider
    if (deviceSlider) {
        deviceSlider.addEventListener('input', () => {
            deviceValue.textContent = `${deviceSlider.value} device${deviceSlider.value > 1 ? 's' : ''}`;
            document.getElementById('deviceCount').textContent = `${deviceSlider.value} device connections`;
            calculatePrice();
        });
    }
    
    // Billing options
    billingOptions.forEach(option => {
        option.addEventListener('change', calculatePrice);
    });
    
    // Add-ons
    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });
    
    // Get Started button
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            const selectedPlan = document.querySelector('input[name="billing"]:checked').value;
            const devices = deviceSlider ? deviceSlider.value : 3;
            
            // Save selection
            localStorage.setItem('selectedPlan', JSON.stringify({
                billing: selectedPlan,
                devices: devices,
                addons: getSelectedAddons()
            }));
            
            window.location.href = 'register.html';
        });
    }
    
    // Initial calculation
    calculatePrice();
}

function calculatePrice() {
    const billingPeriod = document.querySelector('input[name="billing"]:checked').value;
    const basePrice = pricing[billingPeriod];
    
    let addonTotal = 0;
    const selectedAddons = [];
    
    // Calculate add-ons
    document.querySelectorAll('.addon-item input[type="checkbox"]:checked').forEach(checkbox => {
        const addonId = checkbox.id;
        const addonPrice = addons[addonId];
        addonTotal += addonPrice;
        
        const addonName = checkbox.closest('.addon-item').querySelector('.addon-name').textContent;
        selectedAddons.push({ name: addonName, price: addonPrice });
    });
    
    const monthlyTotal = basePrice + addonTotal;
    
    // Update display
    updatePriceDisplay(basePrice, addonTotal, monthlyTotal, billingPeriod, selectedAddons);
}

function updatePriceDisplay(basePrice, addonTotal, monthlyTotal, billingPeriod, selectedAddons) {
    const basePriceEl = document.getElementById('basePrice');
    const addonItemsEl = document.getElementById('addonItems');
    const totalPriceEl = document.getElementById('totalPrice');
    const savingsBadge = document.getElementById('savingsBadge');
    const savingsAmount = document.getElementById('savingsAmount');
    
    // Update base price
    if (basePriceEl) {
        basePriceEl.textContent = `$${basePrice.toFixed(2)}/mo`;
    }
    
    // Update add-ons
    if (addonItemsEl) {
        addonItemsEl.innerHTML = selectedAddons.map(addon => `
            <div class="summary-item">
                <span>${addon.name}</span>
                <span>+$${addon.price.toFixed(2)}/mo</span>
            </div>
        `).join('');
    }
    
    // Calculate total based on billing period
    let totalText = `$${monthlyTotal.toFixed(2)}/mo`;
    let savings = 0;
    
    if (billingPeriod === 'yearly') {
        const yearlyTotal = monthlyTotal * 12;
        totalText = `$${yearlyTotal.toFixed(2)}/year ($${monthlyTotal.toFixed(2)}/mo)`;
        savings = (12.99 - basePrice) * 12;
    } else if (billingPeriod === '2year') {
        const twoYearTotal = monthlyTotal * 24;
        totalText = `$${twoYearTotal.toFixed(2)}/2 years ($${monthlyTotal.toFixed(2)}/mo)`;
        savings = (12.99 - basePrice) * 24;
    }
    
    if (totalPriceEl) {
        totalPriceEl.textContent = totalText;
    }
    
    // Show savings
    if (savingsBadge && savingsAmount) {
        if (savings > 0) {
            savingsBadge.style.display = 'block';
            savingsAmount.textContent = `$${savings.toFixed(2)}`;
        } else {
            savingsBadge.style.display = 'none';
        }
    }
}

function getSelectedAddons() {
    const selected = [];
    document.querySelectorAll('.addon-item input[type="checkbox"]:checked').forEach(checkbox => {
        selected.push(checkbox.id);
    });
    return selected;
}

console.log('Pricing calculator loaded successfully!');
