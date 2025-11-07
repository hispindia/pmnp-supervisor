const useCustomInput = (rules) => {
    const getInputField = (deCoc) => {
        return document.querySelector(`td[name="${deCoc}-input"] input`);
    };

    const setValueInInputField = (inputField, value) => {
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;
        nativeInputValueSetter.call(inputField, value);

        inputField.dispatchEvent(new Event('focus'));

        var ev = new Event('input', { bubbles: true });
        inputField.dispatchEvent(ev);

        inputField.dispatchEvent(new Event('blur'));
    };

    const activeCustomField = (
        element,
        dataElementId,
        categoryOptionComboId
    ) => {
        const deID = `${dataElementId}-${categoryOptionComboId}`;

        // listening the change event of the input field
        Object.keys(rules).forEach((fieldKey) => {
            const { totalOf } = rules[fieldKey];

            if (totalOf.includes(deID)) {
                element.addEventListener('change', () => {
                    let totalField = getInputField(fieldKey);

                    const totalValue = totalOf.reduce((acc, curr) => {
                        let currField = getInputField(curr);
                        return (
                            acc +
                            (currField.value ? parseInt(currField.value) : 0)
                        );
                    }, 0);
                    setValueInInputField(totalField, totalValue);
                });
            }
        });
    };

    const shouldDisable = (dataElementId, categoryOptionComboId) => {
        const deID = `${dataElementId}-${categoryOptionComboId}`;
        if (!rules[deID]) return;
        const { shouldDisable } = rules[deID];
        return shouldDisable || false;
    };

    const isCustomField = (dataElementId, categoryOptionComboId) => {
        const deID = `${dataElementId}-${categoryOptionComboId}`;
        return rules[deID] ? true : false;
    };

    return { activeCustomField, shouldDisable, isCustomField };
};

export default useCustomInput;
