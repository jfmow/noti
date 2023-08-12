# SaveMyNotes

## An unofficial guide on how to use a text editor in 2023

| <a href="https://jamesmowat.com/">Portfolio</a> | <a href="https://savemynotes.net/">Preview this</a> |
| ----------------------------------------------- | --------------------------------------------------- |

SaveMyNotes is a text editor which uses PocketBase as it's backend (Go). It kind of looks like notion,...what ever that is.

It is basically plug and play,

1. just clone the repo and deploy it to where ever you can host nextjs

2. Download the PockeBase exe to a server and (prefered) use docker and make sure to expose port 443 or which ever you set docker to expose

3. And that's it.

4. Create an admin and paste in the schema in the PocketBase import section of settings.

> # ALERT!
>
> ### We are not using next/link because it is causing the page to randomly redirect back so until thats fixed were gonna have to stick to our own custom one :)
