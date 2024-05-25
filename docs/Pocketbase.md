# Pocketbase
Pocketbase is the backend I chose to use for this project. It's an opensource project on [Github](https://github.com/pocketbase/pocketbase) and in summary it's a sqlite db in a single Go Executable. So it's fast, compact and expandable.

### What did I do then?
Because this project is kinda outof pocketbase's intended desgin to use it with this project I have expanded it using as much of its own provided Go package. So yes, you will have to download and build the pocketbase exe to use it.

The changes i've made allow for Email signon (using a token/link) and custom emails.

### The emails
The emails can be edited in the custom_emails collection and there are 2 that are currently required inorder for the app to function. This is all covered in the email.md file. But i've chosen to make them editable using the rich text editor so they are easy to make and update. They use {{.varname}} so that the internal html parser i'm using can put vars you define in the custom go expansion.

### The main project
I have tried to reduce the ammount of envirment variables for simplicty and security.
#### A List of REQUIRED website env vars:
- NEXT_PUBLIC_POCKETURL -> The url of your hosted pocketbase instance.
- PRODUCTION -> For development to prevent CORS etc errors. Must be set to true to enable them in prod.
- NEXT_PUBLIC_UNSPLASH -> Your unsplash api aplication key. The public one. Used to load unsplash images in the cover selector.
#### A List of REQUIRED pocketbase env vars:
- website_url -> the url of your hosted note website
- email_reply_to -> the reply to email address for all emails sent by pocketbase

## Get started
To actualy get started, start by cloning both this repo and the pocketbase repo (Linked in the introduction). Then using a host of your choice like vercel you can connect this repo and it will be built and run on there, make sure to add the required env vars so that it works correctly.

Now using the pocketbase repo, build the executable. The simple way is to build it on the machine you will deploy it to so clone it to that machine and use the go cli to build the root dir:
```bash
go build -o base .
```
This builds it to a file called base and builds from the current dir.

Now run the executable using
```bash
./base serve --http=0.0.0.0:8080
```
Now go to your browser and using the ip of that machine go to port 8080/_ and you should see an admin setup page.

Create an account then navigate to the settings page and import collections. Copy the schema.json file from the pocketbase repo into and save. Allow anything to be replaced. Thats it.

Now your Note app is up and running.

To get emails you need to get a STMP server connected and custom domain. Please refer to the pocketbase.io docs for more information on how to do this.

---
### My setup
To host my website i'm using vercel.

To host my pocketbase instace i'm using digital ocean and have a custom domain pointed to the public ip of my droplet. The droplet has firewall rules to block all other ports other than 443 and 80. I used the built in pocketbase --http and --https to get certs for it using the following cmd to do it all when starting up the pocketbase instance:
```bash
./base serve --https="pocketbase.suddsy.dev:443"
```
*By not defining the ```--http``` i'm disabling http.*

#### Docker setup
You can also run pocketbase in docker by building the exe then building the docker file into an image and deploying that using the compose file. The compose file also maps volumes for persistant storage to 2 external drives. You can then use cloudflare tunnels or caddy/a reverse proxy to expose pocketbase so you don't have to use the ```--http``` or ```--https``` and just use ```./base serve``` on its own (I personaly recomend this method).

#### Emails
For emails i'm using ***resend*** but you can also use gmail as it does work (i've tested it but won't explain how to here).

## Thanks

I would like to say a huge thankyou to the creator of Pocketbase as his project had given me the inspiration to create Note in the first place and without the amazing work he has done this wouldn't exist.

And if you have any problems or question just open a ticket or email me here: ```hi@suddsy.dev```

Thank you.
