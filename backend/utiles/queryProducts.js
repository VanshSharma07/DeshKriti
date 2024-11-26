class queryProducts {
    products = []
    query = {}
    constructor(products, query) {
        this.products = products
        this.query = query
    }

    categoryQuery = () => {
        if (this.query.category) {
            this.products = this.products.filter(p => 
                p.category === this.query.category || 
                p.categories.includes(this.query.category)
            )
        }
        return this
    }

    regionQuery = () => {
        console.log('Region query called with:', this.query.region);
        if (this.query.region && this.query.region !== '') {
            const beforeFilter = this.products.length;
            this.products = this.products.filter(p => 
                p.region && p.region.toLowerCase() === this.query.region.toLowerCase()
            );
            console.log(`Region filter: ${beforeFilter} -> ${this.products.length} products`);
            console.log('Available regions:', [...new Set(this.products.map(p => p.region || 'none'))]);
        }
        return this
    }

    stateQuery = () => {
        console.log('State query called with:', this.query.state);
        if (this.query.state && this.query.state !== '') {
            const beforeFilter = this.products.length;
            this.products = this.products.filter(p => 
                p.state && p.state.toLowerCase() === this.query.state.toLowerCase()
            );
            console.log(`State filter: ${beforeFilter} -> ${this.products.length} products`);
            console.log('Available states:', [...new Set(this.products.map(p => p.state || 'none'))]);
        }
        return this
    }

    ratingQuery = () => {
        if (this.query.rating && this.query.rating !== '') {
            this.products = this.products.filter(p => parseInt(p.rating) === parseInt(this.query.rating))
        }
        return this
    }

    searchQuery = () => {
        return this
    }

    priceQuery = () => {
        return this
    }

    sortByPrice = () => {
        return this
    }

    skip = () => {
        return this
    }

    limit = () => {
        return this
    }

    countProducts = () => {
        return this.products.length
    }

    getProducts = () => {
        return this.products
    }
}
module.exports = queryProducts