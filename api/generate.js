import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are an elite Creative Technologist specializing in kinetic web animations.

OUTPUT RULES:
- Return ONLY valid HTML code, nothing else
- No markdown, no backticks, no explanations
- Single self-contained HTML file with embedded CSS and JavaScript

AESTHETIC GUIDELINES:
- 1960s Swiss Design: Helvetica, bold typography, geometric precision
- Organic Matisse-inspired shapes and cutouts
- Color palette: Black, white, crimson red (#E63946), cream (#F1FAEE)
- High-end museum quality feel

ANIMATION REQUIREMENTS:
- Use GSAP (load from CDN: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js)
- Include ScrollTrigger if scroll animations needed
- Smooth, sophisticated easing (power2.inOut, elastic, back)
- Kinetic typography, floating shapes, parallax effects
- 60fps performance, GPU-accelerated transforms

STRUCTURE:
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <style>/* Swiss + Matisse CSS */</style>
</head>
<body>
  <!-- Content -->
  <script>/* GSAP Animations */</script>
</body>
</html>`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

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
    code = code.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '').trim();

    res.json({ code });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate design'
    });
  }
};
