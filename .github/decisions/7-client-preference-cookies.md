# Client Preference Cookies

Author: Wesley Porter

Date: 2024-08-23

Status: proposed

## Context

Server rendering is preferred for most things to avoid content layout shift (which causes a poor user experience). Unfortunately, there are a number of limitations with this because the browser doesn't give the server enough information about the user's preferences. For example:

- `prefers-color-scheme` (light/dark mode)
- `prefers-reduced-data`
- time zone offset
- locale

And much more.

The problem is that if what you display to the user relies on these values, then what the server renders could be wrong and the user will see the incorrect UI until client-side JavaScript can take over and correct it which causes a "Flash of Incorrect UI." This is a terrible user experience.

This is such an issue that the web platform will (hopefully soon) be adding new user preferences headers to each request for us to know these values on the server. Read, [User preference media features client hints headers](https://web.dev/user-preference-media-features-headers/) and [User Locale Preferences](https://github.com/romulocintra/user-locale-client-hints). However, there's no telling when these features will become standard and implemented in all browsers, so we cannot rely on this or wait for it.

There are a few ways to solve this problem:

1. Convert values on the server prior to sending to the client. Downside is that the values may be incorrect for the user, since the timezone on the server may differ. This is unacceptable.
2. Only render the values on the client. Downside is that the value will flash on the screen once the client renders it. This can be accomplished with the [ClientOnly](https://github.com/sergiodxa/remix-utils?tab=readme-ov-file#clientonly) component.
3. Similar to the last option, use a [ProgressiveClientOnly](https://www.jacobparis.com/content/remix-progressive-client-only) component. Fade the values as they appear so that the flash isn't so jarring.
4. Predetermine client settings via cookies.

For the best UX, we can explore the final option to use cookies. There are two limitations here:

1. On the first visit to the site, users won't have the cookie set.
2. The cookie will be stale if the user changes their preference.

To solve the first problem, we can simply check that the cookies are set and if they are not, then we instead send a minimal document that includes a tiny bit of JavaScript that sets the cookies and then reloads the page. This is not ideal, however it's effectively as harmful to the user as a redirect which many websites do today (for example, go to `https://youtube.com` and you instantly get redirected to `https://www.youtube.com`). Additionally, this is effectively how [the draft specification](https://wicg.github.io/user-preference-media-features-headers/#usage-example) for the web platform's solution.

To solve the second problem, we can simply keep a tiny bit of JS in the head of the document that does a quick check of the cookie values and if they are stale, then it sets them again and triggers a reload. Still not ideal, but again, it's better than a content layout shift and not a common occurrence. Hopefully this solution isn't permanent and we can remove it once the web platform offers a better solution.

To take things further, we can future proof this solution a bit by trying to adhere to the web platform's proposed solution as closely as possible, so that when it does become available, we can simply switch from the cookies to headers and remove the JS, leaving us with few changes to make.

## Decision

Even though the web platform is working on a solution for this, we cannot wait for it. Despite page reloads being a sub-optimal user experience, it's better than the content layout shift (flash of incorrect UI) alternative. Therefore, we will use cookies and reloads to solve this problem.

## Consequences

The user's first page load will be a bit slower than normal (as will any page load after their preferences change) because we have to do a page reload to set the cookies. However, this is a one-time cost and the user will not experience this again until they change their preferences.

The user will not experience content layout shift for any user preferences our app depends on for the server render. This is a huge win for user experience.

If a user has cookies disabled, then we need to detect that and fallback to default values. Users in this situation will experience content layout shift, but there's nothing else we can do about that. Additionally, users who have cookies disabled will not be able to authenticate which is a separate concern that should be addressed in a different decision document.

## Resources

Much of this content was pulled from the [Epic Stack](https://github.com/epicweb-dev/epic-stack/blob/main/docs/decisions/005-client-pref-cookies.md).
