// Get all download buttons
        const downloadButtons = document.querySelectorAll('.template-button');
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.modal-close');
        const shareButtons = document.querySelectorAll('.share-button');

        // Add click event to all download buttons
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = button.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                modal.classList.add('active');
            });
        });

        // Close button functionality for each modal
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                modal.classList.remove('active');
            });
        });

        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Share button functionality for each modal
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = button.closest('.modal');
                const presetName = modal.querySelector('.preset-name').textContent;
                const currentUrl = window.location.href;
                
                // Use Web Share API if available
                if (navigator.share) {
                    navigator.share({
                        title: presetName,
                        text: `Check out this preset: ${presetName}`,
                        url: currentUrl
                    }).catch(console.error);
                } else {
                    // Fallback to copying to clipboard
                    navigator.clipboard.writeText(currentUrl).then(() => {
                        alert('Link copied to clipboard!');
                    }).catch(console.error);
                }
            });
        });
