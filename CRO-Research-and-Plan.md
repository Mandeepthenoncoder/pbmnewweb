# Pearls by Mangatrai — Conversion Research & Redesign Plan
*Goal: lift site conversion from 0.5% to 3%+ on Meta-driven traffic. Prepared 17 Sep 2026.*

## 1. Where the current site loses people (audit of pearlsbymangatrai.com)

Theme: Shopify **Focal** (Maestrooo). Apps detected: Judge.me, Simpl (Pay-in-3), GoKwik, Klaviyo, Shiprocket, WhatsApp chat, "Pretty Sales" purchase popups.

| # | Problem observed | Why it costs conversions |
|---|---|---|
| 1 | **Three interruptions on first paint**: newsletter modal + photo modal + "Koel just bought…" toast, plus 3 floating buttons (WhatsApp, video, back-to-top) | Cold Meta traffic decides in ~3s. Popups on load are the #1 bounce driver; ConvertCart measures a 10–20% conversion drag from aggressive popups. |
| 2 | **Hero sells "Discover Akoya Pearls"** (a ₹60k–₹1.7L niche) | Bestsellers are ₹1.8k–₹13k freshwater sets. The hero should sell what people actually buy and mirror the ad promise. |
| 3 | **Blank sections while scrolling** (lazy-loaded blocks, ~1MB PNG hero) and the mobile PDP renders a large empty image box for seconds | Every 1s of load costs ~7% conversion; 53% of mobile users leave after 3s. |
| 4 | **PDP has no reviews visible** (Judge.me badge hidden at 0 rating), no photo reviews | Photo reviews are the strongest trust signal for jewellery; reviews without photos are 30–40% less persuasive. |
| 5 | **Titles are SEO strings** ("Single-Row White Oval-Shaped Graded Freshwater Pearl Necklace Set with Matching Bracelet – 3.5–8.0mm, A Quality") | Unreadable on a phone card; the spec belongs in the spec table. |
| 6 | **"Tax included. Shipping calculated at checkout"** under the price, even though shipping is free | Creates cost uncertainty. Baymard: 67% of sites fail to show total cost near the buy button; unexpected costs are the top abandonment reason. |
| 7 | **No delivery date, no COD/UPI/EMI signalling near Add to Cart**; spec table overflows horizontally on mobile | Indian buyers convert on "delivered by Sat, 20 Sep" + visible COD. 40–45% of jewellery orders in India are COD. |
| 8 | **No budget-based navigation, no gifting path** | 65% of Missoma's revenue is gift-motivated; gifters shop by budget and occasion, not by pearl type. |
| 9 | **Nav is organised by pearl type / stone / colour** (39 collections) | Cold visitors don't know Akoya from Keshi. Navigation should follow how people shop: category → budget → occasion. |
| 10 | **No landing page for ads** — ads land on PDPs or the homepage | For cold traffic, dedicated landing pages convert 3–5× better than a PDP (headline mirrors the ad, one CTA, no exits). |

## 2. What the research says works (jewellery, India, Meta traffic)

**Benchmarks.** Jewellery converts at 0.9–1.2% on average; fashion/demi-fine jewellery in the ₹1k–₹15k band runs 1.2–4.5%; top-20% stores exceed 2%. Well-optimised Indian D2C stores sit at 1.5–2.5%. 3% is ambitious but realistic for a ₹665–₹13k catalogue with a 119-year brand, provided ad traffic is warm and the site removes friction. Expect to get there in layers: site fixes (0.5→1.5%), landing pages + offer (→2.2%), reviews/UGC + WhatsApp + retention (→3%).

**Mobile first, literally.** 78–83% of Meta landing sessions are on phones. Trust signals, price, and Add to Cart must sit above the fold; a sticky Add to Cart bar is table stakes; tap targets ≥44px; keep the page under 3s on 4G.

**Product page (Baymard 2026 + jewellery-specific).**
- Scale/on-model images (37% of sites lack them; 42% of users try to judge size from photos).
- Total cost near the buy button, delivery date not "3–5 days".
- Returns policy and guarantee visible next to Add to Cart, not in the footer.
- Photo reviews with merchant replies (89% of sites never reply to negative reviews; replying builds trust).
- Gifting options on the PDP (78% of sites miss this).
- Button selectors, not dropdowns, for variants.

**India-specific.** Show COD prominently (fee optional to reduce RTO), UPI first in checkout, 0% EMI above ₹1,500, GST invoice, physical address and showrooms, BIS/certificate badges near the price, "As seen in" press. WhatsApp: 70–90% open rate for abandoned-cart nudges vs 15–25% for email; 83% of WhatsApp-driven festive orders were first-time buyers (GoKwik 2026).

**Meta ads traffic.** Send cold traffic to a dedicated landing page or a merchandised collection, not a PDP: headline repeats the ad, single CTA repeated 4–5×, no nav, plain-language shipping/COD/returns, one offer code. Sales-page structure: reason to care → offer → products → proof → comparison → how it works → FAQ → CTA. Match the offer in the ad exactly (30% online + WELCOME5).

**AOV levers.** Bundles ("complete the look", 10% off), gift boxes, free-gift threshold set 20–30% above current AOV, post-purchase flows (10–15% of revenue).

## 3. What the prototype implements (open `prototype/index.html`)

**Global**
- Single slim rotating announcement bar (free shipping / 119 years / COD-UPI-EMI / WELCOME5). No popups on load.
- Header: hamburger, search, logo, account, cart. Desktop nav ordered by how people shop: Necklaces · Earrings · Sets · Bracelets · Rings · **Under ₹5,000** · Gifting · Our Story.
- Cart drawer: free-shipping status, free-gift threshold bar, "complete the look" upsell, Checkout + "Order on WhatsApp", payment logos, dispatch note.
- One WhatsApp button, bottom right, above the sticky bar.
- Fonts: Cormorant Garamond (heritage) + Manrope (legibility). Palette: brand navy, ivory, gold accent.

**Homepage** (order = objections in the order a cold visitor has them)
1. Hero: "Real pearls. Honest prices. Since 1905." Offer pill mirrors ad copy. CTA "Shop bestsellers" + "Gifts under ₹5,000". Social proof (avatars, 4.8★, 5,000+ customers) in the hero.
2. Trust strip: certified · free shipping & returns · 119 years · COD/UPI/EMI.
3. Shop by category (circles, 6) → 4. Shop by budget (4 tiles) → 5. Bestsellers grid.
6. Why Mangatrai (story + 4 guarantees + stats) → 7. Photo reviews → 8. Gifting band → 9. Talk to us (WhatsApp / video / showrooms).

**Collection page**
- Sticky filter chips on mobile (Sets, Necklaces, Earrings…, Under ₹2,000, Under ₹5,000, Gift boxes) + sort.
- Desktop sidebar: price, colour, occasion, WhatsApp help box.
- Promise card injected after the 6th product ("Real pearls or your money back").
- Cards: 4:5 image, hover second image, badge, wishlist, rating + count, short title, price + MRP + % off, EMI or COD line, Add to bag.

**Product page**
- Swipeable gallery with dots (thumbnails on desktop), badge.
- Short title → rating + review count + "5,000+ sold" → price, MRP, "Save 30% · ₹2,250" → "Inclusive of all taxes · Free shipping · No hidden charges" → Simpl 3× EMI line.
- Button-style variant selectors (finish, length with plain-English hint).
- Stock + dispatch line, 3 CTAs in priority: Add to bag · Buy now (UPI/COD/Cards) · Ask on WhatsApp (see it on video).
- Pincode → delivery date, COD confirmation; same-day-dispatch countdown to the real 4pm cutoff.
- 4 assurance tiles (certificate, 7-day returns, lifelong guarantee, free gift box).
- "Complete the look" bundle, 10% off, one-click add all.
- Accordions: details (spec table that doesn't overflow), authenticity (certificate image), shipping/returns/COD, care.
- Reviews with photos and a merchant reply; related products; FAQ.
- Mobile sticky Add to bag appears once the main CTA scrolls out.

**Meta ads landing page** (`landing.html`)
- No nav. Logo + "Shop the offer" only. Headline mirrors the ad ("Real pearls, 30% off. Certified, guaranteed for life."). Offer card with code. CTA repeated 4×. Trust strip → 8 products → comparison table vs marketplace sellers → 3-step how it works → guarantee → photo reviews → CTA → FAQ.

## 3b. Banner strategy, mobile-first (added 17 Sep 2026)

**What the evidence says**
- 60–70% of top-performing Shopify stores use a single static hero, not a carousel (Inflow Best-in-Class). Baymard: 46% of carousels have usability issues, most users never see slide 2, and carousels must never autorotate on mobile. Verdict: one static hero, then tactical banners below it.
- Homepage sticky CTA: +20.4% conversion in a published Shopify test. Free-gift progress bar: +$50k/month. Free gift beats discount (+25% AOV, +26% email capture). "Hero + reviews + urgency" stack on a collection page: +$115k/month. Copy angle moves revenue more than "better" copy. (CONVERTIBLES case-study index.)
- Baymard 2025: reviews placed next to the CTA lift mobile conversion up to 12%.
- Indian mobile commerce (Myntra, Nykaa, CaratLane) trains users on story circles, peeking swipe rails, and a bottom nav bar; matching those patterns lowers learning cost for Meta traffic.

**What was added to the prototype**
| Placement | Banner | Job |
|---|---|---|
| Above hero | Story circles (New in · Under ₹999 · Gifting · Wedding · Office · Bestsellers · Bracelets · Video call) | Thumb-reach entry points by intent, app-familiar |
| Below hero | Promo rail, 4 cards, second card peeks (no autorotation) | Sale countdown · Studs from ₹665 (buy 2 save 10%) · Free gift box · See it on video |
| After categories | USP ticker | Repeats free shipping / COD / EMI / certificate / guarantee without a popup |
| After bestsellers | Wedding edit campaign (full-bleed, HTML text) + two mini tiles (Office & everyday, Stack & layer) | Occasion-led selling, price anchor "Sets from ₹5,250" |
| Before reviews | Countdown offer band with code | Urgency + single CTA; timer ends Sunday 23:59 IST |
| Before gifting | UGC grid, 6 shoppable tiles | Social proof with price captions |
| Before help | WhatsApp "see it on video" banner | India-specific trust closer |
| Mobile only | Bottom nav (Home · Gifts · Shop · WhatsApp · Bag) | Persistent CTA, +20% pattern; hidden on PDP where sticky Add-to-bag takes over |
| Collection | Offer strip under the title | Restates buy-2 offer at the decision point |
| Landing | Countdown under offer + sticky "Shop the offer" bar | Urgency and always-visible CTA for ad traffic |
| Cards | "+" quick-add in thumb zone (mobile) | One-tap add without leaving the grid |

**Rules kept:** every banner is HTML text (no text baked into images), one CTA each, no autorotation, no popups, all images lazy-loaded except the hero, and nothing depends on JS to be visible.

**Shopify mapping:** story circles = collection-list section with circular images; promo rail = multicolumn section with custom CSS; ticker = announcement bar app or custom section; campaign banners = image-with-text sections; countdown = Essential Countdown Timer app or the custom snippet; UGC grid = Instafeed or a manual gallery section; bottom nav = theme snippet in `layout/theme.liquid`.

Sources added: https://baymard.com/blog/homepage-carousel · https://www.wisoftsolutions.com/in/blog/sliders-and-banners-web-design · https://convertibles.dev/blogs/optimization/shopify-ab-test-case-studies · https://craftberry.co/articles/shopify-ab-test-examples · https://ecomhint.com/guides/homepage-optimization

## 3c. What IM8 Health does that we can borrow (reviewed 27 Sep 2026)

IM8 (David Beckham's supplement brand) is a subscription DTC store on Shopify. Apps visible: Klaviyo (email/SMS), Rebuy (upsell), Skio (subscriptions + referrals), Trustpilot (22,104 reviews), **Alia** (the "Try your luck" popup).

| IM8 pattern | What it does | PBM version |
|---|---|---|
| **"Try your luck" popup (Alia)** | Fires after a delay, not on load. Step 1: tap to reveal. Step 2: "You won 30% off + free gifts", asks for email. Step 3: code auto-applied. Everyone wins; the game makes an email capture feel like a prize. | **Built.** Pearl-themed match-3: six pearls face down, flip to reveal a gift, match three the same to win (reveal order is scripted so everyone wins by the fifth flip) → asks for **WhatsApp number** (India) → code PEARL10 / PEARL15 auto-applied for 48h with a countdown. Fires at 12s, 35% scroll or exit intent; once per 7 days; never on checkout. Reopen tab bottom-left shows the live code and timer. |
| Announcement bar with flash-offer countdown | "24-hour flash offer · Buy 3 get 1 free" with live timer | Already have: festive countdown band + rotating bar. |
| Hero = one celebrity quote + review count + single CTA | Lily Collins quote, 4.8 from 22,104, one button | Same structure; for PBM the "celebrity" is heritage + Hyderabad brides. Add real Judge.me count to hero when live. |
| Ambassador slider | 12 athletes/doctors with one-line quotes | Replace with **customer + stylist voices**: brides, working women, a jeweller's note from the family. Same card format. |
| Press logos strip | Forbes, NBC, Time | Add "As featured in" strip once you have 3 to 5 Indian press or influencer mentions. High trust value in India. |
| Free Welcome Kit on first order, itemised with rupee values | "$80 value: sachets $18, mixer $18, bottle $44" | Itemise our gift: navy box, velvet pouch, care cloth, certificate, handwritten note = "₹450 value, free". Put on PDP under price. |
| Lab-verified report link | "Lab-verified by Light Labs, 50 substances screened, see report" | Link the certificate of authenticity as a downloadable sample and add the grading scale (A to AAAA). |
| 90-day money-back guarantee, repeated 3 to 4 times | Risk reversal near every CTA | We have 15-day returns + lifelong guarantee; repeat them under every Add to bag like IM8 does. |
| Stats grid | "65M servings, 470k customers" | "Since 1905 · 15 showrooms · 5,000+ online customers · 4.8 rating". Already partially present. |
| Bundle named after founder ("The Beckham Stack") | Story-named bundle at higher AOV | Name the top combo: "The Mangatrai Bridal Set", "The Charminar Box". Names sell better than SKUs. |
| Referral (Skio) | Give/get discount | Later: WhatsApp-native referral, give ₹500 get ₹500 on combos. |

**Rules kept from the research:** popup never fires on first paint (IM8 waits too), one game per customer, prize always applies automatically so there is no code-hunting, and the WhatsApp number is the ask because it is the channel with 70 to 90% open rates in India.

**Shopify mapping:** Alia app (same as IM8) or Klaviyo's built-in spin/scratch forms deliver the popup; both can trigger on time/scroll/exit, capture phone with WhatsApp consent, and auto-apply a Shopify discount code. Discount codes PEARL10/PEARL15 created as Shopify discounts with 48-hour validity per customer.

## 4. Mapping to Shopify (next phase)

| Prototype piece | Shopify implementation |
|---|---|
| Header/nav, announcement | Theme sections (Focal supports both; or move to Dawn-based theme for speed) |
| Category circles, budget tiles, bestsellers | `collection-list` + featured-collection sections; create smart collections: Under ₹2,000 / ₹2,000–5,000 / ₹5,000–15,000 / Gifts (tag `gift`) |
| Product cards | Override `product-card.liquid`: rating (Judge.me snippet), short title (use a metafield `custom.short_title`), EMI line (Simpl widget or static calc) |
| PDP: pincode, countdown, assurance tiles, bundle | Section blocks + a small JS snippet; bundle via Shopify Bundles app or a "Buy the look" section; delivery date via Shiprocket serviceability API |
| Reviews with photos | Judge.me: enable photo requests, show widget on PDP, reply to every review |
| Cart drawer with upsell | Theme cart drawer + Shopify Search & Discovery complementary products |
| Landing page | New page template `page.landing.liquid` with no header/footer; one per campaign; UTM-matched headline |
| WhatsApp order | Existing WhatsApp app; add cart summary deep link |
| Speed | Convert hero PNGs to WebP/AVIF, preload the LCP image, remove Pretty Sales popup, defer Klaviyo, lazy-load below-fold sections |

## 5. Measurement plan
- Baseline in Shopify Analytics: sessions by device, add-to-cart rate, reached-checkout rate, conversion rate, AOV, for Meta traffic (UTM) vs all.
- Ship in this order and read the funnel after each: (1) speed + popup removal, (2) PDP rebuild, (3) landing page for ads, (4) homepage/nav, (5) reviews programme, (6) WhatsApp recovery.
- Targets: add-to-cart ≥8%, checkout completion ≥45%, conversion ≥3% on warm Meta traffic within 8–10 weeks.

## Sources
- Baymard product page UX 2026: https://baymard.com/blog/current-state-ecommerce-product-page-ux
- Jewellery benchmarks (Branvas 2026): https://branvas.com/blogs/news/jewelry-ecommerce-benchmarks-conversion-rate-aov
- Shopify CRO playbook (ConvertCart): https://www.convertcart.com/blog/shopify-conversion-rate
- India Shopify CRO: https://bybtraction.com/shopify-conversion-rate-optimization/
- Indian jewellery Shopify stores: https://www.innovatrixinfotech.com/blog/shopify-store-jewellery-brands
- Landing page vs PDP for cold traffic: https://www.thriftizer.com/blog/cold-traffic-landing-pages-when-not-to-send-ads-to-a-product-page
- Shopify conversion benchmarks: https://www.shopify.com/blog/ecommerce-conversion-rate
- Landing page optimisation (Shopify): https://www.shopify.com/blog/landing-page-optimization-tips
- WhatsApp commerce India: https://www.akoi.in/blog/whatsapp-commerce-d2c-brands-india/
- Jewellery conversion 2026 (Ulka Rocks): https://ulkarocks.com/blogs/tech-insights/jewelry-conversion-rate-benchmarks-2026
