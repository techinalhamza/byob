// app/routes/app.builder.jsx
import React, { useState } from 'react';
import { useLoaderData, useActionData } from "react-router";
import { authenticate } from '../shopify.server';  // ✅ Shopify authentication


// 📥 Shopify se products fetch karne ka loader
export async function loader({ request }) {
  try {
    // Shopify admin API se authenticate karo
    const { admin } = await authenticate.admin(request);
    
    // GraphQL query - products fetch karne ke liye
    const response = await admin.graphql(
      `#graphql
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price
                  }
                }
              }
            }
          }
        }
      }`
    );

    const data = await response.json();
    
    // Data ko simple format mein convert karo
    const products = data.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      image: node.images.edges[0]?.node.url || 'https://via.placeholder.com/200x200?text=No+Image',
      price: parseFloat(node.variants.edges[0]?.node.price) || 0
    }));

    return { products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], error: error.message };
  }
}



export default function Builder() {
  const { products, error } = useLoaderData(); // ✅ Loader se data lein
  const [selectedBasket, setSelectedBasket] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basket, 2: Products, 3: Preview
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Agar error hai to dikhao
  if (error) {
    return (
      <s-page heading="Error">
        <s-section>
          <div
            style={{
              color: "red",
              padding: "1rem",
              border: "1px solid red",
              borderRadius: "4px",
            }}
          >
            Error loading products: {error}
          </div>
        </s-section>
      </s-page>
    );
  }

  const handleBasketSelect = (basket) => {
    setSelectedBasket(basket);
    console.log("Selected:", basket);
  };

  const addProduct = (product) => {
    // Check if product already added
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
      console.log("Added:", product.title);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    console.log("Removed product ID:", productId);
  };

  // Basket limits based on selection
  const getBasketLimit = () => {
    switch (selectedBasket) {
      case "Small":
        return { min: 1, max: 3 };
      case "Large":
        return { min: 4, max: 6 };
      case "Extra Large":
        return { min: 7, max: 10 };
      default:
        return { min: 0, max: 0 };
    }
  };

  // Step 1: Basket Selection
  const renderStep1 = () => (
    <s-section heading="Step 1: Choose Your Basket Size">
      <s-paragraph>
        Pehle apni preferred basket size select karein. Har basket ki apni
        product limit aur base price hai.
      </s-paragraph>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {/* Small Basket */}
        <div
          onClick={() => handleBasketSelect("Small")}
          style={{
            border:
              selectedBasket === "Small"
                ? "2px solid #008060"
                : "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            cursor: "pointer",
            backgroundColor: selectedBasket === "Small" ? "#e6f3ef" : "white",
            flex: 1,
          }}
        >
          <h3>📦 Small Basket</h3>
          <p>Min: 1, Max: 3 products</p>
          <p>
            <strong>Base Price: $29.99</strong>
          </p>
        </div>

        {/* Large Basket */}
        <div
          onClick={() => handleBasketSelect("Large")}
          style={{
            border:
              selectedBasket === "Large"
                ? "2px solid #008060"
                : "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            cursor: "pointer",
            backgroundColor: selectedBasket === "Large" ? "#e6f3ef" : "white",
            flex: 1,
          }}
        >
          <h3>🛍️ Large Basket</h3>
          <p>Min: 4, Max: 6 products</p>
          <p>
            <strong>Base Price: $49.99</strong>
          </p>
        </div>

        {/* Extra Large Basket */}
        <div
          onClick={() => handleBasketSelect("Extra Large")}
          style={{
            border:
              selectedBasket === "Extra Large"
                ? "2px solid #008060"
                : "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            cursor: "pointer",
            backgroundColor:
              selectedBasket === "Extra Large" ? "#e6f3ef" : "white",
            flex: 1,
          }}
        >
          <h3>🎁 Extra Large Basket</h3>
          <p>Min: 7, Max: 10 products</p>
          <p>
            <strong>Base Price: $79.99</strong>
          </p>
        </div>
      </div>

      {selectedBasket && (
        <s-paragraph>
          <br />✅ Selected: <strong>{selectedBasket}</strong>
        </s-paragraph>
      )}
    </s-section>
  );

  // Step 2: Products Selection
  const renderStep2 = () => {
    const limit = getBasketLimit();

    return (
      <s-section heading="Step 2: Add Products to Your Basket">
        <s-paragraph>
          Apne <strong>{selectedBasket}</strong> basket mein products add
          karein. Minimum: {limit.min}, Maximum: {limit.max} products.
        </s-paragraph>

        {/* Selected products count */}
        <div
          style={{
            background: "#f6f6f7",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <strong>
            Selected: {selectedProducts.length} / {limit.max} products
          </strong>
        </div>

        {/* Products grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <h4>{product.title}</h4>
              <p>
                <strong>${product.price}</strong>
              </p>

              {selectedProducts.find((p) => p.id === product.id) ? (
                <button
                  onClick={() => removeProduct(product.id)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => addProduct(product)}
                  disabled={selectedProducts.length >= limit.max}
                  style={{
                    background:
                      selectedProducts.length >= limit.max ? "#ccc" : "#008060",
                    color: "white",
                    border: "none",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    cursor:
                      selectedProducts.length >= limit.max
                        ? "not-allowed"
                        : "pointer",
                    width: "100%",
                  }}
                >
                  Add to Basket
                </button>
              )}
            </div>
          ))}
        </div>
      </s-section>
    );
  };

  // Step 3: Preview
  const renderStep3 = () => {
    const limit = getBasketLimit();
    const basketPrice =
      selectedBasket === "Small"
        ? 29.99
        : selectedBasket === "Large"
          ? 49.99
          : 79.99;

    const productsTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const grandTotal = basketPrice + productsTotal;

    return (
      <s-section heading="Step 3: Preview Your Bundle">
        <s-paragraph>
          Apni bundle ka preview dekhein aur finalize karein.
        </s-paragraph>

        {/* Basket Summary */}
        <div
          style={{
            border: "1px solid #008060",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            background: "#e6f3ef",
          }}
        >
          <h3>{selectedBasket} Basket</h3>
          <p>
            Base Price: <strong>${basketPrice}</strong>
          </p>
        </div>

        {/* Selected Products */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h4>Selected Products ({selectedProducts.length} items):</h4>
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>{product.title}</span>
              <span>
                <strong>${product.price}</strong>
              </span>
            </div>
          ))}
        </div>

        {/* Note Section */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h4>Add a Note (Optional):</h4>
          <textarea
            placeholder="e.g., Happy Birthday! 🎂"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "80px",
            }}
          />
        </div>

        {/* Total */}
        <div
          style={{
            border: "2px solid #008060",
            borderRadius: "8px",
            padding: "1rem",
            background: "#e6f3ef",
            textAlign: "right",
          }}
        >
          <h2>Total: ${grandTotal.toFixed(2)}</h2>
        </div>
      </s-section>
    );
  };

  return (
    <s-page heading="Bundle Builder - Admin Settings">
      {/* Progress Bar */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f6f6f7",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "0.5rem",
            background:
              currentStep === 1
                ? "#008060"
                : currentStep > 1
                  ? "#00a87e"
                  : "#f1f1f1",
            color: currentStep === 1 || currentStep > 1 ? "white" : "#6d7175",
            borderRadius: "4px",
          }}
        >
          1️⃣ Select Basket {currentStep > 1 && "✓"}
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "0.5rem",
            background:
              currentStep === 2
                ? "#008060"
                : currentStep > 2
                  ? "#00a87e"
                  : "#f1f1f1",
            color: currentStep === 2 || currentStep > 2 ? "white" : "#6d7175",
            borderRadius: "4px",
          }}
        >
          2️⃣ Add Products {currentStep > 2 && "✓"}
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "0.5rem",
            background: currentStep === 3 ? "#008060" : "#f1f1f1",
            color: currentStep === 3 ? "white" : "#6d7175",
            borderRadius: "4px",
          }}
        >
          3️⃣ Preview
        </div>
      </div>

      {/* Current Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          marginTop: "2rem",
          padding: "1rem",
          background: "#f6f6f7",
          borderRadius: "8px",
        }}
      >
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          style={{
            padding: "0.5rem 1rem",
            background: currentStep === 1 ? "#ccc" : "#008060",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: currentStep === 1 ? "not-allowed" : "pointer",
          }}
        >
          ← Previous
        </button>

        <span>Step {currentStep} of 3</span>

        {currentStep < 3 ? (
          <button
            onClick={() => {
              if (currentStep === 1 && !selectedBasket) {
                alert("Pehle basket select karein!");
              } else if (currentStep === 2) {
                const limit = getBasketLimit();
                if (selectedProducts.length < limit.min) {
                  alert(`Minimum ${limit.min} products select karein!`);
                } else {
                  setCurrentStep(currentStep + 1);
                }
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={currentStep === 1 && !selectedBasket}
            style={{
              padding: "0.5rem 1rem",
              background:
                currentStep === 1 && !selectedBasket ? "#ccc" : "#008060",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor:
                currentStep === 1 && !selectedBasket
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={async () => {
              const formData = new FormData();
              formData.append("basketType", selectedBasket);
              formData.append("products", JSON.stringify(selectedProducts));
              formData.append("note", note);

              const response = await fetch("/app/builder", {
                method: "POST",
                body: formData,
              });
              const result = await response.json();

              if (result.success) {
                alert("✅ Bundle successfully added to cart!");
                // Reset form
                setCurrentStep(1);
                setSelectedBasket(null);
                setSelectedProducts([]);
                setNote("");
              }
            }}
            style={{
              padding: "0.5rem 1rem",
              background: "#008060",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add to Cart 🛒
          </button>
        )}
      </div>
    </s-page>
  );
}


// 📤 Action - form submit handle karta hai (Add to Cart)
export async function action({ request }) {
  try {
    const formData = await request.formData();
    
    const basketType = formData.get('basketType');
    const products = JSON.parse(formData.get('products'));
    const note = formData.get('note');
    
    // Calculate total
    const basketPrice = basketType === 'Small' ? 29.99 : 
                        basketType === 'Large' ? 49.99 : 79.99;
    const productsTotal = products.reduce((sum, p) => sum + p.price, 0);
    const total = basketPrice + productsTotal;

    // Yahan actual Shopify cart mein add karenge
    console.log('Adding to cart:', {
      basket: basketType,
      products: products,
      note: note,
      total: total
    });

    return { success: true, message: 'Bundle added to cart!' };
  } catch (error) {
    return { error: error.message };
  }
}
