export function generateIntelligentSKU(name: string, category: string, liters: number) {
    const catPrefix = (category || 'GEN').substring(0, 3).toUpperCase();
    const nameSlug = name.substring(0, 4).toUpperCase().replace(/\s/g, '');
    const volLabel = liters ? `${liters}L` : '0L';
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${catPrefix}-${nameSlug}-${volLabel}-${randomSuffix}`;
}
