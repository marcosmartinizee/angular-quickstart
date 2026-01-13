// DOM Elements
const createSingleForm = document.getElementById('createSingleForm');
const createMultipleForm = document.getElementById('createMultipleForm');
const refreshBtn = document.getElementById('refreshBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const bucketsContainer = document.getElementById('bucketsContainer');
const resultsContainer = document.getElementById('resultsContainer');

// State
let buckets = [];
let selectedBuckets = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBuckets();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    createSingleForm.addEventListener('submit', handleCreateSingle);
    createMultipleForm.addEventListener('submit', handleCreateMultiple);
    refreshBtn.addEventListener('click', loadBuckets);
    deleteSelectedBtn.addEventListener('click', handleDeleteSelected);
}

// API Functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Load Buckets
async function loadBuckets() {
    bucketsContainer.innerHTML = '<p class="loading">Cargando buckets...</p>';

    const result = await apiRequest('/api/buckets');

    if (result.success) {
        buckets = result.buckets;
        renderBuckets();
        addResult('info', 'Buckets Cargados', `Se encontraron ${buckets.length} buckets`);
    } else {
        bucketsContainer.innerHTML = `<p class="empty-state">Error: ${result.error}</p>`;
        addResult('error', 'Error', `No se pudieron cargar los buckets: ${result.error}`);
    }
}

// Render Buckets
function renderBuckets() {
    if (buckets.length === 0) {
        bucketsContainer.innerHTML = '<p class="empty-state">No hay buckets disponibles</p>';
        return;
    }

    bucketsContainer.innerHTML = buckets.map(bucket => `
        <div class="bucket-item" data-bucket="${bucket.name}">
            <div class="bucket-info">
                <div class="bucket-name">${bucket.name}</div>
                <div class="bucket-details">
                    <span class="status-badge ${getPublicAccessClass(bucket.publicAccessType)}">
                        ${bucket.publicAccessType}
                    </span>
                    <span class="status-badge ${getStorageTierClass(bucket.storageTier)}">
                        ${bucket.storageTier}
                    </span>
                    <span style="margin-left: 10px;">Creado: ${formatDate(bucket.timeCreated)}</span>
                </div>
            </div>
            <div class="bucket-actions">
                <input type="checkbox" class="bucket-checkbox" data-bucket="${bucket.name}"
                       onchange="toggleBucketSelection('${bucket.name}')">
                <button class="delete-btn" onclick="deleteSingleBucket('${bucket.name}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Helper Functions
function getPublicAccessClass(accessType) {
    return accessType === 'NoPublicAccess' ? 'status-private' : 'status-public';
}

function getStorageTierClass(tier) {
    return tier === 'Standard' ? 'status-standard' : 'status-archive';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function toggleBucketSelection(bucketName) {
    if (selectedBuckets.has(bucketName)) {
        selectedBuckets.delete(bucketName);
    } else {
        selectedBuckets.add(bucketName);
    }
}

// Create Single Bucket
async function handleCreateSingle(e) {
    e.preventDefault();

    const bucketName = document.getElementById('singleBucketName').value;
    const subdomain = document.getElementById('singleSubdomain').value || null;
    const publicAccess = document.getElementById('singlePublicAccess').value;
    const storageTier = document.getElementById('singleStorageTier').value;

    const finalName = subdomain ? `${subdomain}-${bucketName}` : bucketName;
    addResult('info', 'Creando Bucket', `Creando bucket: ${finalName}...`);

    const result = await apiRequest('/api/buckets/create', {
        method: 'POST',
        body: JSON.stringify({
            bucketName,
            subdomain,
            options: {
                publicAccess,
                storageTier
            }
        })
    });

    if (result.success) {
        addResult('success', 'Bucket Creado', result.message);
        createSingleForm.reset();
        loadBuckets();
    } else {
        addResult('error', 'Error al Crear Bucket', result.message || result.error);
    }
}

// Create Multiple Buckets
async function handleCreateMultiple(e) {
    e.preventDefault();

    const baseName = document.getElementById('multiBaseName').value;
    const subdomainsText = document.getElementById('multiSubdomains').value;
    const publicAccess = document.getElementById('multiPublicAccess').value;
    const storageTier = document.getElementById('multiStorageTier').value;

    const subdomains = subdomainsText.split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    if (subdomains.length === 0) {
        addResult('error', 'Error', 'Debe especificar al menos un subdominio');
        return;
    }

    addResult('info', 'Creando Buckets', `Creando ${subdomains.length} buckets...`);

    const result = await apiRequest('/api/buckets/create-multiple', {
        method: 'POST',
        body: JSON.stringify({
            baseName,
            subdomains,
            options: {
                publicAccess,
                storageTier
            }
        })
    });

    if (result.success) {
        result.results.forEach(r => {
            if (r.success) {
                addResult('success', 'Bucket Creado', `✅ ${r.bucketName}`);
            } else {
                addResult('error', 'Error al Crear Bucket', `❌ ${r.bucketName}: ${r.message}`);
            }
        });
        createMultipleForm.reset();
        loadBuckets();
    } else {
        addResult('error', 'Error', result.error);
    }
}

// Delete Single Bucket
async function deleteSingleBucket(bucketName) {
    if (!confirm(`¿Está seguro de que desea eliminar el bucket "${bucketName}"?`)) {
        return;
    }

    addResult('info', 'Eliminando Bucket', `Eliminando bucket: ${bucketName}...`);

    const result = await apiRequest(`/api/buckets/${bucketName}`, {
        method: 'DELETE'
    });

    if (result.success) {
        addResult('success', 'Bucket Eliminado', result.message);
        loadBuckets();
    } else {
        addResult('error', 'Error al Eliminar Bucket', result.message || result.error);
    }
}

// Delete Selected Buckets
async function handleDeleteSelected() {
    if (selectedBuckets.size === 0) {
        alert('Debe seleccionar al menos un bucket para eliminar');
        return;
    }

    const bucketList = Array.from(selectedBuckets).join('\n- ');
    if (!confirm(`¿Está seguro de que desea eliminar los siguientes buckets?\n\n- ${bucketList}`)) {
        return;
    }

    addResult('info', 'Eliminando Buckets', `Eliminando ${selectedBuckets.size} buckets...`);

    const result = await apiRequest('/api/buckets/delete-multiple', {
        method: 'POST',
        body: JSON.stringify({
            bucketNames: Array.from(selectedBuckets)
        })
    });

    if (result.success) {
        result.results.forEach(r => {
            if (r.success) {
                addResult('success', 'Bucket Eliminado', `✅ ${r.bucketName}`);
            } else {
                addResult('error', 'Error al Eliminar Bucket', `❌ ${r.bucketName}: ${r.message}`);
            }
        });
        selectedBuckets.clear();
        loadBuckets();
    } else {
        addResult('error', 'Error', result.error);
    }
}

// Add Result to UI
function addResult(type, title, message) {
    const resultItem = document.createElement('div');
    resultItem.className = `result-item ${type}`;
    resultItem.innerHTML = `
        <div class="result-title">${title}</div>
        <div class="result-message">${message}</div>
        <div class="result-time">${new Date().toLocaleTimeString('es-ES')}</div>
    `;

    // Clear empty state message if present
    const emptyState = resultsContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    resultsContainer.insertBefore(resultItem, resultsContainer.firstChild);

    // Limit to 20 results
    const results = resultsContainer.querySelectorAll('.result-item');
    if (results.length > 20) {
        results[results.length - 1].remove();
    }
}

// Make functions globally available
window.toggleBucketSelection = toggleBucketSelection;
window.deleteSingleBucket = deleteSingleBucket;
