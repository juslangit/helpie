/* Sections from the HELPIE 2024 Android app (Andromo build). Every sentence and link is the app's own;
 * only the presentation is new. The app was English only, so these pages stay in English. */
'use strict';
window.H = window.H || {};

(() => {
  const { esc, img, host, extIcon, titleCase, extButton } = H;

  // Where the Therapist Consultation form sends its answers. The app's form was never connected to anything
  // (it posted to "/"), so leave this empty until there is a real destination that accepts a form POST.
  const FORM_ENDPOINT = '';

  H.INTRO = {
    title: 'HELPIE:',
    subtitle: 'STRESS CONSOLING APPS',
    text: 'HELPIE is an application to help you during stressful times. You are sometimes confused with your feelings. Got no place to refer to and consult on your problems. HELPIE is a one click app to guide you to understand your emotions. Educate yourself to understand yourself better. Happy times with HELPIE.',
  };

  const QUOTES = {
    james: { img: 'q-james', alt: '“The greatest weapon against stress is our ability to choose one thought over another.” William James' },
    eaton: { img: 'q-eaton', alt: '“My key to dealing with stress is simple: just stay cool and stay focused.” Ashton Eaton' },
    selye: { img: 'q-selye', alt: '“Adopting the right attitude can convert a negative stress into a positive one.” Hans Selye' },
    breathnach: { img: 'q-breathnach', alt: '“Today, expect something good to happen to you no matter what occurred yesterday. Realize the past no longer holds you captive. It can only continue to hurt you if you hold on to it.” Sarah Ban Breathnach' },
    black: { img: 'q-black', alt: '“Sometimes the most productive thing you can do is relax.” Mark Black' },
    rubin: { img: 'q-rubin', alt: '“Negative emotions like loneliness, envy, and guilt have an important role to play in a happy life; they’re big, flashing signs that something needs to change.” Gretchen Rubin' },
  };
  H.QUOTE_KEYS = Object.keys(QUOTES);

  const LINKS = {
    feelings: 'https://www.mes-games.com/feelings.php',
    cards: 'https://www.canva.com/design/DAFjaj0mFwc/ZUdyFVa8MP6RbiClAdbejQ/edit?utm_content=DAFjaj0mFwc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    stressTest: 'https://www.bemindfulonline.com/test-your-stress',
    emotionsSurvey: 'https://psychcentral.com/quizzes/emotional-type-quiz#2',
    stressSurvey: 'https://psychcentral.com/quizzes/stress-test',
    angerSurvey: 'https://5lovelanguages.com/quizzes/anger-assessment',
    // The app's link carried a Google Ads click id and campaign tags; this is the same page without them.
    chat: 'https://www.justanswer.com/sip/therapy-1',
    professional: 'https://www.healthhub.sg/programmes/186/MindSG/Discover',
    consult: 'https://drive.google.com/file/d/1pUCYZFeUjrO8qltXXcoqvSDDMZT3BJCY/view?usp=sharing',
    candyForm: 'https://forms.gle/VfQ72y3kvHpQRb6c7',
    website: 'https://g-55420100.wixsite.com/website',
    contact: 'https://g-55420100.wixsite.com/website/contact',
  };

  /* ---------- building blocks ---------- */

  H.feature = ({ heading, text, img: name, imgAlt, href, cta }) => `
    <section class="block">
      <div class="card feature">
        <a class="feature-art plate" href="${esc(href)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${img(name, imgAlt)}</a>
        <div class="feature-body">
          <h2 class="block-title">${heading}</h2>
          <p class="lead">${text}</p>
          <div class="btn-row">${extButton(titleCase(cta), href, 'primary')}</div>
          <p class="source">${host(href)}</p>
        </div>
      </div>
    </section>`;

  const steps = (heading, items) => `
    <section class="block">
      <h2 class="section-label">${titleCase(heading)}</h2>
      <ol class="steps">
        ${items.map(s => `
          <li class="card step">
            <button class="shot" type="button" data-zoom="${s.img}" aria-label="${H.t('enlarge')} ${parseInt(s.text, 10)}">${img(s.img, '', true)}</button>
            <p>${s.text.replace(/^(\d+)\.\s*/, '<span class="num">$1</span>')}</p>
          </li>`).join('')}
      </ol>
    </section>`;

  const linkCard = ({ img: name, eyebrow, title, href }) => `
    <a class="card link-card" href="${esc(href)}" target="_blank" rel="noopener">
      <span class="plate">${img(name, '')}</span>
      ${eyebrow ? `<span class="eyebrow">${titleCase(eyebrow)}</span>` : ''}
      <span class="link-title">${titleCase(title)}${extIcon}</span>
      <span class="source">${host(href)}</span>
    </a>`;

  const field = (name, label, type, autocomplete) => `
    <label class="field">
      <span class="field-label">${label}</span>
      <input name="${name}" type="${type}" placeholder="${label}" autocomplete="${autocomplete}" required>
    </label>`;

  H.quotes = keys => !keys.length ? '' : `
    <section class="block quotes" aria-label="${H.t('quotes')}">
      <h2 class="section-label">${H.t('quotes')}</h2>
      <div class="quote-strip">
        ${keys.map(k => `
          <button class="quote" type="button" data-zoom="${QUOTES[k].img}" data-alt="${esc(QUOTES[k].alt)}">
            ${img(QUOTES[k].img, QUOTES[k].alt, true)}
          </button>`).join('')}
      </div>
    </section>`;

  const englishNote = () => H.lang() === 'bm' ? `<p class="lang-note">${H.t('englishOnly')}</p>` : '';

  /* ---------- the app's "Know Your Emotions: Cards Game Theraphy" page, merged into Activities ---------- */

  H.CARD_GAME = {
    title: 'Know Your Emotions: Cards Game Theraphy',
    feature: () => H.feature({
      heading: 'Emotions Cards',
      text: 'Click the icon to view the cards',
      img: 'cards', imgAlt: 'Emotions cards',
      href: LINKS.cards, cta: 'View the cards',
    }),
    // The printed-card rules for each of the four activities, keyed like the portal's activities.
    activities: {
      makingFaces: { title: '1. Making Faces', img: 'making-faces', text: 'Place a set of cards face down on a stack. Turn over the top card. Name the emotion and make a face to match.' },
      guessEmotion: { title: '2. Guess the Emotion', img: 'guessing-game', text: 'Spread out a set of cards face up. Take turns to choose a card but don’t tell the other players which you have chosen. Make a face and see if the other players can guess which card you chose.' },
      storyGame: { title: '3. The Way I Feel Story Game', img: 'story-game', text: 'Spread out a set of cards face up. Take turns to choose a card but don’t tell the other players which you have chosen. Tell a short story about a time you felt like that and see if the other players can guess which card you chose.' },
      matchingEmotions: { title: '4. Matching Emotions', img: 'matching-games', text: 'Print two sets of the cards (complete with the backing pattern on the reverse side) to make your own Concentration style matching game. To play, spread out all cards face down. Take turns turning over two cards at a time. If you find a match, you keep that pair of cards.' },
    },
    quotes: ['james', 'eaton', 'selye', 'breathnach', 'black', 'rubin'],
  };

  /* ---------- pages ---------- */

  const page = (p, body) => `
    ${H.pageHead({ icon: img(p.icon.img, ''), eyebrow: H.t(H.GROUP_LABEL[p.group]), title: p.title })}
    ${englishNote()}
    ${body}
    ${H.quotes(p.quotes)}`;

  H.APK_PAGES = [
    {
      slug: 'feelings-game', group: 'learn', accent: 'amber', icon: { img: 'feelings-game' },
      title: 'Feelings Game', kind: { bm: 'Permainan · 4 langkah', en: 'Game · 4 steps' },
      quotes: ['james', 'eaton', 'selye', 'breathnach', 'black', 'rubin'],
      render: p => page(p, `
        ${H.feature({
          heading: 'Feelings Game',
          text: 'Feelings game educates users to know their feelings through various games.',
          img: 'feelings-game', imgAlt: 'Feelings game',
          href: LINKS.feelings, cta: 'PLAY NOW',
        })}
        ${steps('PLAY ACTIVITIES', [
          { img: 'fg-step1', text: '1. Click on any categories.' },
          { img: 'fg-step2', text: '2. Click on one of the games.' },
          { img: 'fg-step3', text: '3. Choose the game mode.' },
          { img: 'fg-step4', text: '4. Start the game and enjoy!' },
        ])}`),
    },
    {
      slug: 'stress-measurement', group: 'check', accent: 'green', icon: { img: 'stress-measure' },
      title: 'Stress Measurement', kind: { bm: 'Tinjauan · 3 langkah', en: 'Survey · 3 steps' },
      quotes: ['james', 'eaton', 'selye', 'breathnach', 'black', 'rubin'],
      render: p => page(p, `
        ${H.feature({
          heading: 'Stress Measurement',
          text: 'Use this feature to measure your stress level.',
          img: 'stress-measure', imgAlt: 'Stress measurement',
          href: LINKS.stressTest, cta: 'SURVEY',
        })}
        ${steps('PLAY ACTIVITIES', [
          { img: 'sm-step1', text: '1. Start the survey by clicking<br>“GET YOUR STRESS SCORE”.' },
          { img: 'sm-step2', text: '2. Start the survey. Answer the questions.' },
          { img: 'sm-step3', text: '3. Get your stress score.' },
        ])}`),
    },
    {
      slug: 'health-survey', group: 'check', accent: 'violet', icon: { img: 'emotions-survey' },
      title: 'Health Status Survey', kind: { bm: '3 tinjauan', en: '3 surveys' },
      quotes: ['eaton', 'selye', 'breathnach', 'black'],
      render: p => page(p, `
        <section class="block">
          <h2 class="block-title">Emotions, Stress &amp; Anger</h2>
          <p class="lead">Take the survey to explore your understanding of your emotions, stress &amp; anger</p>
          <div class="grid-3">
            ${linkCard({ img: 'emotions-survey', title: 'EMOTIONS STATUS SURVEY', href: LINKS.emotionsSurvey })}
            ${linkCard({ img: 'stress-survey', title: 'STRESS STATUS SURVEY', href: LINKS.stressSurvey })}
            ${linkCard({ img: 'anger-survey', title: 'ANGER STATUS SURVEY', href: LINKS.angerSurvey })}
          </div>
        </section>`),
    },
    {
      slug: 'chat-assistance', group: 'help', accent: 'blue', icon: { img: 'chat' },
      title: 'Chat Assistance', kind: { bm: 'Sembang', en: 'Chat' },
      quotes: ['james', 'eaton', 'selye'],
      render: p => page(p, `
        <section class="block">
          <h2 class="block-title">Chat &amp; Share</h2>
          <p class="lead">Looking for someone to share your problems with? Chat now and share with your therapist. Don’t be alone.</p>
          <div class="grid-2">
            ${linkCard({ img: 'chat', eyebrow: 'CHAT FOR HELP', title: 'CHAT NOW', href: LINKS.chat })}
            ${linkCard({ img: 'professional', title: 'PROFESSIONAL ASSISTANT', href: LINKS.professional })}
          </div>
        </section>`),
    },
    {
      slug: 'therapist-consultation', group: 'help', accent: 'teal', icon: { img: 'professional' },
      title: 'Therapist Consultation', kind: { bm: 'Tempahan', en: 'Booking' },
      quotes: [],
      render: p => page(p, `
        <section class="block consult">
          <div class="card consult-intro">
            <span class="consult-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 21V8l8-5 8 5v13H4z"/><path d="M12 9v6M9 12h6"/></svg>
            </span>
            <h2 class="block-title">Contact Us For Consultation</h2>
            <p class="lead"><b>Get help from your therapist. Book for consultation now</b></p>
            <div class="btn-row">
              ${extButton('Consult Therapist', LINKS.consult, 'primary')}
              ${extButton('Manage Consultation', LINKS.consult, 'secondary')}
            </div>
          </div>
          <form class="card form" id="help-form" novalidate>
            <h2 class="form-title">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m14 6 4 4"/></svg>
              helpie help center
            </h2>
            ${field('fullname', 'Full name', 'text', 'name')}
            ${field('email', 'Email', 'email', 'email')}
            ${field('phone', 'Phone number', 'tel', 'tel')}
            ${field('address', 'Address', 'text', 'street-address')}
            <label class="field">
              <span class="field-label">Age</span>
              <select name="age" required>
                <option value="" selected disabled>Age</option>
                <option>7-12</option>
                <option>13-20</option>
                <option>21-30</option>
                <option>31 above</option>
              </select>
            </label>
            <label class="check">
              <input type="checkbox" name="agree" required>
              <span>I agree to the Privacy Policy for HELPIE</span>
            </label>
            <p class="form-msg" role="status" aria-live="polite"></p>
            <button class="btn primary wide" type="submit">Submit</button>
          </form>
        </section>`),
      mount: root => wireConsultForm(root.querySelector('#help-form')),
    },
    {
      slug: 'stress-support', group: 'help', accent: 'pink', icon: { img: 'candy' },
      title: 'Stress Support System', kind: { bm: 'Kempen', en: 'Campaign' },
      quotes: ['james', 'eaton', 'selye', 'breathnach'],
      render: p => page(p, `
        ${H.feature({
          heading: 'Fundraising &amp; Campaign',
          text: 'Are you stressed? Have a hard time? Free candy is here for you. Reach us now by filling in the form below. We will contact you.',
          img: 'candy', imgAlt: 'Free candy form',
          href: LINKS.candyForm, cta: '1 CANDY 1 SMILE',
        })}
        <section class="block">
          <div class="card campaign">
            <h2 class="block-title">1 Candy 1 Smile</h2>
            <p>HELPIE through the stress support system are sharing 1000 candies for 1000 smiles. Help us to realize this programme. Support our campaign by donating candies. Contact us for more information.</p>
          </div>
          <div class="grid-2">
            ${linkCard({ img: 'website', title: 'WEBSITE', href: LINKS.website })}
            ${linkCard({ img: 'contact', title: 'CONTACT US', href: LINKS.contact })}
          </div>
        </section>`),
    },
  ];

  function wireConsultForm(form) {
    const msg = form.querySelector('.form-msg');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      form.classList.add('tried');
      if (!form.checkValidity()) {
        msg.className = 'form-msg error';
        msg.textContent = H.t('formFill');
        form.querySelector(':invalid')?.focus();
        return;
      }
      if (!FORM_ENDPOINT) {
        msg.className = 'form-msg error';
        msg.textContent = H.t('formNotConnected');
        return;
      }
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        form.classList.remove('tried');
        msg.className = 'form-msg ok';
        msg.textContent = 'Thank you. We have received your details.';
      } catch {
        msg.className = 'form-msg error';
        msg.textContent = H.t('serverError');
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
