import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    #graphql
    query BasketMetaobjects {
      metaobjects(type: "basket", first: 10) {
        nodes {
          id
          handle

          basketName: field(key: "basket_name") {
            value
          }

          basketImage: field(key: "basket_image") {
            reference {
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }

          basePrice: field(key: "base_price") {
            value
          }

          minProducts: field(key: "min_products") {
            value
          }

          maxProducts: field(key: "max_products") {
            value
          }

          allowedProducts: field(key: "allowed_products") {
            references(first: 20) {
              nodes {
                ... on Product {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  `);

  const json = await response.json();
  console.log(json);
  return json.data;
};