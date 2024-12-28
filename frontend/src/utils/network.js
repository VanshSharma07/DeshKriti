export const checkServerConnectivity = async () => {
    try {
        const response = await fetch(getBaseUrl() + '/api/health');
        return response.ok;
    } catch (error) {
        console.error('Server connectivity check failed:', error);
        return false;
    }
};

export const getNetworkMode = () => {
    if (window.location.hostname === 'localhost') {
        return 'localhost';
    }
    return 'local-network';
}; 