import { Router } from 'itty-router'

// Content ID URL parameters for analytics
const content = {
  '1': {
    'foo': 'bar' 
  },
  '2':  {
    'foo': '123' 
  }
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
  return new Response("10X The World!")
})

/*
Extract the short Content ID from URL then redirect to a landing page

Try visit /1 and see the response.
*/
router.get("/:slug", ({ params }) => {
  // Decode text like "Hello%20world" into "Hello world"
  // let input = decodeURIComponent(params.slug)
  let content_id = params.slug;
  let content_data = content[content_id];
  
  if(!content_data) {
      return new Response('Content ID not found', {
      status: 404,
    });
  } else {
    let link = `${redirect_to}${content_id}`;

    return new Response(null, {
      headers: { Location: link },
      status: 301,
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
