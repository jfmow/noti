import { sendNotifications } from "@/lib/sendNotifications";
export default async function notifAll(req, res) {
  res.status(200);
  if(JSON.parse(req.body).user.token == undefined){
    return res.status(429).send('Not allowed!')
  }
  const subs = await fetch(`https://news1.suddsy.dev/api/collections/subscriptions/records`, {
    method: "GET",
    headers: {
      Authorization: JSON.parse(req.body).user.token, // Set the Authorization header
    }
  });
  const data = await subs.json()
  console.log(data.items)
  if (data.items.length > 0) {
    try {
      const state = await sendNotifications(data.items, JSON.parse(req.body).msg)
      console.log(state)
      res.status(200).send('Success');
    } catch (error) {
      res.status(500).send('error')
    }
  } else {
    res.status(409).send('No subs');
  }

}