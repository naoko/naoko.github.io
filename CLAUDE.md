# naoko.github.io

Personal blog. Hugo + the `hugo-theme-cleanwhite` submodule. Posts live in `content/posts/`, images in `static/images/<post-date>/`.

Build check before committing a post:

```bash
hugo --quiet --buildFuture
```

## Writing style

The single most important thing: **posts must not read as AI-written.** Naoko can spot the patterns, and so can her readers. Watch for these specifically.

### The fragment-escalation tic

The worst offender. A short declarative sentence followed by a sentence fragment that repeats its structure for emphasis:

> That is not a course you warm up for. That is a course you save everything for.
>
> The course goes up. That's really the whole description.
>
> Slower. In the same clouds.

One of these in a post is a flourish. Three is a drumbeat, and every paragraph starts landing with the same rhythm. Vary sentence length instead, and let the plain statement stand on its own without the echo.

### Stock setup lines

Delete on sight: "Here's the moment I knew…", "Here's the thing nobody tells you about…", "Here's the part that actually explains…". They announce a reveal instead of just telling it.

### Naoko's actual voice

Read `2026-01-10-avalon-50-miles.md` and `2025-09-07-imogene-run.md` before drafting. The register is:

- Conversational, with hedges — "pretty intimidated", "kind of a cute scene"
- Longer sentences that run on a little, not clipped punchy ones
- Self-deprecation stated flatly, never performed ("wobbly baby giraffe", "legs like squid legs")
- Occasional direct address or rhetorical question
- Gratitude at the end, specific rather than general

### On race results

Don't apologize for finishing times, and don't inflate them either. State the number plainly and give the context that makes it meaningful — field composition, age distribution, cutoffs, weather. Let the reader draw the conclusion.

`ultrasignup.com` results pages only render the top 10 per gender. The full field is available as JSON:

```
https://ultrasignup.com/service/events.svc/results/<did>/1/json
```

Pull it when writing a race report — median times and age distribution are usually the interesting part, and they aren't visible on the page.

## Post conventions

- **No H1 in the body.** The theme renders the front-matter `title` as the H1; a body `#` heading duplicates it. (Older posts do this wrong — don't copy them.)
- **Date = race date**, matching existing posts. Note this can slot a post below newer ones in the index.
- Front matter needs both `image:` and `cover.image:` pointing at the same file.
- Embed YouTube with Hugo's shortcode, `{{< youtube VIDEOID >}}`, not a bare link.

## Photos

Phone photos are 3–7 MB each with EXIF orientation flags. Before committing, resize and bake in the rotation:

```python
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')  # bake rotation into pixels
im.thumbnail((2000, 2000), Image.LANCZOS)
im.save(dst, 'JPEG', quality=85, optimize=True, progressive=True)  # no exif= -> metadata stripped
```

This typically cuts a post's images by ~90%.

**Never rotate with `sips -r`.** It leaves a bogus EXIF orientation flag, so the image looks correct in Preview but renders sideways in the browser. Check a suspect file with PIL tag 274; fix with `jpegtran -copy none`.

Always verify rendered orientation before committing, rather than trusting the flag:

```bash
browse goto http://127.0.0.1:1313/posts/<slug>/
browse js "JSON.stringify(Array.from(document.querySelectorAll('article img')).map(i=>({src:i.currentSrc.split('/').pop(),nw:i.naturalWidth,nh:i.naturalHeight,ok:i.complete&&i.naturalWidth>0})))"
```
