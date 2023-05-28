
export default async function unSub(req, res) {
  console.log(req.body)
  if(req.body.user.token == undefined){
    return res.status(429).send('Not allowed!')
  }
  try {
    const subs = await fetch("https://news1.suddsy.dev/api/collections/subscriptions/records", {
      method: "GET",
      headers: {
        Authorization: req.body.user.token, // Set the Authorization header
      }
    });
    const data = await subs.json()
    const items = data.items.filter(item => item.endpoint.trim() === req.body.data.endpoint.trim());
    items.forEach(async item => {
      console.log(item);
      await fetch(`https://news1.suddsy.dev/api/collections/subscriptions/records/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: req.body.user.token, // Set the Authorization header
        },
      });
    });


    res.status(200).send('Done')
  } catch (error) {
    res.status(500).send('Failed to delete sub')
  }
}