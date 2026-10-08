# CMS Guide Editor's Manual

For editors and content managers using Sveltia CMS. **No coding required.**

##  How to Login

1. Open: **https://ii-preview.bclabum.si/admin**
2. Click **"Login with GitHub"**
3. Authenticate with your GitHub account (must be repo contributor)
4. You're now in the CMS!

##  What Can You Edit?

The CMS has these collections:

| Collection | What is it? | Where appears on site |
|-----------|-----------|----------------------|
| **News** | Articles with photos | /news, homepage |
| **Achievements** | Awards, conferences, successes | /achievements |
| **Staff** | Institute members | /staff |
| **Laboratories** | Research labs | /laboratories |
| **Interest Groups** | Clubs and special groups | /interest-groups |
| **Study Programs** | Bachelor/Master programs | /studies |
| **Student Projects** | Student projects | /studies/student-projects |
| **Research Projects** | R&D projects | /research/projects |
| **Conferences** | Conferences, seminars | /conferences |
| **Industry Partners** | Partners | /industry |
| **Ethics Opinion** | Ethics committee opinions | /research/ethics |
| **Hero Slides** | Homepage carousel images | Homepage |
| **Featured Content** | What shows on homepage | Homepage |

##  How to Edit Content?

### Example: Add a New News Article

1. In the CMS, click **"News"**
2. Click **"+ New"** (green button)
3. Fill in the fields:
   - **Title** — article title
   - **Date** — publication date
   - **Tags** — choose one or more (student, conference, award, etc.)
   - **Summary** — brief summary (50-100 words)
   - **Cover Image** — main photo (click to upload)
   - **Additional Images** — if you need more photos
   - **Full Content** — main article text (with formatting)

4. Click **"Save"**
5. Auto publishes! 

### Example: Edit Existing News

1. Go to **"News"**
2. Click the article from the list
3. Edit what you need
4. Click **"Save"**

### Example: Delete a News Article

1. Go to **"News"**
2. Click the article
3. Click **"..."** (menu) → **"Delete"**
4. Confirm

### Tags (Multiple Choice)

- **Tags** — choose one or more from:
  -  Student
  -  Conference
  -  Scientific
  -  Professional
  -  Project
  -  Awards
  -  Interest Groups

### Relations (Special)

- **Featured Content** — select which news, achievements, projects appear on homepage
- Click → search → select

##  Text Formatting (Markdown)

In **text** fields, you can use:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- First point
- Second point

1. First
2. Second

> A quote

[Link text](https://example.com)
```

##  How to Add Images?

### Cover Image

Field **"Cover Image"** → click → upload

Recommended:
- Format: JPG or PNG
- Size: ~1200x800px (landscape)
- Compress to < 500 KB

### Additional Images (Gallery)

Field **"Additional Images"** / **"Images"** → click field → **"Add new"** → upload

Each image appears in the gallery on the page.

##  How to Add Videos?

Only for **Achievements**:

1. In **"Videos"** field → click **"Add new"**
2. Enter URL or local path:
   - **URL:** `https://example.com/video.mp4`
   - **Local:** `/assets/media/video.mp4`
3. Click "Save"

##  Collection-Specific Tips

### News

- Date is required (publication date)
- Summary is required (brief text)
- Tags help with filtering on `/news`
- Images are auto-optimized

### Achievements

- Title is required
- Date is **optional** (leave blank if unknown)
- Subtitle is optional
- Videos are optional
- Tags help with categorization

### Staff

- Full name is required
- Photo is optional (if uploaded, it displays)
- Select **section**: director, professor, assistant, etc.
- All other fields are optional

### Laboratories / Interest Groups

- Name is required
- Description is required
- External link is optional (URL)

##  Languages

The CMS is in **English**. The website has a **Slovenian version** (default) and **English version** (`/en/`).

##  Hero Carousel (Hero Slides)

This controls the homepage carousel:

1. Go to **"Hero Slides"**
2. Click one
3. Edit:
   - **Title** — large text
   - **Subtitle** — small text
   - **Image** — background (should be landscape)
   - **Order** — 1, 2, 3... (sequence on homepage)
4. Click "Save"

To add a new slide, click **"+ New"**.

##  Featured Content

What appears on the homepage:

1. Go to **"Site Config"** → **"Featured Content"**
2. In each field (**News**, **Achievements**, **Projects**) select 2-3 items
3. Click **"Save"**

Changes appear on homepage immediately (or wait 2 minutes for rebuild).
