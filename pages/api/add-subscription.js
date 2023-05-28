
export default async function addSub(req, res) {
  try {
    //await prisma.subscriptions.create({
    //  data: {
    //    endpoint: req.body.endpoint,
    //    keys: req.body.keys
    //  },
    //})
    console.log(req.body.data)
    await fetch("https://news1.suddsy.dev/api/collections/subscriptions/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.body.user.token, // Set the Authorization header
      },
      body: JSON.stringify({
        endpoint: req.body.data.endpoint,
        keys: req.body.data.keys,
        user: req.body.user.id
      }),
    });

    res.status(200).send("Done");
  } catch (error) {
    console.log(error)
    res.status(505).send("Failed to sub");
  }
}
