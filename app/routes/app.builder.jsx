// app/routes/app.builder.jsx
import React, { useState } from 'react';

export default function Builder() {
  const [selectedBasket, setSelectedBasket] = useState(null);

  const handleBasketSelect = (basket) => {
    setSelectedBasket(basket);
    console.log('Selected:', basket);
  };

  return (
    <s-page heading="Bundle Builder - Admin Settings">
      <s-section heading="Step 1: Configure Basket Types">
        <s-paragraph>
          Ye **admin settings** hai - yahan aap define karenge ke customer ko 
          kaun se basket options dikhenge (Small/Large/XL) aur unki kya limits hain.
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
            <p>Min: 1, Max: 3 products</p>
            <p><strong>Base Price: $29.99</strong></p>
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
            <p>Min: 4, Max: 6 products</p>
            <p><strong>Base Price: $49.99</strong></p>
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
            <p>Min: 7, Max: 10 products</p>
            <p><strong>Base Price: $79.99</strong></p>
          </div>
        </div>

        {selectedBasket && (
          <s-paragraph>
            <br />
            ✅ Selected configuration: <strong>{selectedBasket}</strong> - 
            Yeh setting save hogi aur customer ko storefront par yahi options dikhenge.
          </s-paragraph>
        )}
      </s-section>
    </s-page>
  );
}