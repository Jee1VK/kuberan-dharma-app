import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\Admin\.gemini\antigravity\scratch\dharma-learning-app"
STORE_DIR = os.path.join(BASE_DIR, "store_assets")

# Colors
MAROON = (107, 29, 47)         # #6B1D2F
DARK_MAROON = (65, 14, 27)    # #410E1B
GOLD = (197, 160, 89)          # #C5A059
DEEP_GOLD = (143, 110, 40)     # #8F6E28
IVORY = (250, 250, 247)        # #FAFAF7
PARCHMENT = (243, 239, 230)    # #F3EFE6
SLATE = (28, 25, 23)           # #1C1917
STONE = (87, 83, 78)           # #57534E
SAND = (228, 222, 200)         # #E4DEC8

def get_font(size, bold=False):
    # Try system fonts
    font_names = [
        "C:\\Windows\\Fonts\\georgiab.ttf" if bold else "C:\\Windows\\Fonts\\georgia.ttf",
        "C:\\Windows\\Fonts\\timesbd.ttf" if bold else "C:\\Windows\\Fonts\\times.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
    ]
    for fn in font_names:
        if os.path.exists(fn):
            try:
                return ImageFont.truetype(fn, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_gradient_rect(img, x0, y0, x1, y1, c1, c2, vertical=True):
    draw = ImageDraw.Draw(img)
    if vertical:
        height = max(1, y1 - y0)
        for i in range(height):
            ratio = i / height
            r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
            g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
            b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
            draw.line([(x0, y0 + i), (x1, y0 + i)], fill=(r, g, b))
    else:
        width = max(1, x1 - x0)
        for i in range(width):
            ratio = i / width
            r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
            g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
            b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
            draw.line([(x0 + i, y0), (x0 + i, y1)], fill=(r, g, b))

def create_feature_graphic():
    w, h = 1024, 500
    img = Image.new("RGB", (w, h), MAROON)
    draw_gradient_rect(img, 0, 0, w, h, (90, 20, 38), (50, 10, 20), vertical=False)
    draw = ImageDraw.Draw(img)

    # Decorative gold frame
    draw.rectangle([16, 16, w - 17, h - 17], outline=GOLD, width=2)
    draw.rectangle([22, 22, w - 23, h - 23], outline=DEEP_GOLD, width=1)

    # Load and place Kuberan watermark/crest
    wm_path = os.path.join(BASE_DIR, "public", "images", "kuberan_watermark_emblem.png")
    if os.path.exists(wm_path):
        wm = Image.open(wm_path).convert("RGBA")
        wm = wm.resize((120, 210), Image.Resampling.LANCZOS)
        # alpha paste with subtle opacity
        r, g, b, a = wm.split()
        a = a.point(lambda p: int(p * 0.25))
        img.paste(wm, (w - 240, 40), mask=a)

    # Logo on left
    logo_path = os.path.join(BASE_DIR, "public", "images", "app-icon-192.png")
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        logo = logo.resize((110, 110), Image.Resampling.LANCZOS)
        img.paste(logo, (56, 56), mask=logo)

    # Typography
    f_badge = get_font(14, bold=True)
    f_title = get_font(42, bold=True)
    f_sub = get_font(20, bold=False)
    f_pills = get_font(15, bold=True)

    draw.text((180, 62), "SACRED MICRO-WISDOM · KUBERAN SILKS", font=f_badge, fill=GOLD)
    draw.text((180, 86), "KUBERAN DHARMA", font=f_title, fill=IVORY)
    draw.text((180, 140), "Timeless Wisdom from Ramayana to the Gita, in Bite-Sized Cards", font=f_sub, fill=PARCHMENT)

    # Highlights banner cards
    card_items = [
        ("Bhagavad Gita & Epics", "18 Chapters · 700 Verses"),
        ("Shloka Chanting & Audio", "Japa Counter (1x, 3x, 108x)"),
        ("6 Indian Languages", "EN · HI · KN · SA · TA · TE"),
        ("100% Offline Access", "Distraction-Free Habit"),
    ]

    cx = 56
    cy = 220
    cw = 210
    ch = 130
    for idx, (head, sub) in enumerate(card_items):
        box_x0 = cx + idx * (cw + 24)
        box_y0 = cy
        box_x1 = box_x0 + cw
        box_y1 = box_y0 + ch

        # Card background
        draw.rectangle([box_x0, box_y0, box_x1, box_y1], fill=(80, 18, 34), outline=GOLD, width=1)
        draw.line([box_x0, box_y0, box_x1, box_y0], fill=GOLD, width=3)
        draw.text((box_x0 + 12, box_y0 + 20), head, font=f_pills, fill=IVORY)
        draw.text((box_x0 + 12, box_y0 + 55), sub, font=get_font(12), fill=PARCHMENT)
        draw.text((box_x0 + 12, box_y0 + 90), "Explore →", font=get_font(12, bold=True), fill=GOLD)

    # Bottom status bar
    draw.line([56, 420, w - 56, 420], fill=DEEP_GOLD, width=1)
    f_footer = get_font(13)
    draw.text((56, 440), "Chickpet Heritage · Standalone App · No Ads · Free Universal Dharma", font=f_footer, fill=PARCHMENT)
    draw.text((w - 280, 440), "Available on Android & iOS", font=f_footer, fill=GOLD)

    out_path = os.path.join(STORE_DIR, "android", "feature-graphic-1024x500.png")
    img.save(out_path, "PNG")
    print(f"Generated {out_path}")

def create_screenshot(w, h, screen_num, headline, subheadline, card_content, platform="android"):
    img = Image.new("RGB", (w, h), IVORY)
    draw = ImageDraw.Draw(img)

    scale = w / 1080.0

    # Top header bar
    top_bar_h = int(320 * scale)
    draw_gradient_rect(img, 0, 0, w, top_bar_h, MAROON, (80, 16, 32), vertical=True)

    f_top = get_font(int(26 * scale), bold=True)
    f_head = get_font(int(46 * scale), bold=True)
    f_sub = get_font(int(24 * scale), bold=False)

    draw = ImageDraw.Draw(img)
    draw.text((int(50 * scale), int(60 * scale)), "KUBERAN DHARMA", font=f_top, fill=GOLD)
    draw.text((int(50 * scale), int(110 * scale)), headline, font=f_head, fill=IVORY)
    draw.text((int(50 * scale), int(180 * scale)), subheadline, font=f_sub, fill=PARCHMENT)

    # Device Phone Mockup Frame
    fx0 = int(70 * scale)
    fy0 = int(270 * scale)
    fx1 = w - int(70 * scale)
    fy1 = h - int(80 * scale)

    # Outer phone shadow / border
    draw.rounded_rectangle([fx0, fy0, fx1, fy1], radius=int(40 * scale), fill=PARCHMENT, outline=SAND, width=int(4 * scale))
    draw.line([fx0, fy0 + int(6 * scale), fx1, fy0 + int(6 * scale)], fill=GOLD, width=int(4 * scale))

    # Inner Card Container
    cx0 = fx0 + int(40 * scale)
    cy0 = fy0 + int(50 * scale)
    cx1 = fx1 - int(40 * scale)
    cy1 = fy1 - int(50 * scale)

    draw.rounded_rectangle([cx0, cy0, cx1, cy1], radius=int(32 * scale), fill=IVORY, outline=SAND, width=int(2 * scale))

    # Render Card Mockup Details
    card_title, citation, devanagari, translation, layer3 = card_content

    # Citation badge
    draw.rounded_rectangle([cx0 + int(30 * scale), cy0 + int(35 * scale), cx0 + int(360 * scale), cy0 + int(85 * scale)], radius=int(12 * scale), fill=(245, 230, 235), outline=MAROON, width=int(1.5 * scale))
    draw.text((cx0 + int(45 * scale), cy0 + int(46 * scale)), citation, font=get_font(int(18 * scale), bold=True), fill=MAROON)

    # Card Title
    draw.text((cx0 + int(30 * scale), cy0 + int(115 * scale)), card_title, font=get_font(int(30 * scale), bold=True), fill=SLATE)

    # Devanagari Box
    box_y0 = cy0 + int(210 * scale)
    box_y1 = box_y0 + int(320 * scale)
    draw.rounded_rectangle([cx0 + int(25 * scale), box_y0, cx1 - int(25 * scale), box_y1], radius=int(24 * scale), fill=PARCHMENT, outline=GOLD, width=int(2 * scale))
    
    # Sacred Om icon
    draw.text((cx0 + int(430 * scale), box_y0 + int(25 * scale)), "ॐ", font=get_font(int(36 * scale), bold=True), fill=DEEP_GOLD)
    draw.text((cx0 + int(50 * scale), box_y0 + int(90 * scale)), devanagari, font=get_font(int(28 * scale), bold=True), fill=MAROON)

    # Audio Chanting Bar inside card
    draw.rounded_rectangle([cx0 + int(50 * scale), box_y1 - int(90 * scale), cx1 - int(50 * scale), box_y1 - int(25 * scale)], radius=int(16 * scale), fill=MAROON)
    draw.text((cx0 + int(80 * scale), box_y1 - int(72 * scale)), "▶  Listen to Shloka Chanting (Japa 1x · 3x · 108x)", font=get_font(int(18 * scale), bold=True), fill=IVORY)

    # Layer 1: Translation Box
    t_y0 = box_y1 + int(40 * scale)
    draw.text((cx0 + int(30 * scale), t_y0), "LAYER 1 · PLAIN LANGUAGE TRANSLATION", font=get_font(int(16 * scale), bold=True), fill=STONE)
    draw.text((cx0 + int(30 * scale), t_y0 + int(35 * scale)), translation, font=get_font(int(22 * scale)), fill=SLATE)

    # Layer 3: Modern Life Application Box
    a_y0 = t_y0 + int(240 * scale)
    draw.rounded_rectangle([cx0 + int(25 * scale), a_y0, cx1 - int(25 * scale), a_y0 + int(280 * scale)], radius=int(20 * scale), fill=(255, 248, 235), outline=GOLD, width=int(1.5 * scale))
    draw.text((cx0 + int(45 * scale), a_y0 + int(25 * scale)), "LAYER 3 · EVERYDAY WORKPLACE & LIFE APPLICATION", font=get_font(int(16 * scale), bold=True), fill=DEEP_GOLD)
    draw.text((cx0 + int(45 * scale), a_y0 + int(70 * scale)), layer3, font=get_font(int(21 * scale)), fill=SLATE)

    # Action buttons at bottom of phone
    btn_y0 = cy1 - int(120 * scale)
    draw.rounded_rectangle([cx0 + int(30 * scale), btn_y0, cx0 + int(400 * scale), btn_y0 + int(70 * scale)], radius=int(18 * scale), fill=MAROON)
    draw.text((cx0 + int(70 * scale), btn_y0 + int(20 * scale)), "✓ Mark Reflected", font=get_font(int(20 * scale), bold=True), fill=IVORY)

    draw.rounded_rectangle([cx1 - int(380 * scale), btn_y0, cx1 - int(30 * scale), btn_y0 + int(70 * scale)], radius=int(18 * scale), fill=PARCHMENT, outline=GOLD, width=int(1.5 * scale))
    draw.text((cx1 - int(340 * scale), btn_y0 + int(20 * scale)), "🔖 Save to Stash", font=get_font(int(20 * scale), bold=True), fill=MAROON)

    out_dir = os.path.join(STORE_DIR, "screenshots", platform)
    os.makedirs(out_dir, exist_ok=True)
    filename = f"{screen_num}.png"
    out_path = os.path.join(out_dir, filename)
    img.save(out_path, "PNG")
    print(f"Generated {out_path} ({w}x{h})")

if __name__ == "__main__":
    create_feature_graphic()

    screens = [
        (
            "01_shloka_of_the_day",
            "Shloka of the Day & Audio",
            "Sacred Sanskrit Recitations with Japa Counter",
            (
                "Focus on Effort, Release Outcome",
                "BHAGAVAD GITA · 2.47",
                "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
                "You have a right only to perform your duties, never to the\nfruits of action. Never consider yourself the cause of results,\nnor succumb to mental inaction.",
                "Prepare and execute with 100% effort, but disconnect your\nself-worth from whether praise arrives today. Detachment from\noutcome protects you from burnout and performance anxiety."
            )
        ),
        (
            "02_scripture_corpus_reader",
            "The 5 Sacred Scripture Corpuses",
            "Bhagavad Gita, Ramayana, Mahabharata, Vedas & Puranas",
            (
                "The Duty of Courage in Crisis",
                "VALMIKI RAMAYANA · AYODHYA KANDA",
                "धर्मादर्थः प्रभवते धर्मात् प्रभवते सुखम् ।\nधर्मेण लभते सर्वं धर्मसारमिदं जगत् ॥",
                "From righteousness (dharma) flows wealth, happiness, and peace.\nThrough adherence to dharma, everything noble is attained;\ndharma is the foundation of the universe.",
                "In moments of career dilemma or personal leadership,\nalways choose ethical integrity over short-term expediency.\nDharma builds timeless character."
            )
        ),
        (
            "03_curated_stashes_search",
            "Curated Stashes & Offline Search",
            "Organized Wisdom Packs for Work, Family, & Inner Peace",
            (
                "Mastery of the Mind and Senses",
                "STASH: KRISHNA MENTAL MODELS",
                "जितात्मनः प्रशान्तस्य परमात्मा समाहितः ।\nशीतोष्णसुखदुःखेषు तथा मानापमानयोः ॥",
                "For one who has conquered the mind, supreme tranquility is\nattained in cold and heat, pleasure and pain, honor and dishonor.",
                "Build emotional resilience by observing triggers before\nreacting. A steady mind remains unshaken by external turbulence\nor organizational shifts."
            )
        ),
        (
            "04_daily_streak_habit",
            "Daily Spiritual Habit & Reflection",
            "Track Your Reading Streak with 100% Offline Access",
            (
                "Equanimity in All Circumstances",
                "BHAGAVAD GITA · 2.48",
                "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥",
                "Be steadfast in yoga, perform your duty without selfish\nattachment, remaining equal in both success and failure.",
                "Cultivate psychological balance during quarterly milestones.\nCelebrate wins without arrogance, absorb setbacks without despair."
            )
        )
    ]

    # Generate Android Screenshots (1080x2400)
    for s_num, h1, h2, content in screens:
        create_screenshot(1080, 2400, s_num, h1, h2, content, platform="android")

    # Generate iOS Screenshots (1290x2796)
    for s_num, h1, h2, content in screens:
        create_screenshot(1290, 2796, s_num, h1, h2, content, platform="ios")
