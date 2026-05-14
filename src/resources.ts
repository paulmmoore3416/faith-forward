import { veteranResources } from './data';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resources-container');
    if (!container) return;

    function renderResources(filter: string = 'All') {
        container!.innerHTML = '';
        const filtered = filter === 'All' 
            ? veteranResources 
            : veteranResources.filter(r => r.category === filter);

        filtered.forEach(res => {
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-xl shadow-lg border-t-4 border-faith-gold flex flex-col hover:shadow-2xl transition-shadow';
            
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-faith-navy">${res.name}</h3>
                    <span class="px-3 py-1 bg-gray-100 text-xs font-semibold rounded-full text-faith-slate uppercase tracking-wider">${res.category}</span>
                </div>
                <p class="text-gray-600 mb-4 flex-grow">${res.description}</p>
                <div class="space-y-2 text-sm text-gray-500 mb-4">
                    ${res.address ? `<p class="flex items-center"><span class="mr-2">📍</span> ${res.address}</p>` : ''}
                    ${res.phone ? `<p class="flex items-center"><span class="mr-2">📞</span> <a href="tel:${res.phone}" class="hover:text-faith-gold">${res.phone}</a></p>` : ''}
                </div>
                ${res.link ? `
                    <a href="${res.link}" target="_blank" class="mt-auto inline-block text-center bg-faith-navy text-white px-4 py-2 rounded hover:bg-faith-gold transition-colors">
                        Visit Website
                    </a>
                ` : ''}
            `;
            container!.appendChild(card);
        });
    }

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('bg-faith-gold', 'text-white'));
            btn.classList.add('bg-faith-gold', 'text-white');
            renderResources(btn.getAttribute('data-category') || 'All');
        });
    });

    renderResources();
});
