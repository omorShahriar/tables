import React, { useCallback } from "react";

import { buildCollection, buildProperty, FirebaseCMSApp } from "firecms";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

// TODO: Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyB-v8p1o8QRQKaq7px8yZ1gCbzuEqGkydU",
  authDomain: "tables-artform.firebaseapp.com",
  projectId: "tables-artform",
  storageBucket: "tables-artform.appspot.com",
  messagingSenderId: "544155643743",
  appId: "1:544155643743:web:a49de31da014d4d92f50ea",
};

const locales = {
  "en-US": "English (United States)",
  "es-ES": "Spanish (Spain)",
  "de-DE": "German",
};

const localeCollection = buildCollection({
  path: "locale",
  customId: locales,
  name: "Locales",
  singularName: "Locales",
  properties: {
    name: {
      name: "Title",
      validation: { required: true },
      dataType: "string",
    },
    selectable: {
      name: "Selectable",
      description: "Is this locale selectable",
      dataType: "boolean",
    },
    video: {
      name: "Video",
      dataType: "string",
      validation: { required: false },
      storage: {
        storagePath: "videos",
        acceptedFiles: ["video/*"],
      },
    },
  },
});

const productsCollection = buildCollection({
  name: "Products",
  singularName: "Product",
  path: "products",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    // we have created the roles object in the navigation builder
    delete: false,
  }),
  subcollections: [localeCollection],
  properties: {
    name: {
      name: "Name",
      validation: { required: true },
      dataType: "string",
    },
    price: {
      name: "Price",
      validation: {
        required: true,
        requiredMessage: "You must set a price between 0 and 1000",
        min: 0,
        max: 1000,
      },
      description: "Price with range validation",
      dataType: "number",
    },
    status: {
      name: "Status",
      validation: { required: true },
      dataType: "string",
      description: "Should this product be visible in the website",
      longDescription:
        "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
      enumValues: {
        private: "Private",
        public: "Public",
      },
    },
    published: ({ values }) =>
      buildProperty({
        name: "Published",
        dataType: "boolean",
        columnWidth: 100,
        disabled:
          values.status === "public"
            ? false
            : {
                clearOnDisabled: true,
                disabledMessage:
                  "Status must be public in order to enable this the published flag",
              },
      }),
    related_products: {
      dataType: "array",
      name: "Related products",
      description: "Reference to self",
      of: {
        dataType: "reference",
        path: "products",
      },
    },
    main_image: buildProperty({
      // The `buildProperty` method is a utility function used for type checking
      name: "Image",
      dataType: "string",
      storage: {
        storagePath: "images",
        acceptedFiles: ["image/*"],
      },
    }),
    tags: {
      name: "Tags",
      description: "Example of generic array",
      validation: { required: true },
      dataType: "array",
      of: {
        dataType: "string",
      },
    },
    description: {
      name: "Description",
      description: "Not mandatory but it'd be awesome if you filled this up",
      longDescription:
        "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
      dataType: "string",
      columnWidth: 300,
    },
    categories: {
      name: "Categories",
      validation: { required: true },
      dataType: "array",
      of: {
        dataType: "string",
        enumValues: {
          electronics: "Electronics",
          books: "Books",
          furniture: "Furniture",
          clothing: "Clothing",
          food: "Food",
        },
      },
    },
    publisher: {
      name: "Publisher",
      description: "This is an example of a map property",
      dataType: "map",
      properties: {
        name: {
          name: "Name",
          dataType: "string",
        },
        external_id: {
          name: "External id",
          dataType: "string",
        },
      },
    },
    expires_on: {
      name: "Expires on",
      dataType: "date",
    },
  },
});
const datasetsCollection = buildCollection({
  name: "Datasets",
  singularName: "Dataset",
  path: "datasets",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    // we have created the roles object in the navigation builder
    delete: false,
  }),

  properties: {
    title: {
      name: "Title",
      validation: { required: true },
      dataType: "string",
    },

    description: {
      name: "Description",
      description: "Not mandatory but it'd be awesome if you filled this up",
      dataType: "string",
      columnWidth: 300,
    },

    file_upload: buildProperty({
      // The `buildProperty` method is a utility function used for type checking
      name: "File Upload",
      dataType: "string",
      description: "you can upload csv,json,sql or xls file",
      storage: {
        storagePath: "datasets",
        storeUrl: true,
        acceptedFiles: [
          "text/*",
          "application/json",
          "application/vnd.ms-excel",
        ],
      },
    }),
  },
});

export default function App() {
  const myAuthenticator = useCallback(async ({ user, authController }) => {
    if (user?.email?.includes("flanders")) {
      throw Error("Stupid Flanders!");
    }

    console.log("Allowing access to", user?.email);
    // This is an example of retrieving async data related to the user
    // and storing it in the user extra field.
    const sampleUserRoles = await Promise.resolve(["admin"]);
    authController.setExtra(sampleUserRoles);

    return true;
  }, []);

  return (
    <FirebaseCMSApp
      name={"Tables"}
      authentication={myAuthenticator}
      collections={[productsCollection, datasetsCollection]}
      firebaseConfig={firebaseConfig}
    />
  );
}
