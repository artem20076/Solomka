const API_BASE_URL = 'http://localhost:8082/component';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация элементов
    const homePage = document.getElementById('homePage');
    const paintPage = document.getElementById('paintPage');
    const adminPage = document.getElementById('adminPage');
    const homeLink = document.getElementById('homeLink');
    const adminLink = document.getElementById('adminLink');
    const backButton = document.getElementById('backButton');
    const paintsGrid = document.getElementById('paintsGrid');
    const paintDetail = document.getElementById('paintDetail');
    const addPaintForm = document.getElementById('addPaintForm');
    const refreshPaintsBtn = document.getElementById('refreshPaints');
    const adminPaintsList = document.getElementById('adminPaintsList');
    const paintSearch = document.getElementById('paintSearch');

    // Навигация
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('homePage');
        loadPaints();
    });
    
    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('adminPage');
        loadAdminPaints();
    });
    
    backButton.addEventListener('click', () => showPage('homePage'));

    // Загрузка данных
    refreshPaintsBtn?.addEventListener('click', loadAdminPaints);
    addPaintForm?.addEventListener('submit', handleAddPaint);
    paintSearch?.addEventListener('input', (e) => searchPaints(e.target.value));

    // Инициализация
    showPage('homePage');
    loadPaints();
});

// Функции
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

async function loadPaints() {
    try {
        const response = await fetch(API_BASE_URL);
        const paints = await response.json();
        displayPaints(paints);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        alert('Не удалось загрузить каталог красок');
    }
}

async function searchPaints(query) {
    if (!query || query.length < 2) {
        loadPaints();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
        const paints = await response.json();
        displayPaints(paints);
    } catch (error) {
        console.error('Ошибка поиска:', error);
    }
}

function displayPaints(paints) {
    const grid = document.getElementById('paintsGrid');
    grid.innerHTML = '';
    
    if (!paints?.length) {
        grid.innerHTML = '<p>Краски не найдены</p>';
        return;
    }
    
    paints.forEach(paint => {
        // Используем description для хранения цвета в формате HEX
        const colorHex = paint.description?.match(/#[0-9a-f]{6}/i)?.[0] || '#ffffff';
        const price = paint.specs?.match(/Цена: (\d+) руб/)?.[1] || '0';
        
        const card = document.createElement('div');
        card.className = 'paint-card';
        card.innerHTML = `
            <div class="paint-color" style="background-color: ${colorHex}"></div>
            <div class="paint-info">
                <h3>${paint.name}</h3>
                <span class="paint-type">${getTypeName(paint.type)}</span>
                <p>${paint.description?.replace(/#[0-9a-f]{6}/i, '')?.substring(0, 60)}...</p>
                <p class="paint-price">${price} руб</p>
            </div>
        `;
        card.addEventListener('click', () => showPaintDetail(paint.id));
        grid.appendChild(card);
    });
}

function getTypeName(type) {
    const types = {
        'INTERIOR': 'Интерьерная',
        'FACADE': 'Фасадная',
        'AUTO': 'Автомобильная'
    };
    return types[type] || type;
}

async function showPaintDetail(paintId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${paintId}`);
        const paint = await response.json();
        
        if (!paint) throw new Error('Краска не найдена');
        renderPaintDetail(paint);
        showPage('paintPage');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить информацию о краске');
    }
}

function renderPaintDetail(paint) {
    const detail = document.getElementById('paintDetail');
    const colorHex = paint.description?.match(/#[0-9a-f]{6}/i)?.[0] || '#ffffff';
    const price = paint.specs?.match(/Цена: (\d+) руб/)?.[1] || '0';
    const description = paint.description?.replace(/#[0-9a-f]{6}/i, '') || '';
    const specs = paint.specs?.replace(/Цена: \d+ руб/, '') || '';
    
    detail.innerHTML = `
        <div class="detail-header">
            <div class="detail-color" style="background-color: ${colorHex}"></div>
            <div class="detail-title">
                <h2>${paint.name}</h2>
                <div class="detail-meta">
                    <span class="paint-type">${getTypeName(paint.type)}</span>
                </div>
                <div class="detail-price">${price} руб</div>
                <h3>Описание:</h3>
                <p>${description}</p>
                <h3>Характеристики:</h3>
                <p>${specs}</p>
            </div>
        </div>
    `;
}

async function loadAdminPaints() {
    try {
        const response = await fetch(API_BASE_URL);
        const paints = await response.json();
        displayAdminPaints(paints);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить каталог');
    }
}

function displayAdminPaints(paints) {
    const list = document.getElementById('adminPaintsList');
    list.innerHTML = '';
    
    if (!paints?.length) {
        list.innerHTML = '<p>Нет красок в каталоге</p>';
        return;
    }
    
    paints.forEach(paint => {
        const price = paint.specs?.match(/Цена: (\d+) руб/)?.[1] || '0';
        
        const item = document.createElement('div');
        item.className = 'admin-paint-item';
        item.innerHTML = `
            <div>
                <h4>${paint.name}</h4>
                <small>${getTypeName(paint.type)} • ${price} руб</small>
            </div>
            <div class="admin-paint-actions">
                <button class="edit-btn" data-id="${paint.id}">Изменить</button>
                <button class="delete-btn" data-id="${paint.id}">Удалить</button>
            </div>
        `;
        list.appendChild(item);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deletePaint(e.target.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            editPaint(e.target.getAttribute('data-id'));
        });
    });
}

async function handleAddPaint(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: form.paintTitle.value,
        type: form.paintType.value,
        description: `${form.paintColor.value} ${form.paintDesc.value}`,
        specs: `Цена: ${form.paintPrice.value} руб`,
        imageUrl: "default-paint.jpg"
    };
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сервера');
        }
        
        const result = await response.json();
        alert(`Краска "${result.name}" добавлена в каталог!`);
        form.reset();
        loadAdminPaints();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при добавлении: ' + error.message);
    }
}

async function deletePaint(id) {
    if (!confirm('Вы уверены, что хотите удалить эту краску?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Ошибка при удалении');
        
        alert('Краска успешно удалена');
        loadAdminPaints();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при удалении: ' + error.message);
    }
}

async function editPaint(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const paint = await response.json();
        
        if (!paint) throw new Error('Краска не найдена');
        
        // Заполняем форму редактирования
        const form = document.getElementById('addPaintForm');
        form.paintTitle.value = paint.name;
        form.paintType.value = paint.type;
        
        // Извлекаем цвет из описания
        const colorHex = paint.description?.match(/#[0-9a-f]{6}/i)?.[0] || '#ffffff';
        form.paintColor.value = colorHex;
        
        // Удаляем цвет из описания
        form.paintDesc.value = paint.description?.replace(/#[0-9a-f]{6}/i, '') || '';
        
        // Извлекаем цену из характеристик
        const price = paint.specs?.match(/Цена: (\d+) руб/)?.[1] || '0';
        form.paintPrice.value = price;
        
        // Прокручиваем к форме
        document.getElementById('addPaintForm').scrollIntoView();
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при загрузке данных краски: ' + error.message);
    }
}