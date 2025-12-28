# OS1NT R3P0

A curated OSINT (Open-Source Intelligence) link repository with an organized card-based interface, blog, and powerful search functionality.

## Overview

**OS1NT R3P0** is a searchable collection of open-source intelligence tools and resources, organized by category and designed for investigators, analysts, and security researchers. The project includes:

- **Interactive card-based UI** for browsing OSINT tools and resources
- **Blog section** with field notes, tradecraft guides, and tool tutorials
- **Full-text search** across category titles and tool descriptions
- **Responsive design** with dark theme for extended analysis sessions
- **Sortable categories** in alphabetical order across three columns

## Files & Structure

```
├── index.html              # Main OSINT tools directory
├── blog.html               # Blog/field notes
├── styles.css              # Shared styling (dark theme, cards, responsive layout)
├── osint-cards.js          # Dynamic card rendering & search logic
├── awesome-osint.json      # Tool database with categories and descriptions
├── search_5177376.png      # Logo/favicon
├── blogres/                # Blog resources folder
│   ├── favicon.png         # Example favicon for blog post
│   └── shodan_favicon_search.png  # Search results screenshot
└── README.md              # This file
```

## Features

### Main Directory (index.html)

- **Alphabetically sorted categories** displayed in a 3-column grid (A, B, C / D, E, F order)
- **Collapsible category cards** with expandable lists of tools
- **Search toolbar** with clear (✕) button
- **Item counter** showing visible results
- **Collapse/Expand All** button to manage card states
- **Favicon-based tool icons** via Google's favicon service

### Blog (blog.html)

- Long-form OSINT field notes and guides
- Post-specific search (title + body content)
- Clear button for search input
- Tag-based organization
- Embedded figures with centered, italicized captions

### Search & Filtering

- **Real-time search** across:
  - Category titles
  - Tool names
  - Tool descriptions
  - Blog post titles and content
- **Case-insensitive matching**
- **Search persistence** via input field focus management
- **Clear button** that resets input and focus

## Usage

### Running Locally

1. Clone or download the repository:
   ```bash
   git clone https://github.com/collstock/os1nt.git
   cd os1nt
   ```

2. Open in a local web server (required for JSON loading):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js (http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser.

### Viewing Files

- **Main OSINT directory**: `http://localhost:8000/index.html`
- **Blog**: `http://localhost:8000/blog.html`

## Data Format

### awesome-osint.json

The primary data source is `awesome-osint.json`, structured as:

```json
{
  "categories": [
    {
      "title": "[↑](#-table-of-contents) Category Name",
      "subtitle": "Optional description",
      "items": [
        {
          "name": "Tool Name",
          "url": "https://example.com/tool",
          "description": "Brief description of the tool"
        },
        ...
      ]
    },
    ...
  ]
}
```

**Notes:**
- Titles with `[↑](#-table-of-contents)` prefixes are automatically cleaned for display
- Items within each category are sorted alphabetically (Domain and IP Research section)
- All URLs are validated to ensure they are safe HTTP/HTTPS links

## Customization

### Modifying Categories

Edit `awesome-osint.json` and add or update category entries. Categories will automatically:
- Sort alphabetically on page load
- Render as searchable cards
- Display with item counts

### Styling

Modify `styles.css` to adjust:
- Dark theme colors (CSS variables in `:root`)
- Card layout and spacing
- Search bar appearance
- Blog-specific styles

### Adding Blog Posts

Edit `blog.html` to add new `<article class="card post-card">` entries with:
- `<h2>` title (searchable)
- `.post-meta` (date, read time, author)
- `.card-body` (content, figures, code)
- `.tag-list` (topic tags)

## Dependencies

- **No external libraries required** for core functionality
- Pure HTML5, CSS3, and JavaScript (ES6+)
- Local JSON loading (requires HTTP server, not `file://`)
- Google Favicon API (for tool icons): `https://www.google.com/s2/favicons`

## Browser Support

- Modern browsers with ES6 support
- Tested on Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled

## Features in Detail

### Search & Clear Button

- **Input field** with magnifying glass icon on the left
- **Clear button (✕)** appears when text is entered
- Click **✕** to clear input and refocus
- Press **Escape** to clear input (index.html)

### Responsive Grid

- **3-column layout** on desktop
- **2-column layout** on tablets (max-width: 1200px)
- **1-column layout** on mobile (max-width: 980px)
- **Full-width search** on mobile

### Card Navigation

- **Collapse/Expand All** button toggles all category cards
- Individual cards expand/collapse via `<details>`
- First category opens by default
- **Item count** updates dynamically

### Blog Features

- **Centered, italic figure captions** for embedded images
- **Inline links** to external tools (e.g., Favicon Hasher)
- **Code blocks** with dark background
- **Tag chips** for topic categorization

## Development

### Sorting Utilities

The "Domain and IP Research" section was sorted alphabetically by tool name using a custom Python script. To replicate this for other sections, refer to the sorting logic in the project history.

### Search Implementation

Both `osint-cards.js` (main directory) and `blog.html` (blog) implement real-time filtering:
- **osint-cards.js**: Filters items and shows/hides categories based on match
- **blog.html**: Filters posts by title or body content

## Contributing

To contribute tools or resources:

1. Edit `awesome-osint.json` to add new entries
2. Follow the existing format (name, URL, description)
3. Ensure URLs are valid and point to legitimate resources
4. Test search functionality for new entries
5. Submit a pull request

## License

This project is open-source. Refer to the main repository for license details.

## Resources

- **AwesomeOSINT**: https://github.com/jivoi/awesome-osint
- **Shodan**: https://www.shodan.io/
- **Favicon Hasher**: https://faviconhasher.codejavu.tech/

## Support

For issues, suggestions, or contributions, please visit the project repository:
https://github.com/collstock/os1nt

---

**Last Updated**: December 28, 2025  
**Maintained by**: OS1NT R3P0 Community
