import { Router } from 'itty-router'

// Content ID URL parameters for analytics
//
// FIELDS
// 'utm_source'     = Content platform (e.g. youtube, twitter, giphy, medium)
// 'utm_medium'     = Content type (e.g. video, tweet, gif, post)
// 'utm_campaign'   = Content strategy group (e.g. workout, exercise_gif, music, thread, summary, product_of_all_time)
// 'utm_term'       = Content title (e.g. '10X Workout #5 Pushup, Crunch & Squat')
// 'utm_id'         = Ads campaign id. (e.g. 'organic' if content is not tied to an ads campaign id)
// 'utm_content'    = Content ID [PLEASE IGNORE. THIS IS AUTOMATICALLY ADDED] (e.g. '1', '2', '3'... same as the content 'key')
// 'username'       = Twitter Username (will be 10X.TV username in the future)
// 'content_ref_id' = 10X Referral ID (signup to the 10X.TV waitlist at https://10x.tv to get your Referral ID)
// 'sources'        = A list of content sources that deserve credit (a source can Claim Ownership & get a portion of referral traffic)
// -- 'sources.title'         = Title of the source content e.g. ABC Article, XYZ Blog Post, Youtube Video Title, Creators Name, etc
// -- 'sources.url'           = URL to the source content
// -- 'sources.source_ref_id' = 10X Referral ID of the source creator is filled in if the source has Claimed Ownership
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
    'utm_source'     : 'youtube',
    'utm_medium'     : 'video',
    'utm_campaign'   : 'music',
    'utm_term'       : 'TITLE (Song Lyrics) - ARTIST - 10X Men Workout Music',
    'utm_id'         : 'organic',
    'username'       : 'chrisleejacob',
    'content_ref_id' : '61d73daba8528M',
    'sources'        : [
      {
        'title'         : 'ABC',
        'url'           : 'https://abc.com',
        'source_ref_id' : ''
      },
      {
        'title'         : 'EFG',
        'url'           : 'https://efg.com',
        'source_ref_id' : '456'
      },
      {
        'title'         : 'HIJ',
        'url'           : 'https://hij.com',
        'source_ref_id' : '789'
      }
    ]
  }
//   '3': {
//     'utm_source'     : 'youtube',
//     'utm_medium'     : 'video',
//     'utm_campaign'   : 'music',
//     'utm_term'       : 'STAY (Song Lyrics) - The Kid LAROI, Justin Bieber - 10X Men Workout Music',
//     'utm_id'         : 'organic'
//     'username'       : 'chrisleejacob',
//     'content_ref_id' : '61d73daba8528M',
//     'sources'        : []
//   },
//   '2': {
//     'utm_source'     : 'youtube',
//     'utm_medium'     : 'video',
//     'utm_campaign'   : 'music',
//     'utm_term'       : 'STAY (Song Lyrics) - The Kid LAROI, Justin Bieber - 10X Women Workout Music',
//     'utm_id'         : 'organic'
//     'username'       : 'chrisleejacob',
//     'content_ref_id' : '61d73daba8528M',
//     'sources'        : []
//   },
//   '1': {
//     'utm_source'     : 'medium',
//     'utm_medium'     : 'post',
//     'utm_campaign'   : 'content_machine',
//     'utm_term'       : '10X Content Machine - Referrals On Autopilot',
//     'utm_id'         : 'organic'
//     'username'       : 'chrisleejacob',
//     'content_ref_id' : '61d73daba8528M',
//     'sources'        : []
//   },
//   '0': {
//     'utm_source'     : 'direct',
//     'utm_medium'     : 'post',
//     'utm_campaign'   : 'egg',
//     'utm_term'       : '10X Content ID Easter Egg',
//     'utm_id'         : 'organic'
//     'username'       : 'chrisleejacob',
//     'content_ref_id' : '61d73daba8528M',
//     'sources'        : []
//   }
}

// Redirect to landingpage URL
const redirect_to = 'https://codepen.io/10xtheworld/pen/WNdzVrP'

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
    // Share referral traffic between 3 type of creators:
    // 1. Content Creator = Published the 10X Content
    // 2. Traffic Creator = Shared the 10X Content with their Referral ID
    // 3. Source Creator  = One creator picked from the list of sources that the 10X Content was based on
    
    let content_ref = content_data.content_ref_id;
    let traffic_ref = '';
    let source_ref = '';
    
    // Get traffic Referral ID from query parameters
    traffic_ref = query.ref || query.ref_id || query.traffic_ref_id || ''; // e.g. for @chrisleejacob ?ref_id=61d73daba8528M
    let has_traffic_ref = traffic_ref ? true : false; 
    
    // Get one random source Referral ID from content sources that have Claimed Ownership
    let content_sources = content_data.sources;
    let has_content_sources = (Array.isArray(content_sources) && !content_sources.length) ? false : true;
    let claimed_content_sources = [];
    let has_claimed_content_sources = false;
    if(has_content_sources){
      claimed_content_sources = content_sources.filter(source => source.source_ref_id !== '');
      has_claimed_content_sources = (Array.isArray(claimed_content_sources) && !claimed_content_sources.length) ? false : true;
    }
    if(has_claimed_content_sources){
      let random_claimed_source = claimed_content_sources[Math.floor(Math.random()*claimed_content_sources.length)]; 
      source_ref = random_claimed_source.source_ref_id;
    }
    
    // SPLIT the traffic fairly between TRAFFIC --> CONTENT --> SOURCES. There are 4 Options:
    // 1. CONTENT = 100% Content e.g. 10X.TV/123
    // 2. TRAFFIC + CONTENT = 50% Traffic, 50% Content e.g. 10X.TV/123?ref=abc
    // 3. CONTENT + SOURCES = 50% Content, 50% Sources e.g. 10X.TV/123 + if 5 content sources then they each have a 10% chance
    // 4. TRAFFIC + CONTENT + SOURCES = 50% Traffic, 25% Content, 25% Sources e.g. 10X.TV/123?ref=abc + if 5 content sources then they each have a 5% chance
    //
    // NOTE: 
    // Content can have 0, 1 or MANY Sources. 
    // Sources need to have a 10X Referral ID (i.e. Claim Ownership) to be considered in the split.
    // If NO Sources have a Referral ID then the Content Creator gets their full share of the split
    // If MANY Sources have claimed ownership, then just one of these claimed sources is chosen at random (see earlier code)
    
    let split = Math.random();
    
    // CONTENT = 100% Content e.g. 10X.TV/123
    let referral = content_ref;
    
    // TRAFFIC + CONTENT = 50% Traffic, 50% Content e.g. 10X.TV/123?ref=abc
    if(has_traffic_ref && !has_claimed_content_sources) {
      if (split >= 0.5) {
        referral = traffic_ref;
      }
    }
    
    // CONTENT + SOURCES = 50% Content, 50% Sources e.g. 10X.TV/123 + if 5 content sources then they each have a 10% chance
    if(!has_traffic_ref && has_claimed_content_sources){
      if (split >= 0.5) {
        referral = source_ref;
      }
    }
    
    // TRAFFIC + CONTENT + SOURCES = 50% Traffic, 25% Content, 25% Sources e.g. 10X.TV/123?ref=abc + if 5 content sources then they each have a 5% chance
    if(has_traffic_ref && has_claimed_content_sources) {
      if (split < 0.5) {
        referral = traffic_ref;
      }
      if (split >= 0.5 && split < 0.75) {
        referral = content_ref;
      }
      if (split >= 0.75) {
        referral = source_ref;
      }
    }
    
    let referral_query_string = `ref_id=${referral}&`;

    // query string passes along content data, and stringifys the 'sources' array of objects
    // decoding of 'sources' back into it's original Array format can be done with JSON.parse(decodeURIComponent(SOURCES))
    let query_string = Object.keys(content_data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(Array.isArray(content_data[key]) ? JSON.stringify(content_data[key]) : content_data[key])}`)
      .join('&');
        
    let link = `${redirect_to}?${referral_query_string}traffic_ref=${traffic_ref}&utm_content=${content_id}&${query_string}`;
    
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
