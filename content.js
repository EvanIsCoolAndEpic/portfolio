/*
  Everything on the site comes from this file. Edit it, save, refresh.

  Content was gathered from esegan.com and your photo folders. Every image is stored locally in /assets.

  Each book has a `format`, which decides how its pages are designed:
    'photo'     a dense, square-page photo book. Each project is a chapter; photos are packed into
                tight grids automatically in the order listed. Chapters are grouped by `part`.
                Mark a landscape { feature: true } to run it across a whole spread.
    'film'      a screening programme: a wide still across both pages, synopsis, credits, award.
    'notebook'  an engineering notebook: problem, what I built, result, and a numbered figure.

  Media item shapes:
    { type: 'image', src: 'assets/photo.jpg', alt: 'What is in the picture' }
    { type: 'video', embed: 'https://player.vimeo.com/video/123456789', url: 'https://vimeo.com/123456789', poster: 'assets/poster.jpg', alt: '...' }
*/
// Photo book images live in assets/photos/<chapter>/NNN-lg.jpg and NNN-sm.jpg (see tools/add-photos.py).
// PH('slug', [[n, 'alt text', { feature: true }], ...]); feature runs a landscape across a whole spread.
const pad3 = n => String(n).padStart(3, '0');
const PH = (slug, list) => list.map(([n, alt, opts]) => ({
  type: 'image', id: `${slug}-${n}`, alt,
  src: `assets/photos/${slug}/${pad3(n)}-lg.jpg`, thumb: `assets/photos/${slug}/${pad3(n)}-sm.jpg`,
  ratio: (window.PHOTO_RATIOS || {})[`${slug}/${pad3(n)}`] || 1.5, ...(opts || {}),
}));
const vimeo = (id, poster, alt) => ({ type: 'video', embed: `https://player.vimeo.com/video/${id}`, url: `https://vimeo.com/${id}`, poster: poster || '', alt });

window.PORTFOLIO = {
  name: 'Evan Egan',
  monogram: 'EE',
  role: 'Cinematographer, photographer, electrical engineer',
  email: 'evansegan2025@gmail.com',
  location: '',
  availability: '',
  resume: '',                     // e.g. 'assets/evan-egan-resume.pdf', leave empty to hide the button
  links: [
    // TODO: add yours, e.g. { label: 'Instagram', url: 'https://instagram.com/...' }
  ],

  about: {
    photo: 'assets/about/evan.jpg',
    text: [
      'Award-winning cinematographer, professional photographer, electrical engineer. Not in order.',
      'Most of my inspiration comes from animals and wildlife. Wildlife photography has been my passion for the last five years: it is the perfect excuse for travel, technical expertise, and a wonderful (yet unforgiving) creative outlet.',
    ],
  },

  books: [
    {
      id: 'film', title: 'Film', format: 'film', peek: '5 films', blurb: 'Writing, directing and editing',
      spine: { w: 46, h: 292 },
      intro: 'Award-winning PSAs, a 25-minute team edit made in one week, and the videos I make for fun.',
      projects: [
        { slug: 'the-elephant', title: 'The Elephant', type: 'PSA, 1 minute', year: '2025',
          award: 'Grand Prize, Directing Change statewide, 2025',
          text: [
            'A one-minute PSA on the urgency of mental health awareness. It was shown statewide to promote the 988 Suicide & Crisis Lifeline.',
          ],
          credits: [
            ['Written, directed and produced by', 'Evan Egan'],
            ['Cast', 'Jackson Harrison, Meggie Stenback, Vincent Stallone'],
            ['Shot on', 'Canon R5, Canon C80'],
            ['Edited in', 'Premiere Pro'],
          ],
          link: { label: 'Watch on Vimeo', url: 'https://vimeo.com/1061690865' },
          media: [
            vimeo('1061690865', 'assets/film/the-elephant.jpg',
              'A young man with curly brown hair looks directly at the camera, with a wolf’s head partially visible in the background.'),
          ] },

        { slug: 'reigniting-the-spark', title: 'Reigniting the Spark', type: 'PSA', year: '2024',
          award: 'Finalist, Directing Change statewide, 2024',
          text: [
            'A narrative PSA about a person who has lost their spark.',
          ],
          note: 'more creativity, less experience',
          credits: [
            ['Written, directed and produced by', 'Evan Egan'],
            ['Cast', 'Vincent Stallone, Shane Quinan'],
            ['Shot on', 'Canon C100 Mark II, Canon R8'],
            ['Edited in', 'Premiere Pro, After Effects'],
          ],
          link: { label: 'Watch on Vimeo', url: 'https://vimeo.com/918566695' },
          media: [
            vimeo('918566695', 'assets/film/reigniting-the-spark.jpg',
              'A man with dark hair and a beard sits in a dim room holding a small object, captioned "Sometimes it feels like he’s a candle that’s lost its flame."'),
          ] },

        { slug: 'senior-video-2025', title: 'Terra Linda Senior Video', type: 'Team edit, 25 minutes', year: '2025',
          text: [
            'Twenty-five minutes of video cut in one week by three editors. I edited about ten minutes on my own and built the animated titles procedurally with Fusion nodes in Resolve.',
            'Stressful, but rewarding. We learned to communicate efficiently, maybe the hard way.',
          ],
          note: '1 week, 25 minutes',
          credits: [
            ['Editors', 'Evan Egan, Makena Reyes, Sieon Davis'],
            ['Edited in', 'DaVinci Resolve, Fusion'],
          ],
          link: { label: 'Watch on Vimeo', url: 'https://vimeo.com/1125771053' },
          media: [
            vimeo('1125771053', 'assets/film/senior-video-2025.jpg', 'Still from the Terra Linda High School 2025 senior video'),
          ] },

        { slug: 'monterey-bay-aquarium', title: 'A Day at the Monterey Bay Aquarium', type: 'Travel vlog', year: '2023',
          text: [
            'A little travel vlog from a visit to the Monterey Bay Aquarium, made on my own time for fun. Animals and wildlife fascinate me as subjects.',
          ],
          credits: [
            ['Made by', 'Evan Egan'],
            ['Edited in', 'Premiere Pro'],
          ],
          link: { label: 'Watch on Vimeo', url: 'https://vimeo.com/1125765883' },
          media: [
            vimeo('1125765883', 'assets/film/monterey-bay-aquarium.jpg', 'Still from A Day at the Monterey Bay Aquarium'),
          ] },

        { slug: 'marin-science-seminar', title: 'Marin Science Seminar', type: 'Video editing internship', year: '',
          text: [
            'Video intern for the Marin Science Seminar, a nonprofit. I turned around full videos for their channel in one to two days.',
          ],
          credits: [
            ['Role', 'Video editing intern'],
          ],
          link: { label: 'See their channel', url: 'https://vimeo.com/marinscienceseminar' },
          media: [],
          placeholder: { kind: 'video', sky: 'linear-gradient(180deg,#9db4c0 0%,#d9c7a7 62%,#6a8790 100%)', ground: '#2a3a40' } },
      ],
    },

    {
      id: 'eng', title: 'Engineering', format: 'notebook', peek: '2 builds', blurb: 'Machine learning, game physics, hardware',
      spine: { w: 66, h: 256 },
      intro: 'Things I built to solve a problem I actually had, from a machine learning tool for my high school to game physics and a camera trap.',
      projects: [
        { slug: 'ssop', title: 'Student Shadow Observation Protocol', type: 'Machine learning tool', year: '2024',
          problem: 'A teacher asked me to fix a Google Sheet used to track one-on-one student observations. It was hard-coded, broken, and hard for teachers to read.',
          built: 'I fixed it, then rebuilt the system from the ground up. Observers log what a student is doing every five minutes in plain language. A TensorFlow model classifies each note, and Pandas turns the results into period-by-period reports.',
          result: 'Teachers could see which parts of a lesson lost ELL students and redesign them. The system expanded to other high schools in the county.',
          tools: 'Python, Pandas, TensorFlow / Keras, Excel',
          note: 'the Tokenizer ripped',
          figCaption: 'Loading the observation log with Pandas.',
          media: [],
          placeholder: { kind: 'code', code: "import pandas as pd\n\nfile_path = 'SSOP_Observation_Log.xlsx'\n\n# read the Excel log straight into a DataFrame\ndf = pd.read_excel(file_path)\n\nprint(\"loaded data\")\nprint(df.head())" } },

        { slug: 'blow-up-your-feet', title: 'Blow Up Your Feet', type: 'Unity game, team project', year: '',
          problem: 'My team wanted Source-engine movement in Unity: rocket jumps, air-strafing and momentum conservation. Unity’s CharacterController can’t react to explosions, and AddExplosionForce was too unpredictable for a skill-based game.',
          built: 'A custom Rigidbody controller with my own impulse system, plus air-strafing that applies force perpendicular to the player’s velocity. I tuned it for weeks in an isolated test scene.',
          result: 'Two years of development, and the biggest lesson of my engineering life so far: you learn the most from a problem you chose yourself.',
          tools: 'Unity, C#',
          note: 'escaped tutorial purgatory',
          figCaption: 'The custom propulsion function, simplified.',
          media: [],
          placeholder: { kind: 'code', code: 'public void ApplyCustomPropulsion(Rigidbody rb, Vector3 origin, float baseForce)\n{\n  Vector3 dir = (rb.position - origin).normalized;\n  dir += Vector3.up * 0.1f;  // slight upward bias\n\n  float d = Vector3.Distance(rb.position, origin);\n  float force = baseForce / (1f + d * d);  // inverse square\n\n  rb.AddForce(dir.normalized * force, ForceMode.Impulse);\n}' } },

        { slug: 'dslr-camera-trap', title: 'DIY DSLR Camera Trap', type: 'Hardware, in progress', year: '2025', hidden: true,  // set hidden: false to show it again
          text: ['A DIY camera trap built around a DSLR, for photographing wildlife. Still at the planning stage.'],
          note: 'in progress',
          figCaption: 'Planning sketches.',
          media: [],
          placeholder: { kind: 'sketch' } },
      ],
    },

    {
      id: 'photo', title: 'Photography', format: 'photo', flat: true, peek: 'a photo book', blurb: 'Wildlife, landscapes, sports and people',
      spine: { w: 236, h: 48 },
      cover: 'river-otters-9',
      intro: 'For the last five years photography has been my go-to creative outlet. Wildlife is my favorite, and the sideline is where I work.',
      projects: [
        { slug: 'misc', title: 'Misc', part: 'Wildlife & landscape', text: ['Odds and ends from the last five years.'],
          media: PH('misc', [
            [1, 'Sunrise over a valley filled with fog'],
            [3, 'A black bear in low green brush'],
            [11, 'A black bear reaching for red berries'],
            [8, 'Two Steller’s jays on the ground under leaves'],
            [9, 'Mergansers swimming below a rocky bank'],
            [10, 'A duck on still water beside a rock wall'],
            [2, 'A hiker with a backpack looking out at a jagged ridge'],
            [5, 'A California quail perched on a shrub'],
            [7, 'A small bird on a sandy slope'],
            [4, 'A mule deer buck in golden light among burned trees'],
            [6, 'Two people sitting at the edge of a lake at golden hour', { feature: true }],
            [12, 'A songbird silhouetted on a flowering stem at sunset'],
            [13, 'Dune grass at dusk with a small structure in the distance'],
          ]) },
        { slug: 'river-otters', title: 'River Otters', part: 'Wildlife & landscape', text: ['River otters on the rocks at sunrise, and in the reeds.'],
          media: PH('river-otters', [
            [5, 'An otter on the rocks in golden sunrise light'],
            [1, 'A river otter looking up from dark water with a fish in its mouth'],
            [6, 'An otter sitting upright on the rocks, backlit'],
            [7, 'An otter calling from a boulder'],
            [4, 'An otter in the water with a fish, orange-lit rocks behind'],
            [8, 'An otter stretching across two boulders'],
            [9, 'Several otters huddled together among the rocks'],
            [2, 'An otter’s head among marsh reeds'],
            [3, 'An otter looking away in the reeds'],
          ]) },
        { slug: 'herons', title: 'Great Blue Herons', part: 'Wildlife & landscape', text: ['Up close, mostly in the first and last light.'],
          media: PH('herons', [
            [1, 'A great blue heron at the edge of a lake under an orange sunrise'],
            [2, 'A great blue heron holding a small fish in its bill'],
            [3, 'A heron in profile with a drop of water falling from its bill'],
            [5, 'A heron stretching its neck, water trailing from its bill'],
            [8, 'A heron facing the camera against glowing yellow light'],
            [9, 'A heron standing among rocks with its neck stretched upward'],
            [4, 'A heron hunched in tall grass'],
            [6, 'A heron looking up, backlit against dark water'],
            [7, 'A heron’s neck in profile against blue-grey rocks'],
          ]) },
        { slug: 'egrets', title: 'Egrets', part: 'Wildlife & landscape', text: ['Great egrets in the reeds and in the trees.'],
          media: PH('egrets', [
            [2, 'A great egret wading through backlit golden reeds'],
            [1, 'A great egret beside a dark rocky bank'],
            [3, 'An egret perched on a branch among sunlit leaves'],
            [4, 'The same egret turning on its branch'],
            [5, 'An egret deep in the foliage'],
          ]) },
        { slug: 'elk', title: 'Tule Elk', part: 'Wildlife & landscape', text: ['Tule elk among the cypress and the coastal grass.'],
          media: PH('elk', [
            [4, 'A bull tule elk standing in dry grass'],
            [3, 'A bull elk lying in tall grass with its antlers raised'],
            [5, 'Two elk grazing on a hillside'],
            [1, 'A tule elk bedded under a windswept cypress'],
            [2, 'A bull elk’s antlers among cypress branches, backlit'],
            [6, 'An elk resting in green grass'],
            [7, 'A bull elk with a full rack lying in green grass'],
            [8, 'A cow elk facing the camera'],
          ]) },
        { slug: 'yosemite', title: 'Yosemite', part: 'Wildlife & landscape', text: ['Winter in the valley: fog, granite, ravens and friends.'],
          media: PH('yosemite', [
            [17, 'Yosemite Valley in silhouette at dusk'],
            [13, 'Tunnel View: El Capitan, the valley in cloud, and Bridalveil Fall', { feature: true }],
            [11, 'A granite cliff disappearing into cloud'],
            [12, 'Granite spires above the trees in the mist'],
            [16, 'The valley in mist through tall pines'],
            [15, 'Conifers and mist on the valley wall'],
            [9, 'Fog over the forest floor and dark trees'],
            [22, 'The valley rim at dusk under a violet sky'],
            [18, 'El Capitan in the last light'],
            [19, 'Sunlight and mist through the trees'],
            [20, 'A pickup on a misty road through backlit trees'],
            [21, 'Sun rays through a misty forest'],
            [5, 'A river bend with fallen logs and clear shallow water'],
            [6, 'A wet stone path through mossy boulders'],
            [4, 'A person crouched by a stream in the forest'],
            [2, 'An American robin eating red winter berries'],
            [7, 'A raven perched on a bare branch'],
            [8, 'A raven on a mossy boulder'],
            [23, 'A raven on a branch'],
            [10, 'A mule deer walking past the trees'],
            [14, 'Four friends on a boulder in front of Tunnel View'],
          ]) },
        { slug: 'football', title: 'Football', part: 'Sports & people', text: ['Varsity football under the lights.'],
          media: PH('football', [
            [3, 'Number 7 in front of the scoreboard: Trojans 14, Titans 0'],
            [1, 'A runner breaks into the open field at night'],
            [2, 'A receiver turns upfield past the end zone logo'],
            [6, 'The line collides at the snap'],
            [8, 'A player dives as the ball comes loose'],
            [9, 'A field goal attempt from the hold'],
            [12, 'A ball carrier wrapped up by defenders'],
            [16, 'Number 21 chases a play in daylight'],
            [17, 'A tackle in front of the Miller Field scoreboard'],
            [18, 'A receiver sprints in front of the stands'],
            [5, 'Teammates celebrate together'],
            [10, 'Teammates regroup on the field'],
            [15, 'The team huddles in late golden light'],
            [20, 'The team gathers before kickoff'],
            [7, 'Players catch their breath between plays'],
            [11, 'A lone player walks back under the goalposts'],
            [13, 'Close portrait of a player with eye black'],
            [14, 'Number 17 on the sideline at dusk'],
            [19, 'Number 8 at dusk'],
            [4, 'Detail of a Trojans uniform'],
          ]) },
        { slug: 'water-polo-mcal', title: 'Water Polo, MCAL Playoffs', part: 'Sports & people', text: ['Round one of the MCAL playoffs.'],
          media: PH('water-polo-mcal', [
            [1, 'A shot fired through the splash'],
            [2, 'The goalkeeper stretches across the cage'],
            [3, 'A player rises to receive the ball'],
            [4, 'Players wrestle for position in front of the goal'],
            [7, 'A player winds up to shoot'],
            [10, 'A player turns with the ball overhead'],
            [11, 'A shooter’s arm cocked behind the ball'],
            [13, 'A player lifts the ball out of the water'],
            [15, 'A shooter seen from behind'],
            [17, 'A goalkeeper leaps with both arms up'],
            [18, 'A player rises above the water to pass'],
            [21, 'Two players fight for the ball'],
            [23, 'A shot taken over a defender’s raised arm'],
            [25, 'Number 12 reaches back with the ball'],
            [29, 'A player shoots past the defense'],
            [31, 'Number 18 holds the ball high'],
            [32, 'Number 19 cocks the ball to shoot'],
            [33, 'A player fires a shot in front of the shot clock'],
            [34, 'Arms raised in front of a packed crowd'],
            [35, 'The crowd watches a shot from the deep end'],
            [36, 'A shooter lines up from the outside'],
            [37, 'The team lined up along the pool deck'],
            [39, 'Number 10 shoots with water flying'],
            [40, 'A shot released through a spray of water'],
          ]) },
        { slug: 'water-polo-oct7', title: 'Water Polo, October 7', part: 'Sports & people', text: ['A daytime match on October 7.'],
          media: PH('water-polo-oct7', [
            [8, 'Close portrait of a player beside the ball'],
            [1, 'A player grins in goggles by the lane line'],
            [2, 'Another grin from the water'],
            [5, 'Number 10 holds the ball up'],
            [26, 'A shot over a defender’s head'],
            [3, 'A shot snaps off the water'],
            [6, 'The goalkeeper reaches for a high shot'],
            [7, 'A player rises to shoot over the defense'],
            [9, 'A shot past the goalkeeper'],
            [12, 'A player reaches for the ball, seen from behind'],
            [13, 'A player holds the ball high, seen from behind'],
            [14, 'Players crowd around the ball in front of the stands'],
            [18, 'Number 15 lines up a shot'],
            [19, 'A shooter twists through the splash'],
            [22, 'A player fires from the perimeter'],
            [24, 'A player rises to shoot in front of the crowd'],
            [25, 'A defender reaches to block'],
            [27, 'Number 15 drives through the water'],
          ]) },
        { slug: 'senior-night', title: 'Senior Night', part: 'Sports & people', text: ['Seniors and their families walk out between the cheer lines.'],
          media: PH('senior-night', [
            [11, 'A senior in a sash and flower crown'],
            [1, 'A senior is greeted at the start of the ceremony'],
            [2, 'The cheer team lines the court'],
            [4, 'Families walk out between the cheer lines'],
            [6, 'A senior walks out with family'],
            [12, 'Seniors and families lined up on the court'],
            [16, 'A senior with parents and flowers'],
            [17, 'A hug on the sideline'],
            [22, 'A senior walks out with family'],
            [23, 'A long hug at center court'],
            [27, 'A hug from a parent'],
            [33, 'Another hug from the line'],
            [35, 'A senior embraces family'],
            [36, 'A senior walks out between parents'],
            [39, 'Walking out to the cheers'],
            [42, 'A senior and a parent laughing'],
            [45, 'Homemade signs held up from the crowd'],
            [46, 'A senior walks out under a homemade sign'],
            [50, 'A senior smiles between parents'],
            [53, 'A handshake on the court'],
            [54, 'A hug in front of the crowd'],
            [59, 'The seniors and families together'],
          ]) },
        { slug: 'carmel', title: 'Carmel', part: 'Sports & people', text: ['Portraits of friends in Carmel.'],
          media: PH('carmel', [
            [26, 'Friends arm in arm outside in the sun'],
            [25, 'A student in a blazer outside in the sun'],
            [15, 'A close portrait against a red wall'],
            [13, 'A smile under classroom lights'],
            [10, 'Two friends in blazers posing in a classroom'],
            [23, 'A student in a blazer at a desk'],
            [24, 'Two friends at a desk'],
            [21, 'Packing up at the desk'],
            [28, 'Friends laughing outside'],
            [29, 'A table of students in the classroom'],
          ]) },
      ],
    },
  ],
};
