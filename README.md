# Saran — Network Engineer Portfolio

A responsive, dark-themed portfolio built with plain HTML, CSS and JavaScript. No build tools or framework are required.

## Files
- `index.html` — page content and structure
- `style.css` — layout, typography and responsive styling
- `script.js` — interactive TAN / OOB / PXE / InfiniBand diagram and case-study filters
- `assets/Saran-Vemulapalli-Resume.docx` — resume download included

## Run locally
Open `index.html` in a browser. For a local development server, use the VS Code Live Server extension.

## Personalise before publishing
The portfolio has been populated from the supplied resume. Review the contact details, role dates and resume attachment before publishing. The case studies are generalised troubleshooting examples, not claims of measured outcomes. Never publish customer names, internal IP addresses, MAC addresses, serial numbers, hostnames, credentials, private topology diagrams or confidential operational data.

## Publish with GitHub Pages
1. Sign in to GitHub and create a new public repository, for example `network-engineer-portfolio`.
2. Upload `index.html`, `style.css`, `script.js` and the optional `assets` folder to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for GitHub Pages to publish. The site URL will appear in the Pages section, usually `https://YOUR-GITHUB-USERNAME.github.io/network-engineer-portfolio/`.

If the site does not load, check that `index.html` is in the repository root and that filenames match exactly (GitHub Pages is case-sensitive).


## Architecture diagrams
The Architecture section contains anonymised, interactive schematics for TAN, OOB, PXE and InfiniBand. The TAN / OOB / PXE views are simplified from the supplied architecture references. The InfiniBand view separates the UFM management path (UFM → managed switch → IB core switches) from the data fabric (IB core → IB spine → IB leaf → server HCA / mlx ports). These are conceptual portfolio diagrams, not production port maps.
