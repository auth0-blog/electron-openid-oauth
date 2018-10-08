# Securing Electron Applications with OpenID Connect and OAuth 2.0

Learn how to secure your Electron applications using standards like OpenID Connect and OAuth 2.0. This article originally appeared on Auth0 Blog: [How to Secure Electron Apps with OpenID Connect and OAuth 2.0](https://auth0.com/blog/securing-electron-applications-with-openid-connect-and-oauth-2/)

---
## Sample From the Article:

**TL;DR:** In this article, you will learn how to secure Electron applications with OpenID Connect and OAuth 2.0. You don't need to be an expert in any of these technologies to follow this article along because the instructions will guide you through the whole thing. However, if you want to [learn about OpenID Connect, you can check this documentation](https://auth0.com/docs/protocols/oidc) and, [if you want to learn about OAuth, you can check this one](https://auth0.com/docs/protocols/oauth2).

### Prerequisites

To follow this article along without trouble, you are expected to have some basic skills with Node.js and JavaScript. JavaScript is mandatory but, if you don't know Node.js, you might still be able to move through the article.

However, you do have to [have Node.js and NPM properly installed](https://nodejs.org/en/download/) in your machine. Also, some familiarity with Shell, Bash, and alike is desirable. If you are on Windows, [PowerShell](https://docs.microsoft.com/en-us/powershell/) might be the solution to your needs.

### What Will you Build

To demonstrate how to secure Electron apps with OpenID Connect and OAuth 2.0, you are going to put together two projects. The first one is, as you might expect, an Electron application. The second one is a (very) basic RESTful API that you will use Node.js and Express to run. The backend will contain a single endpoint (`/private`) that will represent an API that only performs its job if the incoming requests have access tokens. If these requests do have valid access tokens, this endpoint will respond with a static message saying "Only authenticated users can read this message".

Although this backend API is basic, this single endpoint is enough to demonstrate how you would secure your real-world APIs (e.g., RESTful resources). That is, if you were developing a to-do list, a shopping cart feature, or anything like that, the approach would be the same.

> "An Access Token is a string representing granted permissions." - [OAuth 2.0 documentation @ Auth0](https://auth0.com/docs/protocols/oauth2)

The flow of the application will be the following:

1. Your users will start the Electron application.
2. As they were not signed in before, you Electron app will show them a login screen (a page provided by the authorization server).
3. After authenticating, the authorization server will provide your Electron app a _code_.
4. The Electron app will issue a request to a token endpoint to exchange this _code_ for an [access token](https://auth0.com/docs/tokens/access-token) and an [id token](https://auth0.com/docs/tokens/id-token).
5. After getting back these tokens, the Electron app will show a secured route with where users will be able to click a button to fetch the static message from the `/private` endpoint on the API.

Although simple, this workflow shows the whole picture of how you will have to integrate and secure your backend APIs and Electron apps while using OAuth 2.0 and OpenID Connect. The following screenshot shows what the app will look like when ready.

[Read more](https://auth0.com/blog/securing-electron-applications-with-openid-connect-and-oauth-2/)
