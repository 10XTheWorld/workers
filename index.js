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
// 'username'     = Twitter Username (will be 10X.TV username in the future)
// 'referral_id'  = 10X Referral ID (signup to the 10X.TV waitlist at https://10x.tv to get your Referral ID)
//
// DRAFT CONTENT IDs
// Claim your future Content IDs early so other contributors know to not use these IDs
// [CONTENT ID] = [@TWITTER USERNAME] [CONTENT TITLE]
// 3 = @chrisleejacob 10X Music - Stay - Male
// 2 = @chrisleejacob 10X Music - Stay - Female
// 1 = @chrisleejacob Medium post on how to contribute 10X Content
// 0 = @chrisleejacob Easter Egg
//
// PUBLISHED CONTENT IDs
const content = {
  '4': {
    'utm_source'  : 'youtube',
    'utm_medium'  : 'video',
    'utm_campaign': 'music',
    'utm_term'    : 'TITLE (Song Lyrics) - ARTIST - 10X Men Workout Music',
    'utm_id'      : 'organic',
    'username'    : 'chrisleejacob',
    'referral_id' : '61d73daba8528M'
  }
//   '3': {
//     'utm_source'  : 'youtube',
//     'utm_medium'  : 'video',
//     'utm_campaign': 'music',
//     'utm_term'    : 'STAY (Song Lyrics) - The Kid LAROI, Justin Bieber - 10X Men Workout Music',
//     'utm_id'      : 'organic'
//     'username'    : 'chrisleejacob',
//     'referral_id' : '61d73daba8528M'
//   },
//   '2': {
//     'utm_source'  : 'youtube',
//     'utm_medium'  : 'video',
//     'utm_campaign': 'music',
//     'utm_term'    : 'STAY (Song Lyrics) - The Kid LAROI, Justin Bieber - 10X Women Workout Music',
//     'utm_id'      : 'organic'
//     'username'    : 'chrisleejacob',
//     'referral_id' : '61d73daba8528M'
//   },
//   '1': {
//     'utm_source'  : 'medium',
//     'utm_medium'  : 'post',
//     'utm_campaign': 'content_machine',
//     'utm_term'    : '10X Content Machine - Referrals On Autopilot',
//     'utm_id'      : 'organic'
//     'username'    : 'chrisleejacob',
//     'referral_id' : '61d73daba8528M'
//   },
//   '0': {
//     'utm_source'  : 'direct',
//     'utm_medium'  : 'post',
//     'utm_campaign': 'egg',
//     'utm_term'    : '10X Content ID Easter Egg',
//     'utm_id'      : 'organic'
//     'username'    : 'chrisleejacob',
//     'referral_id' : '61d73daba8528M'
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
router.get("/:slug", ({ params, query }) => {
  let content_id = params.slug;
  let content_data = content[content_id];
  
  if(!content_data) {
      return new Response('Content ID not found.', {
      status: 404,
    });
  } else {
    let query_referral = query.ref || query.ref_id; // e.g. for @chrisleejacob ?ref_id=61d73daba8528M
    let has_query_referral = query_referral ? true : false; 
    
    // Share referral traffic between creators
    // Content Creator = published the 10X Content
    // Traffic Creator = shared the 10X Content
    // Source Creator  = one creator picked from the list of sources that the 10X Content was based on
    
    // The types of split:
    // NONE = 100% Organic e.g. 10X.TV/
    // TRAFFIC = 100% Traffic e.g. 10X.TV/?ref=abc
    // CONTENT = 100% Content e.g. 10X.TV/123
    // TRAFFIC + CONTENT = 50% Traffic, 50% Content e.g. 10X.TV/123?ref=abc
    // CONTENT + SOURCES = 50% Content, 50% Sources e.g. 10X.TV/123 + if 5 content sources then they each have a 10% chance
    // TRAFFIC + CONTENT + SOURCES = 50% Traffic, 25% Content, 25% Sources e.g. 10X.TV/123?ref=abc + if 5 content sources then they each have a 5% chance
    // NOTE: 
    // Content can have 0, 1 or MANY Sources. 
    // Sources need to have a 10X Referral ID (i.e. Claim Ownership) to be considered in the split.
    // If NO Sources have a Referral ID then the Content Creator gets their share of the split
    
    // Default = 100% to the Content Creator
    let referral = content_data.referral_id;
    
    if(has_query_referral) {
      if (Math.random() >= 0.5) {
        // 50% to the Traffic Creator (other 50% goes to the Content Creator by default) 
        referral = query_referral;
      }
    } 
    
    let referral_query_string = `ref_id=${referral}&`;
    
    let query_string = Object.keys(content_data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(content_data[key])}`)
      .join('&');
        
    let link = `${redirect_to}?${referral_query_string}utm_content=${content_id}&${query_string}`;
    
    return new Response(null, {
      headers: { Location: link },
      status: 302,
    });
  };
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
