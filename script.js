
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    const fuse = new Fuse(data, {
      keys: ['title', 'description', 'tags'],
      threshold: 0.3
    });

    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category-filter');
    const resultsDiv = document.getElementById('results');

    const allTags = Array.from(new Set(data.flatMap(item => item.tags || []))).sort();
    allTags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      categorySelect.appendChild(option);
    });

    function renderResults(results) {
      resultsDiv.innerHTML = results.map(result => {
        const item = result.item || result;
        const tagBadges = (item.tags || []).map(tag => `<span class="badge">${tag}</span>`).join(' ');
        return `
          <div class="result">
            <strong>${item.title}</strong>
            <p>${item.description}</p>
            ${tagBadges}
            ${item.command ? `<pre><code>${item.command}</code></pre>` : ''}
          </div>
        `;
      }).join('');
    }

    function applyFilter() {
      let filtered = data;
      const term = searchInput.value.trim();
      const tag = categorySelect.value;

      if (term !== '') filtered = fuse.search(term).map(r => r.item);
      if (tag !== 'All') filtered = filtered.filter(d => d.tags && d.tags.includes(tag));

      renderResults(filtered);
    }

    searchInput.addEventListener('input', applyFilter);
    categorySelect.addEventListener('change', applyFilter);

    renderResults(data);
  });
