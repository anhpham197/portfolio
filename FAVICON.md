# Team panther favicon

The owner supplied the panther artwork to represent their current NAB team. It is used only as the site's favicon and touch icon; the navigation wordmark remains the owner's name.

Mode: built-in `image_gen.imagegen`, image edit, `background-extraction`, transparent background.

Final edit prompt:

> Use case: background-extraction. Asset type: transparent favicon source for the user's personal portfolio. Image 1 is the EDIT TARGET: the supplied close-up of the Pink Panther wearing black sunglasses on a flat pink backdrop. Remove the flat pink background and the curved background lettering 'PINK PANTHER'. Preserve the panther's original pink face coloring, nose, muzzle, black sunglasses, eyebrows, ears, whiskers, linework, expression, and original illustration style. Do not redesign or recolor the character. Isolate the head as a clean faithful cutout, center it on a square fully transparent canvas with a small transparent safety margin so the eyebrows and whiskers are not clipped. Retain the close-up face composition; do not add a body, objects, text, border, shadow, badge, or colored tile. Produce genuine alpha transparency, not a checkerboard illustration.

Project assets:

- `public/panther-source.png`: selected transparent edit, preserved at its original generated resolution.
- `public/favicon-16.png`, `public/favicon-32.png`, `public/favicon-48.png`: browser icons.
- `public/favicon.ico`: a multi-size icon containing 16, 32, and 48 pixel PNG entries.
- `public/apple-touch-icon.png`: 180 pixel touch icon.
- `public/icon-192.png`, `public/icon-512.png`: additional square PNG sizes.

PNG size variants preserve alpha. The ICO packages the small PNGs without changing their pixels.
