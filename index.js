'use strict'

const rewriter = new HTMLRewriter()

const links = [{
  "name": "Mangadex", "url": "https://mangadex.org/"
}, 
{
  "name": "Caramora", "url": "https://www.caramora.com/"
}, 
{
  "name": "Reddit", "url": "https://www.reddit.com/"
}]

class LinkWriter {
  element(element) {
    const htmlItems = links.map((urlItem) => {
      return `<a href=${urlItem.url}>${urlItem.name}</a>`
    })
    element.setInnerContent(htmlItems.join(''), { html: true })
  }
}

class ProfileWriter {
  element(element) {
    if(element.tagName === 'div') {
      element.setAttribute('style', '')
    }else if(element.tagName === 'img') {
      element.setAttribute('src', 'https://ensj.github.io/assets/images/avatar.jpeg')
    }else if(element.tagName === 'h1') {
      element.setInnerContent('Junhyun Lim')
    }
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)
  if(url.pathname === '/links') {
    return new Response(JSON.stringify({ 
      "links": links
    }), {
      headers: { 'content-type': 'application/json' },
    })
  } else {
    const staticPage = await fetch("https://static-links-page.signalnerve.workers.dev")

    return rewriter
      .on("div#links", new LinkWriter())
      .on("div#profile", new ProfileWriter())
      .on("div#profile img", new ProfileWriter())
      .on("div#profile h1", new ProfileWriter())
      .transform(staticPage)
  }
}
