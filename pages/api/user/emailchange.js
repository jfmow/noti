import { sendNotifications } from "@/lib/sendNotifications";
export default async function notifAll(req, res) {
  res.status(200);
  if(JSON.parse(req.body).user.token == undefined){
    return res.status(404).send('Not allowed!')
  }
  const subs = await fetch(`${process.env.NEXT_PUBLIC_POCKETURL}/api/collections/subscriptions/records`, {
    method: "GET",
    headers: {
      Authorization: JSON.parse(req.body).user.token, // Set the Authorization header
    }
  });
  const data = await subs.json()
  console.log(data.items)
  if (data.items.length > 0) {
    try {
      const state = await sendNotifications(data.items, {"title": "Email change alert!", "body": "Your accounts email has been changed! If this wasn't you contact support."})
      console.log(state)
      res.status(200).send('Success');
    } catch (error) {
      res.status(500).send('error')
    }
  } else {
    res.status(409).send('Not found!');
  }

}