document.addEventListener('DOMContentLoaded', () => {
    // Placeholder Data - In a real app, this might come from a JSON file or API
    const lettersData = [
        {
            id: "ayb",
            displayChars: "Աա",
            letterName: "Այբ (Ayb)",
            ipa: "[ɑɪb]", // Or sound: /a/ or /ɑ/
            confusions: "Placeholder: Not typically confused with other letters when distinct.",
            variants: [
                { category: "Printed", case: "Capital", imageUrl: "images/A_capital_print.png", tooltip: "Ա - Capital Print" },
                { category: "Printed", case: "Lowercase", imageUrl: "images/a_lowercase_print.png", tooltip: "ա - Lowercase Print" },
                { category: "Handwritten", case: "Capital", imageUrl: "images/A_capital_handwritten.png", tooltip: "Ա - Capital Handwritten" },
                { category: "Handwritten", case: "Capital", imageUrl: "images/A_capital_handwritten_alt.png", tooltip: "Ա - Alt. Capital Handwritten" },
                { category: "Handwritten", case: "Lowercase", imageUrl: "images/a_lowercase_handwritten.png", tooltip: "ա - Lowercase Handwritten" }
            ]
        },
        {
            id: "ben",
            displayChars: "Բբ",
            letterName: "Բեն (Ben)",
            ipa: "[bɛn]", // Or sound: /b/
            confusions: "Placeholder: Sometimes confused with Ք (K'e) in some handwriting.",
            variants: [
                { category: "Printed", case: "Capital", imageUrl: "images/B_capital_print.png", tooltip: "Բ - Capital Print" },
                { category: "Printed", case: "Lowercase", imageUrl: "images/b_lowercase_print.png", tooltip: "բ - Lowercase Print" },
                { category: "Handwritten", case: "Capital", imageUrl: "images/B_capital_handwritten.png", tooltip: "Բ - Capital Handwritten" },
                { category: "Handwritten", case: "Lowercase", imageUrl: "images/b_lowercase_handwritten.png", tooltip: "բ - Lowercase Handwritten" }
            ]
        },
        {
            id: "gim",
            displayChars: "Գգ",
            letterName: "Գիմ (Gim)",
            ipa: "[gim]", // Or sound: /g/
            confusions: "Placeholder: Can be confused with Ձ (Dza) in some scripts.",
            variants: [
                { category: "Printed", case: "Capital", imageUrl: "images/G_capital_print.png", tooltip: "Գ - Capital Print" },
                { category: "Printed", case: "Lowercase", imageUrl: "images/g_lowercase_print.png", tooltip: "գ - Lowercase Print" },
                { category: "Handwritten", case: "Capital", imageUrl: "images/G_capital_handwritten.png", tooltip: "Գ - Capital Handwritten" },
                { category: "Handwritten", case: "Lowercase", imageUrl: "images/g_lowercase_handwritten.png", tooltip: "գ - Lowercase Handwritten" }
            ]
        },
        {
            id: "yev",
            displayChars: "և",
            letterName: "Եվ (Yev)",
            ipa: "[jev] or [v]", // Ligature for 'and'
            confusions: "Placeholder: Not a standard alphabet letter but a common ligature.",
            variants: [
                // As requested, only lowercase variants for և
                { category: "Printed", case: "Lowercase", imageUrl: "images/yev_lowercase_print.png", tooltip: "և - Print" },
                { category: "Handwritten", case: "Lowercase", imageUrl: "images/yev_lowercase_handwritten.png", tooltip: "և - Handwritten" }
            ]
        },
        // ... Add all other Armenian letters here with placeholder image paths
        // For example, using a generic placeholder:
        {
            id: "da",
            displayChars: "Դդ",
            letterName: "Դա (Da)",
            ipa: "[da]",
            confusions: "Placeholder confusions for Da.",
            variants: [
                 { category: "Printed", case: "Capital", imageUrl: "images/placeholder.png", tooltip: "Դ - Capital Print (Placeholder)" },
                 { category: "Printed", case: "Lowercase", imageUrl: "images/placeholder.png", tooltip: "դ - Lowercase Print (Placeholder)" },
            ]
        }
    ];

    const alphabetGrid = document.getElementById('alphabet-grid');
    const selectedLettersDetails = document.getElementById('selected-letters-details');
    const noSelectionMessage = document.querySelector('#selected-letters-details .no-selection');

    let selectedLetterIds = new Set(); // Using a Set for efficient add/delete/has checks

    function populateAlphabetGrid() {
        lettersData.forEach(letter => {
            const button = document.createElement('div');
            button.classList.add('letter-button');
            button.textContent = letter.displayChars;
            button.dataset.id = letter.id;
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0'); // Make it focusable

            button.addEventListener('click', () => toggleLetterSelection(letter.id));
            button.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    toggleLetterSelection(letter.id);
                }
            });
            alphabetGrid.appendChild(button);
        });
    }

    function toggleLetterSelection(letterId) {
        const button = alphabetGrid.querySelector(`.letter-button[data-id="${letterId}"]`);
        if (selectedLetterIds.has(letterId)) {
            selectedLetterIds.delete(letterId);
            button.classList.remove('selected');
        } else {
            selectedLetterIds.add(letterId);
            button.classList.add('selected');
        }
        renderSelectedLettersDetails();
    }

    function renderSelectedLettersDetails() {
        selectedLettersDetails.innerHTML = ''; // Clear previous details

        if (selectedLetterIds.size === 0) {
            if (noSelectionMessage) selectedLettersDetails.appendChild(noSelectionMessage.cloneNode(true));
            return;
        }

        // Display details in the order they appear in lettersData, or selection order.
        // For simplicity, let's iterate through lettersData and check if selected.
        // Or iterate selectedLetterIds if you want to maintain selection order (Set doesn't guarantee order)
        // Let's maintain a rough order of selection by converting Set to Array
        const orderedSelectedIds = Array.from(selectedLetterIds);


        orderedSelectedIds.forEach(id => {
            const letter = lettersData.find(l => l.id === id);
            if (!letter) return;

            const card = document.createElement('div');
            card.classList.add('letter-detail-card');

            card.innerHTML = `
                <h3>${letter.letterName}</h3>
                <div class="letter-info">
                    <p><strong>IPA:</strong> ${letter.ipa}</p>
                    <p><strong>Common Confusions:</strong> ${letter.confusions}</p>
                </div>
                <div class="variants-section">
                    <h4>Letter Variants:</h4>
                    <!-- Variants will be grouped and inserted here -->
                </div>
            `;

            const variantsSection = card.querySelector('.variants-section');
            
            // Group variants by category (Printed, Handwritten) then by case (Capital, Lowercase)
            const groupedVariants = {};
            letter.variants.forEach(variant => {
                if (!groupedVariants[variant.category]) {
                    groupedVariants[variant.category] = {};
                }
                if (!groupedVariants[variant.category][variant.case]) {
                    groupedVariants[variant.category][variant.case] = [];
                }
                groupedVariants[variant.category][variant.case].push(variant);
            });

            for (const categoryName in groupedVariants) {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('variant-category');
                categoryDiv.innerHTML = `<h5>${categoryName}</h5>`;
                
                for (const caseName in groupedVariants[categoryName]) {
                    const caseGroupDiv = document.createElement('div');
                    caseGroupDiv.classList.add('variant-case-group');
                    // For "և", we might not show "Lowercase" explicitly if it's the only case.
                    // Or always show it for consistency. Let's always show it for now.
                    caseGroupDiv.innerHTML = `<h6>${caseName}</h6>`; 

                    const imagesDiv = document.createElement('div');
                    imagesDiv.classList.add('variant-images');

                    groupedVariants[categoryName][caseName].forEach(variant => {
                        const figure = document.createElement('figure');
                        const img = document.createElement('img');
                        img.src = variant.imageUrl;
                        img.alt = `${letter.letterName} - ${variant.case} ${variant.category}`;
                        if (variant.tooltip) {
                            img.title = variant.tooltip;
                        }
                        const figcaption = document.createElement('figcaption');
                        figcaption.textContent = variant.tooltip || `${variant.case} ${variant.category}`;


                        figure.appendChild(img);
                        figure.appendChild(figcaption);
                        imagesDiv.appendChild(figure);
                    });
                    caseGroupDiv.appendChild(imagesDiv);
                    categoryDiv.appendChild(caseGroupDiv);
                }
                variantsSection.appendChild(categoryDiv);
            }
            selectedLettersDetails.appendChild(card);
        });
    }

    // Initial population
    populateAlphabetGrid();
    // Ensure the "no selection" message is present initially if it was cleared by innerHTML=''
    if (selectedLetterIds.size === 0 && noSelectionMessage) {
         selectedLettersDetails.innerHTML = ''; // Clear again just in case
         selectedLettersDetails.appendChild(noSelectionMessage.cloneNode(true));
    }
});