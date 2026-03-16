// app/routes/app.builder.jsx
import React, { useState } from 'react';

export default function Builder() {
  const [selectedBasket, setSelectedBasket] = useState(null);

  const handleBasketSelect = (basket) => {
    setSelectedBasket(basket);
    console.log('Selected:', basket);
  };

  return (
    <s-page heading="Build Your Own Bundle">
      {/* Step 1: Basket Selection */}
      <s-section heading="Step 1: Select Your Basket Size">
        <s-paragraph>
          Choose the size of bundle you want to create:
        </s-paragraph>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {/* Small Basket */}
          <div 
            onClick={() => handleBasketSelect('Small')}
            style={{
              border: selectedBasket === 'Small' ? '2px solid #008060' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedBasket === 'Small' ? '#e6f3ef' : 'white',
              flex: 1
            }}
          >
            <h3>Small Basket</h3>
            <p>1-3 products</p>
            <p><strong>$29.99</strong></p>
          </div>

          {/* Large Basket */}
          <div 
            onClick={() => handleBasketSelect('Large')}
            style={{
              border: selectedBasket === 'Large' ? '2px solid #008060' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedBasket === 'Large' ? '#e6f3ef' : 'white',
              flex: 1
            }}
          >
            <h3>Large Basket</h3>
            <p>4-6 products</p>
            <p><strong>$49.99</strong></p>
          </div>

          {/* Extra Large Basket */}
          <div 
            onClick={() => handleBasketSelect('Extra Large')}
            style={{
              border: selectedBasket === 'Extra Large' ? '2px solid #008060' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedBasket === 'Extra Large' ? '#e6f3ef' : 'white',
              flex: 1
            }}
          >
            <h3>Extra Large Basket</h3>
            <p>7-10 products</p>
            <p><strong>$79.99</strong></p>
          </div>
        </div>

        {selectedBasket && (
          <s-paragraph>
            <br />
            ✅ You selected: <strong>{selectedBasket} Basket</strong>
          </s-paragraph>
        )}
      </s-section>
    </s-page>
  );
}