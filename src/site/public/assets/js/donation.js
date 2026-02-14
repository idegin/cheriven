document.addEventListener('DOMContentLoaded', function() {
    console.log("Donation Script Loaded from External File");

    const amountInput = document.querySelector('.selected-amount');
    const hiddenAmount = document.getElementById('hiddenAmount');
    const totalDonationValue = document.getElementById('totalDonationValue');

    if (!amountInput) {
        console.error("Donation amount input not found!");
        return;
    }

    function formatNumber(input) {
        try {
            let cursorPosition = input.selectionStart;
            let originalValue = input.value;
            // Extract numbers. Remove all non-digits.
            let numericValue = originalValue.replace(/,/g, '').replace(/\D/g, '');

            if (numericValue) {
                let formattedValue = new Intl.NumberFormat('en-US').format(numericValue);
                input.value = formattedValue;

                if (hiddenAmount) hiddenAmount.value = numericValue;
                if (totalDonationValue) totalDonationValue.textContent = formattedValue;

                // Adjust cursor position
                let newCursorPos = cursorPosition + (formattedValue.length - originalValue.length);
                if (newCursorPos < 0) newCursorPos = 0;
                // Check if setSelectionRange is available (some inputs like 'number' don't support it, but this is 'text')
                if (input.setSelectionRange) {
                    input.setSelectionRange(newCursorPos, newCursorPos);
                }
            } else {
                input.value = '';
                if (hiddenAmount) hiddenAmount.value = '';
                if (totalDonationValue) totalDonationValue.textContent = '0';
            }
        } catch (e) {
            console.error("Error formatting donation amount:", e);
        }
    }

    // Apply formatting on input
    amountInput.addEventListener('input', function(e) {
        formatNumber(e.target);
    });

    // Apply initial formatting
    if (amountInput.value) {
        formatNumber(amountInput);
    }
});
