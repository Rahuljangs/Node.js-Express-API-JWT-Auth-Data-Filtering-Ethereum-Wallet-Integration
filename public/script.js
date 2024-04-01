document.addEventListener('DOMContentLoaded', () => {
    const categoryDropdown = document.getElementById('category');

    fetch('/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            return response.json(); 
        })
        .then(data => {

            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = ''; 
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    document.getElementById("applyFilters").addEventListener("click", applyFilters);
});

function applyFilters() {
    const category = document.getElementById('category').value;
    const limit = document.getElementById('limit').value;

    fetch('/applyFilters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, limit })
    })
    .then(response => {
        if (response.ok) {
            console.log("Filters applied successfully");
            return response.json(); 
        } else {
            console.error("Failed to apply filters");
        }
    })
    .then(data => {
        const jsonString = JSON.stringify(data, null, 2);

        const filterDetailsSection = document.getElementById('filterDetails');
        filterDetailsSection.innerHTML = `
            <h2>Filter Details (JSON)</h2>
            <pre>${jsonString}</pre>
        `;
    })
    .catch(error => {
        console.error('Error applying filters:', error);
    });
}
