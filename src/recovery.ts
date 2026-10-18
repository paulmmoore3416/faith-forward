import './layout';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('manual-content');
    if (!container) return;

    try {
        // Since we are using Vite, we can fetch the md file
        // In development it will be in src/recovery-manual/index.md
        // We'll move it to public or handle it via a direct import/fetch
        const response = await fetch(`${import.meta.env.BASE_URL}recovery-manual.md`);
        if (!response.ok) throw new Error('Manual not found');
        
        const markdown = await response.text();
        const html = await marked.parse(markdown);
        container.innerHTML = DOMPurify.sanitize(html);
        
        // Handle anchor links after rendering
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) target.scrollIntoView();
        }
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="text-red-600 font-bold">Error loading the recovery manual. Please contact support.</p>`;
    }
});
