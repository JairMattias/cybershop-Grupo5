function validateProductId(id) {
    return {
        valid: typeof id === 'number' && Number.isInteger(id) && id >= 1 && id <= 10000,
        message: 'ID de producto debe estar entre 1 y 10000'
    };
}

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function validateProduct(product) {
    const errors = [];

    if (!product || typeof product !== 'object') {
        errors.push('Producto inválido');
        return { valid: false, errors };
    }

    if (typeof product.id !== 'number' || !Number.isInteger(product.id) || product.id <= 0) {
        errors.push('ID inválido');
    }

    if (typeof product.name !== 'string' || product.name.trim().length < 3 || product.name.trim().length > 100) {
        errors.push('Nombre inválido');
    }

    if (typeof product.description !== 'string' || product.description.trim().length < 3 || product.description.trim().length > 200) {
        errors.push('Descripción inválida');
    }

    if (typeof product.price !== 'number' || product.price < 0) {
        errors.push('Precio inválido');
    }

    if (typeof product.image !== 'string' || !/^https?:\/\//.test(product.image)) {
        errors.push('Imagen inválida');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}