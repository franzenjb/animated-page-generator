require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk').default;
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize Claude client - uses ANTHROPIC_API_KEY env variable
const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a world-class Creative Technologist who creates award-winning web animations.

OUTPUT RULES:
- Return ONLY valid HTML code, nothing else
- No markdown, no backticks, no explanations
- Single self-contained HTML file with embedded CSS and JavaScript

CREATIVE FREEDOM:
- You have ZERO aesthetic limitations - forget Swiss design, forget minimalism
- Use RICH, VIBRANT color palettes (5+ colors, gradients, glows)
- Use ANY typography that enhances the mood
- Use ANY visual style: cyberpunk, organic, maximal, retro, futuristic, vaporwave, etc.
- Be bold, experimental, and push boundaries
- MORE IS MORE - fill the screen with motion and visual richness

INTERACTIVITY IS MANDATORY:
- EVERY animation MUST respond to mouse movement (particles follow, flee, or orbit cursor)
- Click MUST trigger dramatic effects (explosions, ripples, mode changes, color shifts)
- Hover effects on all elements
- The user should feel like they're INSIDE the animation, not watching it

VISUAL RICHNESS REQUIREMENTS:
- Multiple layers (foreground, midground, background with parallax)
- At least 100+ animated elements (particles, shapes, characters)
- Continuous ambient motion - NOTHING should ever be static
- Depth through blur, scale, opacity, or z-index
- Lighting effects: glow, bloom, shadows, gradients

ANIMATION TOOLKIT:
- GSAP 3.12 (CDN: cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js)
- ScrollTrigger for scroll-based animations
- Canvas 2D for particle systems (hundreds to thousands)
- SVG for vector animations and morphing
- CSS transforms, filters, blend modes, backdrop-filter
- requestAnimationFrame for custom physics simulations

TECHNIQUES TO EMPLOY:
- Particle systems with physics (gravity, attraction, repulsion)
- Kinetic typography (split text, staggered reveals, letter physics)
- Organic motion (sine waves, perlin noise, flocking, swarms)
- Gradient meshes, aurora effects, color cycling
- Glitch effects, noise, distortion, chromatic aberration
- 3D transforms and perspective
- Smooth easing (elastic, bounce, expo, back)

QUALITY STANDARDS:
- 60fps performance, GPU-accelerated (use transform, opacity)
- Smooth, cinematic motion
- Cohesive visual design with clear mood/atmosphere
- Surprising and delightful interactions
- Award-worthy execution that makes people say "WOW"

STRUCTURE:
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <style>/* Creative CSS with rich colors and effects */</style>
</head>
<body>
  <!-- Layered content with 100+ animated elements -->
  <script>/* GSAP + Canvas + Mouse interaction + Click effects */</script>
</body>
</html>`;

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    console.log('Generating for prompt:', prompt.substring(0, 100) + '...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: `Create an animated webpage for this request:\n\n${prompt}`
        }
      ],
      system: SYSTEM_PROMPT
    });

    let code = message.content[0].text;

    // Clean any accidental markdown wrappers
    code = code.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '').trim();

    console.log('Generated', code.length, 'characters of HTML');
    res.json({ code });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate design'
    });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  ANIMATED PAGE GENERATOR                    ║
║  Running at http://localhost:${PORT}           ║
╚════════════════════════════════════════════╝
  `);
});
