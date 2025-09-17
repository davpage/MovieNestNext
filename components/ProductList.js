'use client';

import { useState, useEffect } from 'react';

export default function ProductList() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(1);

    const filteredProducts = selectedCategoryId
        ? products.filter((p) => p.category_id === parseInt(selectedCategoryId))
        : [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ստանալ կատեգորիաներ
                const categoriesResponse = await fetch('/api/categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                // Ստանալ ապրանքներ
                const productsResponse = await fetch('/api/products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!productsResponse.ok) throw new Error('Failed to fetch products');
                const productsData = await productsResponse.json();
                setProducts(productsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center text-lg text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-lg text-blue-700 bg-blue-100 p-4 rounded-lg">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900 dark:text-white">
            {/* Կատեգորիաների շարքը որպես կոճակներ */}
            <section className="mb-10">
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategoryId(category.id)}
                            className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                                selectedCategoryId === category.id
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-100 dark:bg-gray-800 dark:text-orange-400 dark:border-orange-600 dark:hover:bg-orange-700 dark:hover:text-white'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Ընտրված կատեգորիայի ապրանքները */}
            {selectedCategoryId && (
                <section>
                    {filteredProducts.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">No products in this category.</p>
                    ) : (
                        <ul className="flex gap-4 flex-wrap">
                            {filteredProducts.map((product) => (
                                <li
                                    key={product.id}
                                    className="p-4 w-[250px] border border-gray-200 rounded-md bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <strong className="text-xl text-orange-600 dark:text-orange-400">
                                        {product.name}
                                    </strong>
                                    <p className="text-gray-600 mt-1 dark:text-gray-300">
                                        {product.description || 'No description'}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-200">Price: ${product.price}</p>
                                    {product.image_url && (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-[220px] h-[200px] mt-2 rounded-md object-contain object-center"
                                        />
                                    )}
                                    <p className="text-gray-700 dark:text-gray-200">Stock: {product.stock}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
}