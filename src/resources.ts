import { veteranResources } from './data';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resources-container');
    const filterContainer = document.getElementById('filter-container');
    if (!container) return;

    // Define all categories dynamically
    const categories = ['All', ...new Set(veteranResources.map(r => r.category))];

    // Build filter buttons if the filter container exists
    if (filterContainer) {
        filterContainer.innerHTML = categories.map(cat => `
            <button data-category="${cat}" class="filter-btn ${cat === 'All' ? 'bg-faith-gold text-white' : 'bg-gray-100 hover:bg-gray-200'} px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm whitespace-nowrap">
                ${cat === 'Food' ? 'Food Support' : cat}
            </button>
        `).join('');

        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('bg-faith-gold', 'text-white'));
                filterButtons.forEach(b => b.classList.add('bg-gray-100'));
                btn.classList.add('bg-faith-gold', 'text-white');
                btn.classList.remove('bg-gray-100');
                renderResources(btn.getAttribute('data-category') || 'All');
            });
        });
    }

    function renderResources(filter: string = 'All') {
        container!.innerHTML = '';
        const filtered = filter === 'All' 
            ? veteranResources 
            : veteranResources.filter(r => r.category === filter);

        filtered.forEach(res => {
            const card = document.createElement('div');
            card.className = `bg-white p-6 rounded-xl shadow-lg border-t-4 ${res.priority ? 'border-red-600 ring-2 ring-red-50' : 'border-faith-gold'} flex flex-col hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden`;
            
            if (res.priority) {
                const badge = document.createElement('div');
                badge.className = "absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-tighter";
                badge.innerText = "Priority";
                card.appendChild(badge);
            }

            const content = document.createElement('div');
            content.className = "flex flex-col h-full";
            content.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-faith-navy leading-tight pr-4">${res.name}</h3>
                    <span class="px-2 py-1 bg-gray-100 text-[10px] font-bold rounded-md text-faith-slate uppercase tracking-wider whitespace-nowrap">${res.category}</span>
                </div>
                <p class="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">${res.description}</p>
                <div class="space-y-3 text-sm text-gray-500 mb-6">
                    ${res.address ? `<p class="flex items-start"><span class="mr-2 mt-1">📍</span> <span>${res.address}</span></p>` : ''}
                    ${res.phone ? `<p class="flex items-center"><span class="mr-2">📞</span> <a href="tel:${res.phone}" class="font-bold text-faith-navy hover:text-faith-gold transition-colors">${res.phone}</a></p>` : ''}
                </div>
                ${res.link ? `
                    <a href="${res.link}" target="_blank" class="mt-auto block w-full text-center bg-faith-navy text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-faith-gold transition-all shadow-md">
                        Visit Official Site
                    </a>
                ` : ''}
            `;
            card.appendChild(content);
            container!.appendChild(card);
        });
    }

    renderResources();
});
