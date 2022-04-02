import { Router } from 'itty-router'

// Content ID URL parameters for analytics
//
// FIELDS
// 'utm_source'   = Content platform (e.g. youtube, twitter, giphy, medium)
// 'utm_medium'   = Content type (e.g. video, tweet, gif, post)
// 'utm_campaign' = Content strategy group (e.g. workout, exercise_gif, music, thread, summary, product_of_all_time)
// 'utm_term'     = Content title (e.g. '10X Workout #5 Pushup, Crunch & Squat')
// 'utm_id'       = Ads campaign id. (e.g. 'organic' if content is not tied to an ads campaign id)
// 'utm_content'  = Content ID [PLEASE IGNORE. THIS IS AUTOMATICALLY ADDED] (e.g. '1', '2', '3'... same as the content 'key')
//
// DRAFT CONTENT IDs
// Claim your future Content IDs early so other contributors know to not use these IDs
// 3 = @chrisjacob 10X Music - Stay - Male
// 2 = @chrisjacob 10X Music - Stay - Female
// 1 = @chrisjacob Medium post on how to contribute 10X Content
// 0 = @chrisjacob Easter Egg
//
// PUBLISHED CONTENT IDs
const content = {
  '4': {
    'utm_source': 'youtube',
    'utm_medium': 'video',
    'utm_campaign': 'music',
    'utm_term': 'TITLE (Song Lyrics) - ARTIST - 10X Men Workout Music',
    'utm_id': 'organic'
  }
//   '3': {
//     'utm_source': 'youtube',
//     'utm_medium': 'video',
//     'utm_campaign': 'music',
//     'utm_term': 'STAY (Song Lyrics) - The Kid LAROI, Justin Bieber - 10X Men Workout Music',
//     'utm_id': 'organic'
//   },
//   '2': {
//     'utm_source': 'youtube',
//     'utm_medium': 'video',
//     'utm_campaign': 'music',
//     'utm_term': 'STAY (Song Lyrics) - The Kid LAROI, Justin Bieber - 10X Women Workout Music',
//     'utm_id': 'organic'
//   },
//   '1': {
//     'utm_source': 'medium',
//     'utm_medium': 'post',
//     'utm_campaign': 'content_machine',
//     'utm_term': '10X Content Machine - Referrals On Autopilot',
//     'utm_id': 'organic'
//   },
//   '0': {
//     'utm_source': 'direct',
//     'utm_medium': 'post',
//     'utm_campaign': 'egg',
//     'utm_term': '10X Content ID Easter Egg',
//     'utm_id': 'organic'
//   }
}

// Redirect to landingpage URL
const redirect_to = 'https://google.com/'

// Create a new router
const router = Router()

/*
Our index route, a simple hello world.
*/
router.get("/", () => {
  //console.log("testing logs");
  return new Response("10X The World!...")
})

/*
Extract the short Content ID from URL then redirect to a landing page

Try visit /1 and see the response.
*/
router.get("/:slug", ({ params }) => {
  let content_id = params.slug;
  let content_data = content[content_id];
  
  if(!content_data) {
      return new Response('Content ID not found.', {
      status: 404,
    });
  } else {
    let query_string = Object.keys(content_data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(content_data[key])}`)
      .join('&');
        
    let link = `${redirect_to}${content_id}?utm_content={$content_id}&${query_string}`;
    
    return new Response(null, {
      headers: { Location: link },
      status: 302,
    });
  }
})


/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", { status: 404 }))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
