# Tradition Threads — Traditional Attire for Students

A responsive static website prototype for the **Traditional Attire for Students** project. It is designed to publish on **GitHub Pages** and uses plain HTML, CSS, and JavaScript—no build tools or paid hosting are required.

## Included features

- Responsive homepage and cultural collection cards
- Sample product catalogue with prices displayed in CAD
- Search, culture and occasion filters, and price sorting
- Shopping bag with quantity controls, remove item, subtotal calculation, and browser `localStorage`
- Order-enquiry email draft generated from the shopping bag
- Feedback form that prepares an email draft
- About section, project purpose, and how-it-works section
- Keyboard-friendly buttons, labels, focus states, and reduced-motion support

## Publish using GitHub Pages

1. Sign in to GitHub and create a **new public repository**. A repository name such as `tradition-threads` is fine.
2. Download and unzip the project ZIP on your computer.
3. Upload the contents of the `tradition_threads_github_pages` folder to the **root** of the repository. Make sure `index.html` is directly in the repository root—not inside an extra nested folder.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch **main** and folder **/(root)**, then click **Save**.
7. Wait for the Pages deployment to finish. The published URL will appear in **Settings → Pages** and usually looks like `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
8. Whenever you change the site, commit or upload the updated files to `main`; GitHub Pages will publish the update.

GitHub may take a few minutes to publish a new site. Use the exact URL shown in repository Settings → Pages.

## Before publishing to real customers

This is a front-end demo. The project charter estimates CAD $145 for a domain and hosting; GitHub Pages can host a static project site at no hosting charge for a public repository, subject to GitHub's current terms. A custom domain is optional and must be registered separately.

**Please complete these items before treating it as a live store:**

1. **Verify products and prices.** The eight products and prices are examples, not supplier quotes or confirmed stock. Replace them with products your team can actually source.
2. **Use approved product images.** The demo uses externally hosted Unsplash image URLs. Confirm each image is suitable and available; for a production shop, use images you have permission to publish and consider storing optimized copies in `assets/`.
3. **Connect feedback.** The feedback form opens a pre-filled email draft. It does not automatically send or store a message. Replace the blank `mailto:` recipient in `script.js` with a project email address, or connect a form provider.
4. **Connect real orders and payments.** GitHub Pages cannot run server-side code. Do not collect card details in this page. Use a reputable hosted checkout/store provider or a secure backend if real orders, stock, customer accounts, or payments are needed.
5. **Set policies and contact information.** Add the real project email, delivery/pickup information, return policy, privacy notice, and supplier/stock details before public sales.
6. **Check all content and images.** Some images are editorial placeholders and may not depict the exact named garment. Replace any image that does not accurately represent the product.

## Editing the catalogue

Open `script.js` and find `const PRODUCTS = [...]`. Each product has these fields:

```js
{
  id: 1,
  name: "Embroidered Festive Kurta",
  culture: "Indian",
  occasion: "Festival",
  price: 39,
  tag: "Student favourite",
  image: "https://example.com/your-image.jpg"
}
```

- Keep each `id` unique.
- `culture` should match one of the options in `index.html`: `Indian`, `African`, `Japanese`, or `South Asian`.
- `occasion` should match `Festival`, `Cultural Day`, `Wedding`, or `Everyday`.
- `price` is a sample amount in Canadian dollars.
- Use an image URL that is publicly accessible, or add an image to `assets/` and use a relative path such as `assets/kurta.jpg`.

To change the project name, update the page `<title>`, the logo text in `index.html`, and any relevant README text.

## Project structure

```text
tradition_threads_github_pages/
├── index.html
├── styles.css
├── script.js
├── README.md
├── .nojekyll
└── assets/
    └── favicon.svg
```

## Project alignment

The website supports the project charter's aims to make traditional attire easier for students to discover, provide a catalogue with prices and descriptions, promote cultural inclusion, gather student preferences, and prepare a convenient ordering path. Supplier sourcing, real stock, final pricing, and live order processing remain project tasks.
